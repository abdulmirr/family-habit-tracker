import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getProfiles, getSharedHabits } from "@/lib/data";
import {
  getBoardCheckIns,
  buildWeekColumns,
  buildRollingColumns,
  formatDateLabel,
} from "@/lib/board";
import { ConfigNotice } from "@/components/ConfigNotice";
import { Avatar } from "@/components/Avatar";
import { ScrollToToday } from "@/components/ScrollToToday";
import { colorClasses, getColor, getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

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
    if (err.code === "PGRST205") {
      return <ConfigNotice reason="missing-tables" detail={err.message} />;
    }
    throw e;
  }

  const checkedSet = new Set(
    checkIns.map((c) => `${c.profile_id}|${c.habit_id}|${c.date}`)
  );

  return (
    <main className="flex-1 w-full mx-auto px-5 pt-6 pb-16 max-w-3xl">
      <header className="flex items-center gap-3 mb-5">
        <Link
          href="/"
          className="-ml-2 p-2 rounded-[var(--radius-sm)] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft size={22} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-[19px] leading-tight tracking-tight">
            Family Board
          </div>
          <p className="eyebrow mt-0.5">Who did what, when</p>
        </div>
      </header>

      <div className="mb-4 flex items-center gap-2.5 flex-wrap">
        <div className="inline-flex rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-1 text-[13px] shadow-[var(--shadow-xs)]">
          <span className="px-3 py-1.5 rounded-[var(--radius-sm)] font-semibold bg-[color:var(--accent)] text-[color:var(--accent-fg)] shadow-[var(--shadow-button)]">
            Board
          </span>
          <Link
            href="/leaderboard"
            className="px-3 py-1.5 rounded-[var(--radius-sm)] font-medium text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors"
          >
            Leaderboard
          </Link>
        </div>

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

      <section className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px]">
        <span className="eyebrow">Legend</span>
        {profiles.map((p) => (
          <span key={p.id} className="inline-flex items-center gap-1.5">
            <Avatar
              name={p.name}
              avatarUrl={p.avatar_url}
              color={p.color_theme}
              size={22}
            />
            <span className="font-medium">{p.name}</span>
          </span>
        ))}
      </section>

      <div
        data-board-scroll
        className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] overflow-x-auto shadow-[var(--shadow-xs)]"
      >
        <ScrollToToday key={days} />
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-[color:var(--surface)] text-left p-3 min-w-[180px] border-b border-[color:var(--border)]">
                <span className="eyebrow">Habit</span>
              </th>
              {dateCols.map((iso) => {
                const { weekday, day, isToday } = formatDateLabel(iso);
                return (
                  <th
                    key={iso}
                    data-today-col={isToday ? "" : undefined}
                    className={cn(
                      "px-3 py-2 text-center font-semibold text-xs border-b border-[color:var(--border)] min-w-[190px]",
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
              const Icon = getIcon(h.icon);
              const c = colorClasses[getColor(h.color)];
              return (
                <tr key={h.id} className="border-b border-[color:var(--border)] last:border-b-0">
                  <td className="sticky left-0 z-10 bg-[color:var(--surface)] p-3 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0", c.bgSoft)}>
                        <Icon size={18} className={c.text} />
                      </div>
                      <span className="font-display font-semibold text-[14px] leading-tight tracking-tight">{h.name}</span>
                    </div>
                  </td>
                  {dateCols.map((iso) => {
                    const isToday = formatDateLabel(iso).isToday;
                    return (
                      <td
                        key={iso}
                        className={cn(
                          "px-3 py-2 align-middle text-center",
                          isToday && "bg-[color:var(--accent-soft)]"
                        )}
                      >
                        <div className="flex justify-center">
                          {profiles.map((p) => {
                            const checked = checkedSet.has(`${p.id}|${h.id}|${iso}`);
                            return (
                              <span
                                key={p.id}
                                title={`${p.name} ${checked ? "✓" : "—"} ${iso}`}
                                className="inline-flex"
                              >
                                <Avatar
                                  name={p.name}
                                  avatarUrl={p.avatar_url}
                                  color={p.color_theme}
                                  size={32}
                                  className={cn(
                                    "transition-opacity",
                                    checked ? "opacity-100" : "opacity-30 grayscale"
                                  )}
                                />
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

      <section className="mt-6">
        <h2 className="eyebrow mb-2 px-1">Totals this period</h2>
        <div className="grid grid-cols-5 gap-2">
          {profiles.map((p) => {
            const c = colorClasses[getColor(p.color_theme)];
            const total = checkIns.filter((ci) => ci.profile_id === p.id).length;
            const possible = habits.length * days;
            const pct = possible === 0 ? 0 : Math.round((total / possible) * 100);
            return (
              <div
                key={p.id}
                className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-2.5 text-center shadow-[var(--shadow-xs)]"
              >
                <Avatar
                  name={p.name}
                  avatarUrl={p.avatar_url}
                  color={p.color_theme}
                  size={36}
                  className="mx-auto"
                />
                <div className="text-[10px] mt-1 font-medium truncate">{p.name}</div>
                <div className={cn("font-display text-[15px] font-semibold tabular-nums mt-0.5", c.text)}>
                  {pct}%
                </div>
                <div className="text-[10px] text-[color:var(--muted)] tabular-nums">
                  {total}/{possible}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}
