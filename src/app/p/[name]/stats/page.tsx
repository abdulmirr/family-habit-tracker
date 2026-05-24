import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Flame } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getProfiles,
  getHabitsForProfile,
  getCheckInsForProfile,
} from "@/lib/data";
import { ConfigNotice } from "@/components/ConfigNotice";
import { BottomNav } from "@/components/BottomNav";
import { Avatar } from "@/components/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
import { PixelPanel } from "@/components/PixelPanel";
import { computeStreak, computeLongestStreak } from "@/lib/streaks";
import { colorClasses, getColor, getIcon } from "@/lib/icons";
import { slugify, daysAgoISO } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StatsPage({ params }: { params: Promise<{ name: string }> }) {
  if (!isSupabaseConfigured) return <ConfigNotice />;

  const { name } = await params;
  const profiles = await getProfiles();
  const profile = profiles.find((p) => slugify(p.name) === name);
  if (!profile) notFound();

  const [habits, checkIns] = await Promise.all([
    getHabitsForProfile(profile.id),
    getCheckInsForProfile(profile.id, 365),
  ]);

  const checksByHabit = new Map<string, string[]>();
  for (const ci of checkIns) {
    const arr = checksByHabit.get(ci.habit_id) ?? [];
    arr.push(ci.date);
    checksByHabit.set(ci.habit_id, arr);
  }

  const since7 = daysAgoISO(7);
  const last7 = checkIns.filter((c) => c.date >= since7);
  const possible7 = habits.length * 7;
  const rate7 = possible7 === 0 ? 0 : Math.round((last7.length / possible7) * 100);

  const since30 = daysAgoISO(30);
  const last30 = checkIns.filter((c) => c.date >= since30);
  const possible30 = habits.length * 30;
  const rate30 = possible30 === 0 ? 0 : Math.round((last30.length / possible30) * 100);

  const longestStreakOverall = Math.max(
    0,
    ...habits.map((h) => computeLongestStreak(checksByHabit.get(h.id) ?? []))
  );

  const currentMonthLabel = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const profileColor = colorClasses[getColor(profile.color_theme)];

  return (
    <>
      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-6 pb-24">
        <header className="mb-4 flex items-center gap-3">
          <Link
            href={`/p/${name}`}
            className="-ml-2 p-2 rounded-[var(--radius-pixel)] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </Link>

          <div className="shrink-0 rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)] bg-[color:var(--surface-2)] p-[3px] shadow-[var(--shadow-pixel)]">
            <Avatar
              name={profile.name}
              avatarUrl={profile.avatar_url}
              color={profile.color_theme}
              size={36}
              className="rounded-[3px]"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="pixel-eyebrow">Player stats</p>
            <div className="font-display font-semibold text-[19px] leading-[1.05] tracking-tight">
              {profile.name}
            </div>
          </div>
          <ThemeToggle />
        </header>

        <section className="grid grid-cols-3 gap-1.5 mb-5">
          <StatBlock label="7d" value={`${rate7}`} suffix="%" />
          <StatBlock label="30d" value={`${rate30}`} suffix="%" />
          <StatBlock
            label="Best"
            value={`${longestStreakOverall}`}
            icon={<Flame size={11} strokeWidth={2.4} className={profileColor.text} />}
          />
        </section>

        <section>
          <div className="flex items-baseline justify-between px-1 mb-2">
            <h2 className="pixel-eyebrow">Habit log</h2>
            <span className="pixel-eyebrow opacity-70">{currentMonthLabel}</span>
          </div>
          <div className="space-y-2">
            {habits.map((h) => {
              const dates = checksByHabit.get(h.id) ?? [];
              const streak = computeStreak(dates);
              const longest = computeLongestStreak(dates);
              const Icon = getIcon(h.icon);
              const c = colorClasses[getColor(h.color)];
              return (
                <PixelPanel key={h.id} className="p-2.5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-8 h-8 rounded-[var(--radius-pixel)] border-2 border-[color:var(--border-strong)] flex items-center justify-center shrink-0 ${c.bgSoft}`}
                    >
                      <Icon size={16} className={c.text} strokeWidth={2.4} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-[13.5px] leading-tight truncate">
                        {h.name}
                      </div>
                      <div className="text-[11px] text-[color:var(--muted)] flex items-center gap-1.5 mt-0.5 tabular-nums">
                        <span className={`inline-flex items-center gap-0.5 font-semibold ${c.text}`}>
                          <Flame size={10} strokeWidth={2.4} />
                          {streak}d
                        </span>
                        <span className="opacity-40">·</span>
                        <span>best {longest}</span>
                      </div>
                    </div>
                  </div>
                  <CalendarHeatmap completedDates={dates} color={h.color} />
                </PixelPanel>
              );
            })}
            {habits.length === 0 && (
              <PixelPanel padded className="text-center text-[12px] text-[color:var(--muted)]">
                No habits yet — add some from the Habits tab.
              </PixelPanel>
            )}
          </div>
        </section>
      </main>
      <BottomNav name={name} />
    </>
  );
}

function StatBlock({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon?: React.ReactNode;
}) {
  return (
    <PixelPanel className="py-2 px-1.5 text-center">
      <div className="pixel-eyebrow text-[9px]">{label}</div>
      <div className="font-display text-[20px] font-semibold mt-0.5 tabular-nums tracking-tight flex items-baseline justify-center gap-0.5 leading-none">
        {icon}
        <span>{value}</span>
        {suffix && (
          <span className="text-[10px] text-[color:var(--muted)] font-medium tracking-normal">
            {suffix}
          </span>
        )}
      </div>
    </PixelPanel>
  );
}
