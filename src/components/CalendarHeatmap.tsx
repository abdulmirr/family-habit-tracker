import { colorClasses, getColor } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Props = {
  /** ISO dates (YYYY-MM-DD) that are completed */
  completedDates: string[];
  color: string;
};

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarHeatmap({ completedDates, color }: Props) {
  const set = new Set(completedDates);
  const c = colorClasses[getColor(color)];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDay = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();

  type Cell = { day: number; iso: string; checked: boolean; isToday: boolean; isFuture: boolean };
  const cells: (Cell | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      day: d,
      iso,
      checked: set.has(iso),
      isToday: d === todayDay,
      isFuture: d > todayDay,
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      <div className="grid grid-cols-7 gap-[2px] mb-1">
        {WEEKDAY_LABELS.map((d, i) => (
          <div
            key={i}
            className="text-[9px] font-bold tracking-[0.1em] text-[color:var(--muted)]/70 text-center"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-[2px]">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} className="aspect-square" />;
          return (
            <div
              key={i}
              title={`${cell.iso}${cell.checked ? " ✓" : ""}`}
              className={cn(
                "aspect-square rounded-[2px] flex items-center justify-center text-[9px] font-semibold tabular-nums leading-none",
                cell.checked
                  ? cn(c.bg, "text-white/90")
                  : cell.isFuture
                    ? "bg-transparent text-[color:var(--muted)]/30 border border-[color:var(--border)]"
                    : "bg-[color:var(--surface-2)] text-[color:var(--muted)]/60 border border-[color:var(--border)]",
                cell.isToday && !cell.checked && "border-[1.5px] border-[color:var(--foreground)] text-[color:var(--foreground)]",
                cell.isToday && cell.checked && "ring-[1.5px] ring-[color:var(--foreground)]/40"
              )}
              style={
                cell.checked
                  ? { boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.22)" }
                  : undefined
              }
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
