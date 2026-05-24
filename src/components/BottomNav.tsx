"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Plus, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { name: string };

export function BottomNav({ name }: Props) {
  const pathname = usePathname();
  const base = `/p/${name}`;
  const items = [
    { href: base, label: "Today", icon: Home },
    { href: `${base}/stats`, label: "Stats", icon: BarChart3 },
    { href: `${base}/habits`, label: "Habits", icon: Plus },
    { href: "/board", label: "Family", icon: LayoutGrid },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t-2 border-[color:var(--border-strong)] bg-[color:var(--surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--surface)]/85">
      <ul className="max-w-md mx-auto grid grid-cols-4 gap-1.5 px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.6rem)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 py-1.5 text-[11px] font-bold transition-all",
                  "rounded-[var(--radius-pixel)] border-2",
                  active
                    ? "text-[color:var(--accent-fg)] bg-[color:var(--accent)] border-[color:var(--border-strong)] shadow-[var(--shadow-pixel-pressed)]"
                    : "text-[color:var(--muted)] border-transparent hover:text-[color:var(--foreground)] hover:bg-[color:var(--surface-2)]"
                )}
                style={
                  active
                    ? { boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.18)" }
                    : undefined
                }
              >
                <Icon size={19} strokeWidth={active ? 2.6 : 2} />
                <span className={cn("tracking-[0.04em]", active && "tracking-[0.08em]")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
