import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getProfiles,
  getHabitsForProfile,
  getCheckInsForProfile,
} from "@/lib/data";
import { ConfigNotice } from "@/components/ConfigNotice";
import { Avatar } from "@/components/Avatar";
import { TopTabs } from "@/components/TopTabs";
import { PixelFlame, PixelTrophy } from "@/components/PixelSprites";
import { computeStreak } from "@/lib/streaks";
import { colorClasses, getColor } from "@/lib/icons";
import { slugify, daysAgoISO } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

type Row = {
  profile: Profile;
  weekChecks: number;
  weekPossible: number;
  rate7: number;
  bestStreak: number;
};

export default async function LeaderboardPage() {
  if (!isSupabaseConfigured) return <ConfigNotice />;

  const profiles = await getProfiles();
  const since7 = daysAgoISO(7);

  const rows: Row[] = await Promise.all(
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
      <TopTabs active="leaderboard" />

      <header className="mb-5">
        <h1 className="font-display font-semibold text-[28px] leading-tight tracking-tight">
          Leaderboard
        </h1>
        <p className="pixel-eyebrow mt-1">Last 7 days</p>
      </header>

      <section className="grid grid-cols-2 gap-3 mb-7">
        <ChampionCard
          label="Most active"
          icon={<PixelTrophy size={20} />}
          profile={champion?.profile}
          valueLabel={`${champion?.weekChecks ?? 0}`}
          valueSuffix={`/ ${champion?.weekPossible ?? 0}`}
          subline="checks · week"
        />
        <ChampionCard
          label="Streak leader"
          icon={<PixelFlame size={20} />}
          profile={streakLeader?.profile}
          valueLabel={`${streakLeader?.bestStreak ?? 0}`}
          valueSuffix="d"
          subline="best streak"
        />
      </section>

      <h2 className="pixel-eyebrow px-1 mb-2.5">Standings</h2>
      <ul className="space-y-2">
        {byWeekChecks.map((row, i) => {
          const c = colorClasses[getColor(row.profile.color_theme)];
          const pct =
            row.weekPossible === 0 ? 0 : Math.round((row.weekChecks / row.weekPossible) * 100);
          return (
            <li key={row.profile.id}>
              <Link
                href={`/p/${slugify(row.profile.name)}/stats`}
                className={cn(
                  "group flex items-center gap-2.5 p-2.5",
                  "rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)]",
                  "bg-[color:var(--surface)] shadow-[var(--shadow-pixel)]",
                  "transition-[transform,box-shadow] duration-75",
                  "active:translate-y-[3px] active:shadow-[var(--shadow-pixel-pressed)]"
                )}
              >
                <RankBadge rank={i + 1} />

                <div className="shrink-0 rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)] bg-[color:var(--surface-2)] p-[2px]">
                  <Avatar
                    name={row.profile.name}
                    avatarUrl={row.profile.avatar_url}
                    color={row.profile.color_theme}
                    size={32}
                    className="rounded-[2px]"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-[14px] leading-tight tracking-tight truncate">
                    {row.profile.name}
                  </div>
                  <div className="text-[11px] text-[color:var(--muted)] flex items-center gap-1.5 tabular-nums mt-0.5">
                    <span className="font-semibold">
                      {row.weekChecks}
                      <span className="opacity-60">/{row.weekPossible}</span>
                    </span>
                    {row.bestStreak > 0 && (
                      <>
                        <span className="opacity-40">·</span>
                        <span className="inline-flex items-center gap-1">
                          <PixelFlame size={12} />
                          {row.bestStreak}d
                        </span>
                      </>
                    )}
                  </div>
                  {/* Chunky pixel progress bar */}
                  <div className="mt-1.5 h-2 rounded-[2px] border border-[color:var(--border-strong)] bg-[color:var(--surface-2)] overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-500", c.bg)}
                      style={{
                        width: `${pct}%`,
                        boxShadow:
                          "inset 0 -1px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25)",
                      }}
                    />
                  </div>
                </div>

                <div className="font-display text-[16px] font-semibold tabular-nums leading-none">
                  {pct}
                  <span className="text-[10px] text-[color:var(--muted)] font-medium ml-0.5">
                    %
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

// ----------------------------------------------------------------------------

function ChampionCard({
  label,
  icon,
  profile,
  valueLabel,
  valueSuffix,
  subline,
}: {
  label: string;
  icon: React.ReactNode;
  profile: Profile | undefined;
  valueLabel: string;
  valueSuffix?: string;
  subline: string;
}) {
  // Fixed-height rows so both cards align horizontally regardless of icon.
  return (
    <div className="flex flex-col items-center text-center px-1">
      {/* Label */}
      <div className="h-4 flex items-center mb-2.5">
        <span className="pixel-eyebrow">{label}</span>
      </div>

      {profile ? (
        <>
          {/* Avatar — fixed height so it aligns across cards */}
          <div className="h-[60px] flex items-center justify-center mb-2">
            <div className="rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)] bg-[color:var(--surface-2)] p-[3px] shadow-[var(--shadow-pixel)]">
              <Avatar
                name={profile.name}
                avatarUrl={profile.avatar_url}
                color={profile.color_theme}
                size={52}
                className="rounded-[3px]"
              />
            </div>
          </div>

          {/* Name */}
          <div className="h-[18px] flex items-center font-display font-semibold text-[14px] leading-tight tracking-tight truncate w-full justify-center">
            {profile.name}
          </div>

          {/* Stat row — pixel sprite sits inline next to the number */}
          <div className="h-[28px] flex items-center justify-center gap-1.5 mt-1">
            <span className="pixel-art shrink-0">{icon}</span>
            <div className="font-display text-[22px] font-semibold tabular-nums tracking-tight leading-none flex items-baseline gap-0.5">
              <span>{valueLabel}</span>
              {valueSuffix && (
                <span className="text-[11px] text-[color:var(--muted)] font-medium">
                  {valueSuffix}
                </span>
              )}
            </div>
          </div>

          <div className="text-[10px] text-[color:var(--muted)] mt-1 uppercase tracking-[0.12em] font-semibold">
            {subline}
          </div>
        </>
      ) : (
        <div className="text-[12px] text-[color:var(--muted)] py-4">No data yet</div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------

// Top-3 medal tints; everyone else gets a neutral pixel chip.
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div
        className="shrink-0 w-8 h-8 rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)] bg-amber-400 flex items-center justify-center font-display text-[15px] font-bold text-amber-950 tabular-nums leading-none"
        style={{ boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)" }}
        aria-label="Rank 1"
      >
        1
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div
        className="shrink-0 w-8 h-8 rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)] bg-slate-300 dark:bg-slate-400 flex items-center justify-center font-display text-[15px] font-bold text-slate-800 tabular-nums leading-none"
        style={{ boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)" }}
        aria-label="Rank 2"
      >
        2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div
        className="shrink-0 w-8 h-8 rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)] bg-amber-700 flex items-center justify-center font-display text-[15px] font-bold text-amber-50 tabular-nums leading-none"
        style={{ boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.25)" }}
        aria-label="Rank 3"
      >
        3
      </div>
    );
  }
  return (
    <div
      className="shrink-0 w-8 h-8 rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)] bg-[color:var(--surface-2)] flex items-center justify-center font-display text-[14px] font-semibold text-[color:var(--muted)] tabular-nums leading-none"
      aria-label={`Rank ${rank}`}
    >
      {rank}
    </div>
  );
}
