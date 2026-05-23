import { todayISO } from "./utils";

/**
 * Compute the current consecutive-day streak for a habit, given an unordered
 * list of completed check-in dates (YYYY-MM-DD strings). Counts back from today.
 * A streak is broken by any missing day. Today not yet checked still counts the
 * yesterday-anchored streak (so the streak only resets after a day is fully missed).
 */
export function computeStreak(checkedDates: string[]): number {
  if (checkedDates.length === 0) return 0;
  const set = new Set(checkedDates);
  const today = todayISO();
  // Walk back from today. If today not checked, start from yesterday (don't reset yet).
  let cursor = new Date(today + "T00:00:00");
  if (!set.has(today)) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (true) {
    const iso = isoFromDate(cursor);
    if (set.has(iso)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Longest streak ever recorded for these check-ins.
 */
export function computeLongestStreak(checkedDates: string[]): number {
  if (checkedDates.length === 0) return 0;
  const sorted = [...checkedDates].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1] + "T00:00:00");
    const cur = new Date(sorted[i] + "T00:00:00");
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    if (diffDays === 1) {
      current += 1;
      best = Math.max(best, current);
    } else if (diffDays > 1) {
      current = 1;
    }
  }
  return best;
}

function isoFromDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
