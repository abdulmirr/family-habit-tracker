import { supabase } from "./supabase";
import { todayISO, daysAgoISO } from "./utils";

export type BoardCheckIn = { profile_id: string; habit_id: string; date: string };

export async function getBoardCheckIns(since: string): Promise<BoardCheckIn[]> {
  const { data, error } = await supabase()
    .from("check_ins")
    .select("profile_id, habit_id, date")
    .gte("date", since);
  if (error) throw error;
  return (data as BoardCheckIn[]) ?? [];
}

/** Current calendar week, Monday → Sunday, chronological left-to-right. */
export function buildWeekColumns(): string[] {
  const today = todayISO();
  // Parse the zone-local Y-M-D as UTC noon so day-of-week math is timezone-agnostic.
  const anchor = new Date(`${today}T12:00:00Z`);
  const dow = anchor.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    out.push(daysAgoISO(daysFromMonday - i));
  }
  return out;
}

/** Rolling N-day window, latest first (reverse chronological). */
export function buildRollingColumns(days: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < days; i++) {
    out.push(daysAgoISO(i));
  }
  return out;
}

export function formatDateLabel(iso: string): { weekday: string; day: string; isToday: boolean } {
  const d = new Date(`${iso}T12:00:00Z`);
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: "long", timeZone: "UTC" }),
    day: String(d.getUTCDate()),
    isToday: iso === todayISO(),
  };
}
