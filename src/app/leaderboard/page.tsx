import Link from "next/link";
import { ChevronLeft, Flame, Crown } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getProfiles,
  getHabitsForProfile,
  getCheckInsForProfile,
} from "@/lib/data";
import { ConfigNotice } from "@/components/ConfigNotice";
import { Avatar } from "@/components/Avatar";
import { computeStreak } from "@/lib/streaks";
import { colorClasses, getColor } from "@/lib/icons";
import { slugify, daysAgoISO } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  if (!isSupabaseConfigured) return <ConfigNotice />;

  const profiles = await getProfiles();
  const since7 = daysAgoISO(7);

  const rows = await Promise.all(
    profiles.map(async (p) => {
      const [habits, checkIns] = await Promise.all([
        getHabitsForProfile(p.id),
        getCheckInsForProfile(p.id, 365),
      ]);
      const last7 = checkIns.filter((c) => c.date >= since7);
      const possible7 = habits.length * 7;
      const rate7 = possible7 === 0 ? 0 : Math.round((last7.length / possible7) * 100);

      const byHabit = new Map<string, string[]>();
      for (const ci of checkIns) {
        const arr = byHabit.get(ci.habit_id) ?? [];
        arr.push(ci.date);
        byHabit.set(ci.habit_id, arr);
      }
      const bestStreak = Math.max(0, ...habits.map((h) => computeStreak(byHabit.get(h.id) ?? [])));

      return {
        profile: p,
        weekChecks: last7.length,
        weekPossible: possible7,
        rate7,
        bestStreak,
      };
    })
  );

  const byWeekChecks = [...rows].sort((a, b) => b.weekChecks - a.weekChecks);
  const byStreak = [...rows].sort((a, b) => b.bestStreak - a.bestStreak);
  const champion = byWeekChecks[0];
  const streakLeader = byStreak[0];

  return (
    <main className="flex-1 w-full max-w-md mx-auto px-5 pt-6 pb-16">
      <header className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="-ml-2 p-2 rounded-[var(--radius-sm)] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-[19px] leading-tight tracking-tight">
            Leaderboard
          </div>
          <p className="eyebrow mt-0.5">Last 7 days</p>
        </div>
      </header>

      <div className="mb-5 inline-flex rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-1 text-[13px] shadow-[var(--shadow-xs)]">
        <Link
          href="/board"
          className="px-3 py-1.5 rounded-[var(--radius-sm)] font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
        >
          Board
        </Link>
        <span className="px-3 py-1.5 rounded-[var(--radius-sm)] font-semibold bg-[color:var(--accent)] text-[color:var(--accent-fg)] shadow-[var(--shadow-button)]">
          Leaderboard
        </span>
      </div>

      <section className="grid grid-cols-2 gap-2.5 mb-6">
        <HighlightCard
          eyebrow="Most active"
          emoji="🏆"
          name={champion?.profile.name ?? "—"}
          subline={`${champion?.weekChecks ?? 0} checks this week`}
        />
        <HighlightCard
          eyebrow="Streak leader"
          emoji="🔥"
          name={streakLeader?.profile.name ?? "—"}
          subline={`${streakLeader?.bestStreak ?? 0} day streak`}
        />
      </section>

      <h2 className="eyebrow px-1 mb-3">This week</h2>
      <ul className="space-y-2">
        {byWeekChecks.map((row, i) => {
          const c = colorClasses[getColor(row.profile.color_theme)];
          const pct = row.weekPossible === 0 ? 0 : Math.round((row.weekChecks / row.weekPossible) * 100);
          return (
            <li key={row.profile.id}>
              <Link
                href={`/p/${slugify(row.profile.name)}/stats`}
                className={cn(
                  "flex items-center gap-3 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-3",
                  "shadow-[var(--shadow-xs)] transition-all duration-150",
                  "hover:shadow-[var(--shadow-sm)] hover:-translate-y-px",
                  "active:translate-y-0 active:shadow-none"
                )}
              >
                <div className="w-7 text-center font-display font-semibold tabular-nums">
                  {i === 0 ? (
                    <Crown size={18} className="mx-auto text-amber-500" />
                  ) : (
                    <span className="text-[13px] text-[color:var(--muted)]">{i + 1}</span>
                  )}
                </div>
                <Avatar name={row.profile.name} avatarUrl={row.profile.avatar_url} color={row.profile.color_theme} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold leading-tight tracking-tight">{row.profile.name}</div>
                  <div className="text-[12px] text-[color:var(--muted)] flex items-center gap-2 tabular-nums mt-0.5">
                    <span>{row.weekChecks} / {row.weekPossible} checks</span>
                    {row.bestStreak > 0 && (
                      <span className="inline-flex items-center gap-0.5">
                        <Flame size={11} /> {row.bestStreak}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-[color:var(--border)] overflow-hidden">
                    <div className={`h-full ${c.bg} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="font-display text-[15px] font-semibold tabular-nums">{pct}%</div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

function HighlightCard({
  eyebrow,
  emoji,
  name,
  subline,
}: {
  eyebrow: string;
  emoji: string;
  name: string;
  subline: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-3.5 shadow-[var(--shadow-xs)]">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-base leading-none">{emoji}</span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <div className="font-display font-semibold text-[17px] tracking-tight truncate">{name}</div>
      <div className="text-[12px] text-[color:var(--muted)] truncate mt-0.5">{subline}</div>
    </div>
  );
}
