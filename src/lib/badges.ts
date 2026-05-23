import type { BadgeType } from "./types";

export const STREAK_TIERS: { type: BadgeType; days: number; label: string; emoji: string }[] = [
  { type: "streak_3",   days: 3,   label: "Getting Started",   emoji: "🌱" },
  { type: "streak_7",   days: 7,   label: "One Week Strong",   emoji: "🔥" },
  { type: "streak_14",  days: 14,  label: "Two Weeks",         emoji: "⚡" },
  { type: "streak_30",  days: 30,  label: "Habit Formed",      emoji: "💎" },
  { type: "streak_60",  days: 60,  label: "Disciplined",       emoji: "🏆" },
  { type: "streak_100", days: 100, label: "Centurion",         emoji: "👑" },
];

export const OVERALL_BADGES: Record<
  Extract<BadgeType, "perfect_day" | "perfect_week" | "family_champion">,
  { label: string; emoji: string; description: string }
> = {
  perfect_day:     { label: "Perfect Day",     emoji: "✨", description: "All habits checked off in a single day" },
  perfect_week:    { label: "Perfect Week",    emoji: "🌟", description: "Every habit, every day, for 7 days" },
  family_champion: { label: "Family Champion", emoji: "👑", description: "Most check-ins in a week" },
};

/**
 * Given a habit's current streak, return all streak badge types that should be unlocked.
 */
export function streakBadgesForLevel(streak: number): BadgeType[] {
  return STREAK_TIERS.filter((t) => streak >= t.days).map((t) => t.type);
}

export function badgeLabel(type: BadgeType): { label: string; emoji: string } {
  const tier = STREAK_TIERS.find((t) => t.type === type);
  if (tier) return { label: tier.label, emoji: tier.emoji };
  const overall = OVERALL_BADGES[type as keyof typeof OVERALL_BADGES];
  if (overall) return { label: overall.label, emoji: overall.emoji };
  return { label: type, emoji: "🏅" };
}
