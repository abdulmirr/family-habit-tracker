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
    return <div className="w-8 h-8 shrink-0" aria-hidden />;
  }

  const Icon = theme === "dark" ? Sun : Moon;
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="shrink-0 w-8 h-8 inline-flex items-center justify-center rounded-[var(--radius-sm)] text-[color:var(--muted)] hover:text-[color:var(--foreground)] hover:bg-[color:var(--surface-2)] transition-colors"
    >
      <Icon size={15} />
    </button>
  );
}
