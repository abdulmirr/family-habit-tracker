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
    <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-[color:var(--border)] bg-[color:var(--surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--surface)]/75">
      <ul className="max-w-md mx-auto grid grid-cols-4 px-2 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors",
                  active
                    ? "text-[color:var(--accent)]"
                    : "text-[color:var(--muted)] hover:text-[color:var(--foreground-soft,var(--foreground))]"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span className={cn(active && "tracking-[0.02em]")}>{label}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[color:var(--accent)]"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
