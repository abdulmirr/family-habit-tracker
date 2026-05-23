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
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {WEEKDAY_LABELS.map((d, i) => (
          <div
            key={i}
            className="text-[10px] font-semibold tracking-[0.08em] text-[color:var(--muted)] text-center"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} className="aspect-square" />;
          return (
            <div
              key={i}
              title={`${cell.iso}${cell.checked ? " ✓" : ""}`}
              className={cn(
                "aspect-square rounded-[6px] flex items-center justify-center text-[10px] font-medium tabular-nums transition-colors",
                cell.checked
                  ? cn(c.bg, "text-white")
                  : cell.isFuture
                    ? "bg-transparent text-[color:var(--muted)]/40"
                    : "bg-[color:var(--border)] text-[color:var(--muted)]",
                cell.isToday && !cell.checked && "ring-[1.5px] ring-[color:var(--foreground)]/40",
                cell.isToday && cell.checked && "ring-[1.5px] ring-offset-1 ring-offset-[color:var(--surface)] ring-[color:var(--foreground)]/40"
              )}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
