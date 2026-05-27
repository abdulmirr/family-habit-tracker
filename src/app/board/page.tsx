import Link from "next/link";
import { Settings2, ChevronRight } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getProfiles,
  getSharedHabits,
  getHabitsForProfile,
  getTodayCheckIns,
} from "@/lib/data";
import {
  getBoardCheckIns,
  buildWeekColumns,
  buildRollingColumns,
  formatDateLabel,
} from "@/lib/board";
import { ConfigNotice } from "@/components/ConfigNotice";
import { Avatar } from "@/components/Avatar";
import { ProgressRing } from "@/components/ProgressRing";
import { ScrollToToday } from "@/components/ScrollToToday";
import { TopTabs } from "@/components/TopTabs";
import { PixelCheck } from "@/components/PixelCheck";
import { cardClassName } from "@/components/ui/Card";
import { slugify, cn } from "@/lib/utils";
import { colorClasses, getColor } from "@/lib/icons";

export const dynamic = "force-dynamic";

const RANGE_OPTIONS = [7, 30] as const;
type RangeOption = (typeof RANGE_OPTIONS)[number];

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  if (!isSupabaseConfigured) return <ConfigNotice />;

  const { days: daysParam } = await searchParams;
  const days: RangeOption =
    RANGE_OPTIONS.find((d) => d === Number(daysParam)) ?? 7;

  const dateCols = days === 7 ? buildWeekColumns() : buildRollingColumns(days);
  const since = [...dateCols].sort()[0];

  let profiles, habits, checkIns;
  try {
    [profiles, habits, checkIns] = await Promise.all([
      getProfiles(),
      getSharedHabits(),
      getBoardCheckIns(since),
    ]);
  } catch (e) {
    const err = e as { code?: string; message?: string };
    const msg = err.message ?? (e instanceof Error ? e.message : String(e));
    if (err.code === "PGRST205" || msg.includes("Could not find the table") || msg.includes("schema cache")) {
      return <ConfigNotice reason="missing-tables" detail={msg} />;
    }
    throw e;
  }

  // Per-person progress for today (counts shared + personal habits).
  const progress = await Promise.all(
    profiles.map(async (p) => {
      const [allHabits, todayCheckIns] = await Promise.all([
        getHabitsForProfile(p.id),
        getTodayCheckIns(p.id),
      ]);
      const total = allHabits.length;
      const done = todayCheckIns.length;
      return { id: p.id, total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
    })
  );
  const progressMap = new Map(progress.map((p) => [p.id, p]));

  const checkedSet = new Set(
    checkIns.map((c) => `${c.profile_id}|${c.habit_id}|${c.date}`)
  );

  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const monthDay = now.toLocaleDateString("en-US", { month: "long", day: "numeric" });

  return (
    <main className="flex-1 w-full mx-auto px-5 pt-6 pb-20 max-w-3xl">
      <TopTabs active="board" />

      <header className="mb-6">
        <p className="eyebrow">{weekday}</p>
        <h1 className="font-display text-[2.25rem] font-semibold leading-[1.02] mt-1.5 tracking-tight">
          {monthDay}
        </h1>
      </header>

      {/* ---- Check off today ---- */}
      <section className="mb-9">
        <h2 className="eyebrow mb-2.5">Tap to check off today</h2>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {profiles.map((p) => {
            const stat = progressMap.get(p.id)!;
            const c = colorClasses[getColor(p.color_theme)];
            return (
              <li key={p.id}>
                <Link
                  href={`/p/${slugify(p.name)}`}
                  className={`${cardClassName("interactive")} group flex items-center gap-4 p-3.5`}
                >
                  <ProgressRing
                    size={56}
                    stroke={2}
                    percent={stat.percent}
                    fillClassName={c.bg.replace("bg-", "stroke-")}
                  >
                    <Avatar name={p.name} avatarUrl={p.avatar_url} color={p.color_theme} size={48} />
                  </ProgressRing>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-[18px] leading-tight">
                      {p.name}
                    </div>
                    <div className="text-[13px] text-[color:var(--muted)] mt-0.5 tabular-nums">
                      {stat.done} of {stat.total} habits
                    </div>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className={`font-display text-[20px] font-semibold tabular-nums leading-none ${c.text}`}>
                      {stat.percent}
                    </span>
                    <span className="text-[12px] text-[color:var(--muted)] font-medium">%</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-[color:var(--muted)] -ml-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---- Family table ---- */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display font-semibold text-[20px] leading-tight tracking-tight">
            Family habits
          </h2>

          <div className="inline-flex rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-1 text-[13px] shadow-[var(--shadow-xs)]">
            {RANGE_OPTIONS.map((opt) => (
              <Link
                key={opt}
                href={`/board?days=${opt}`}
                className={cn(
                  "px-3 py-1.5 rounded-[var(--radius-sm)] font-medium tabular-nums transition-colors",
                  opt === days
                    ? "bg-[color:var(--accent)] text-[color:var(--accent-fg)] shadow-[var(--shadow-button)]"
                    : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                )}
              >
                {opt}d
              </Link>
            ))}
          </div>
        </div>

        <div
          data-board-scroll
          className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] overflow-x-auto shadow-[var(--shadow-xs)] snap-x snap-mandatory scroll-pl-[120px] md:snap-none md:scroll-pl-0"
        >
          <ScrollToToday key={days} />
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-[color:var(--surface)] text-left p-3 min-w-[120px] border-b border-[color:var(--border)]">
                  <span className="eyebrow">Habit</span>
                </th>
                {dateCols.map((iso) => {
                  const { weekday, day, isToday } = formatDateLabel(iso);
                  return (
                    <th
                      key={iso}
                      data-today-col={isToday ? "" : undefined}
                      className={cn(
                        "px-1.5 py-2 text-center font-semibold text-xs border-b border-[color:var(--border)] min-w-[calc(100vw-160px)] md:min-w-[240px] snap-start",
                        isToday && "bg-[color:var(--accent-soft)]"
                      )}
                    >
                      <div
                        className={cn(
                          "uppercase tracking-[0.12em] text-[10px] font-semibold",
                          isToday ? "text-[color:var(--accent)]" : "text-[color:var(--muted)]"
                        )}
                      >
                        {weekday}
                      </div>
                      <div
                        className={cn(
                          "font-display text-[15px] tabular-nums mt-0.5",
                          isToday ? "text-[color:var(--accent)] font-semibold" : ""
                        )}
                      >
                        {day}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {habits.map((h) => {
                return (
                  <tr key={h.id} className="border-b border-[color:var(--border)] last:border-b-0">
                    <td className="sticky left-0 z-10 bg-[color:var(--surface)] p-3 align-middle">
                      <span className="font-display font-semibold text-[13px] leading-tight tracking-tight">{h.name}</span>
                    </td>
                    {dateCols.map((iso) => {
                      const isToday = formatDateLabel(iso).isToday;
                      return (
                        <td
                          key={iso}
                          className={cn(
                            "px-1.5 py-2 align-middle text-center",
                            isToday && "bg-[color:var(--accent-soft)]"
                          )}
                        >
                          <div className="flex justify-center items-center gap-0.5 md:gap-1">
                            {profiles.map((p) => {
                              const checked = checkedSet.has(`${p.id}|${h.id}|${iso}`);
                              return (
                                <span
                                  key={p.id}
                                  title={`${p.name} ${checked ? "✓" : "—"} ${iso}`}
                                  className="relative inline-flex"
                                >
                                  <Avatar
                                    name={p.name}
                                    avatarUrl={p.avatar_url}
                                    color={p.color_theme}
                                    size={34}
                                    className={cn(
                                      "transition-opacity",
                                      checked ? "opacity-100" : "opacity-30 grayscale"
                                    )}
                                  />
                                  {checked && (
                                    <span className="pointer-events-none absolute -bottom-0.5 right-[5px]">
                                      <PixelCheck size={12} />
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 flex justify-center">
        <Link
          href="/manage"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
        >
          <Settings2 size={14} />
          Manage habits
        </Link>
      </div>
    </main>
  );
}
