"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  // Avoid flicker / hydration mismatch: render a placeholder until mounted.
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="w-9 h-9 inline-flex items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface)]/80 backdrop-blur text-[color:var(--foreground)] shadow-[var(--shadow-xs)] hover:shadow-[var(--shadow-sm)] hover:border-[color:var(--border-strong)] active:translate-y-px transition-all"
    >
      <Icon size={15} />
    </button>
  );
}
