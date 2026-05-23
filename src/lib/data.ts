import { supabase } from "./supabase";
import { todayISO, daysAgoISO } from "./utils";
import { computeStreak } from "./streaks";
import { streakBadgesForLevel } from "./badges";
import type { Profile, Habit, CheckIn, Badge, BadgeType, HabitWithStats } from "./types";

// ----- Profiles -----

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getProfileByName(name: string): Promise<Profile | null> {
  const { data, error } = await supabase()
    .from("profiles")
    .select("*")
    .ilike("name", name)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

// ----- Habits -----

export async function getHabitsForProfile(profileId: string): Promise<Habit[]> {
  // Shared (owner_id null) OR personal to this profile
  const { data, error } = await supabase()
    .from("habits")
    .select("*")
    .eq("is_active", true)
    .or(`owner_id.is.null,owner_id.eq.${profileId}`)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getSharedHabits(): Promise<Habit[]> {
  const { data, error } = await supabase()
    .from("habits")
    .select("*")
    .is("owner_id", null)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPersonalHabits(profileId: string): Promise<Habit[]> {
  const { data, error } = await supabase()
    .from("habits")
    .select("*")
    .eq("owner_id", profileId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createHabit(input: {
  name: string;
  icon: string;
  color: string;
  owner_id: string | null;
}): Promise<Habit> {
  const { data, error } = await supabase()
    .from("habits")
    .insert({
      name: input.name,
      icon: input.icon,
      color: input.color,
      owner_id: input.owner_id,
      is_active: true,
      sort_order: 999,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deactivateHabit(habitId: string): Promise<void> {
  const { error } = await supabase().from("habits").update({ is_active: false }).eq("id", habitId);
  if (error) throw error;
}

// ----- Check-ins -----

export async function getCheckInsForProfile(
  profileId: string,
  sinceDaysAgo = 365
): Promise<CheckIn[]> {
  const since = daysAgoISO(sinceDaysAgo);
  const { data, error } = await supabase()
    .from("check_ins")
    .select("*")
    .eq("profile_id", profileId)
    .gte("date", since)
    .order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTodayCheckIns(profileId: string): Promise<CheckIn[]> {
  const { data, error } = await supabase()
    .from("check_ins")
    .select("*")
    .eq("profile_id", profileId)
    .eq("date", todayISO());
  if (error) throw error;
  return data ?? [];
}

export async function toggleCheckIn(
  profileId: string,
  habitId: string,
  checked: boolean
): Promise<void> {
  const date = todayISO();
  if (checked) {
    const { error } = await supabase()
      .from("check_ins")
      .insert({ profile_id: profileId, habit_id: habitId, date })
      .select();
    // Ignore unique-violation: row already exists (re-checking)
    if (error && !`${error.message}`.includes("duplicate")) throw error;
  } else {
    const { error } = await supabase()
      .from("check_ins")
      .delete()
      .eq("profile_id", profileId)
      .eq("habit_id", habitId)
      .eq("date", date);
    if (error) throw error;
  }
}

// ----- Habits with computed stats -----

export async function getHabitsWithStats(profileId: string): Promise<HabitWithStats[]> {
  const [habits, checkIns] = await Promise.all([
    getHabitsForProfile(profileId),
    getCheckInsForProfile(profileId, 365),
  ]);
  const today = todayISO();
  const byHabit = new Map<string, string[]>();
  for (const ci of checkIns) {
    const arr = byHabit.get(ci.habit_id) ?? [];
    arr.push(ci.date);
    byHabit.set(ci.habit_id, arr);
  }
  return habits.map((h) => {
    const dates = byHabit.get(h.id) ?? [];
    return {
      ...h,
      streak: computeStreak(dates),
      checkedToday: dates.includes(today),
    };
  });
}

// ----- Badges -----

export async function getBadgesForProfile(profileId: string): Promise<Badge[]> {
  const { data, error } = await supabase()
    .from("badges")
    .select("*")
    .eq("profile_id", profileId)
    .order("earned_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/**
 * After a check-in toggle, evaluate which badges this profile should have
 * for this habit (streak badges) and any overall badges (perfect day).
 * Inserts any new badge rows and returns the newly earned types.
 */
export async function evaluateBadgesAfterCheckIn(
  profileId: string,
  habitId: string
): Promise<BadgeType[]> {
  const newlyEarned: BadgeType[] = [];

  // 1. Per-habit streak badges
  const { data: rawCheckIns } = await supabase()
    .from("check_ins")
    .select("date")
    .eq("profile_id", profileId)
    .eq("habit_id", habitId);
  const dates = (rawCheckIns ?? []).map((r: { date: string }) => r.date);
  const streak = computeStreak(dates);
  const eligible = streakBadgesForLevel(streak);

  if (eligible.length > 0) {
    const { data: existing } = await supabase()
      .from("badges")
      .select("badge_type")
      .eq("profile_id", profileId)
      .eq("habit_id", habitId)
      .in("badge_type", eligible);
    const have = new Set((existing ?? []).map((b: { badge_type: string }) => b.badge_type));
    const toInsert = eligible.filter((t) => !have.has(t));
    if (toInsert.length > 0) {
      const rows = toInsert.map((t) => ({
        profile_id: profileId,
        habit_id: habitId,
        badge_type: t,
      }));
      const { error } = await supabase().from("badges").insert(rows);
      if (!error) newlyEarned.push(...toInsert);
    }
  }

  // 2. Perfect day: all active habits (shared + personal) for this profile checked today
  const habits = await getHabitsForProfile(profileId);
  const todayCheckIns = await getTodayCheckIns(profileId);
  const checkedToday = new Set(todayCheckIns.map((c) => c.habit_id));
  const allChecked = habits.length > 0 && habits.every((h) => checkedToday.has(h.id));
  if (allChecked) {
    const { data: existing } = await supabase()
      .from("badges")
      .select("id")
      .eq("profile_id", profileId)
      .is("habit_id", null)
      .eq("badge_type", "perfect_day")
      .gte("earned_at", todayISO());
    if (!existing || existing.length === 0) {
      const { error } = await supabase()
        .from("badges")
        .insert({ profile_id: profileId, habit_id: null, badge_type: "perfect_day" });
      if (!error) newlyEarned.push("perfect_day");
    }
  }

  return newlyEarned;
}
