import { supabase } from "./supabase";

export type BoardCheckIn = { profile_id: string; habit_id: string; date: string };

export async function getBoardCheckIns(since: string): Promise<BoardCheckIn[]> {
  const { data, error } = await supabase()
    .from("check_ins")
    .select("profile_id, habit_id, date")
    .gte("date", since);
  if (error) throw error;
  return (data as BoardCheckIn[]) ?? [];
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Current calendar week, Monday → Sunday, chronological left-to-right. */
export function buildWeekColumns(): string[] {
  const today = new Date();
  const dow = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    out.push(toISO(d));
  }
  return out;
}

/** Rolling N-day window, latest first (reverse chronological). */
export function buildRollingColumns(days: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(toISO(d));
  }
  return out;
}

export function formatDateLabel(iso: string): { weekday: string; day: string; isToday: boolean } {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: "long" }),
    day: String(d.getDate()),
    isToday,
  };
}
