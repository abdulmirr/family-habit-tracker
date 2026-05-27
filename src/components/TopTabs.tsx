import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

type Tab = "board" | "leaderboard";

const TABS: { key: Tab; label: string; href: string }[] = [
  { key: "board", label: "Home", href: "/board" },
  { key: "leaderboard", label: "Leaderboard", href: "/leaderboard" },
];

export function TopTabs({ active }: { active: Tab }) {
  return (
    <nav
      aria-label="Primary"
      className="mb-5 flex w-full items-center gap-1.5 rounded-[var(--radius-md)] border border-[color:var(--border)] bg-[color:var(--surface)] p-1 text-[13px] shadow-[var(--shadow-xs)]"
    >
      <div className="flex flex-1 gap-0.5">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <Link
              key={t.key}
              href={t.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex-1 text-center px-3 py-1.5 rounded-[var(--radius-sm)] font-medium transition-colors",
                isActive
                  ? "bg-[color:var(--accent)] text-[color:var(--accent-fg)] font-semibold shadow-[var(--shadow-button)]"
                  : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <ThemeToggle />
    </nav>
  );
}
