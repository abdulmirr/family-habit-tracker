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
import { CalendarHeatmap } from "@/components/CalendarHeatmap";
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
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-6 pb-28">
        <header className="flex items-center gap-3 mb-7">
          <Link
            href={`/p/${name}`}
            className="-ml-2 p-2 rounded-[var(--radius-sm)] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </Link>
          <Avatar name={profile.name} avatarUrl={profile.avatar_url} color={profile.color_theme} size={44} />
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-[19px] leading-tight tracking-tight">
              {profile.name}
            </div>
            <p className="eyebrow mt-0.5">Stats &amp; streaks</p>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-2 mb-8">
          <StatBlock label="7-day" value={`${rate7}%`} />
          <StatBlock label="30-day" value={`${rate30}%`} />
          <StatBlock label="Best streak" value={`${longestStreakOverall}`} icon={<Flame size={13} />} />
        </section>

        <section>
          <div className="flex items-baseline justify-between px-1 mb-3">
            <h2 className="eyebrow">Habits</h2>
            <span className="eyebrow opacity-70">{currentMonthLabel}</span>
          </div>
          <div className="space-y-3">
            {habits.map((h) => {
              const dates = checksByHabit.get(h.id) ?? [];
              const streak = computeStreak(dates);
              const longest = computeLongestStreak(dates);
              const Icon = getIcon(h.icon);
              const c = colorClasses[getColor(h.color)];
              return (
                <div
                  key={h.id}
                  className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[var(--shadow-xs)]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center ${c.bgSoft}`}>
                      <Icon size={20} className={c.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-[15px] leading-tight">{h.name}</div>
                      <div className="text-[12px] text-[color:var(--muted)] flex items-center gap-2 mt-0.5 tabular-nums">
                        <span className={`inline-flex items-center gap-1 ${c.text}`}>
                          <Flame size={11} /> {streak}
                        </span>
                        <span className="opacity-40">·</span>
                        <span>best {longest}</span>
                      </div>
                    </div>
                  </div>
                  <CalendarHeatmap completedDates={dates} color={h.color} />
                </div>
              );
            })}
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
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] py-4 px-3 text-center shadow-[var(--shadow-xs)]">
      <div className="eyebrow">{label}</div>
      <div className="font-display text-[26px] font-semibold mt-1.5 tabular-nums tracking-tight flex items-center justify-center gap-1 leading-none">
        {icon}
        {value}
      </div>
    </div>
  );
}

