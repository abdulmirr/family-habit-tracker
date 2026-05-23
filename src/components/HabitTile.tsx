"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { colorClasses, getColor, getIcon } from "@/lib/icons";
import { toggleHabitAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import type { BadgeType, HabitWithStats } from "@/lib/types";

type Props = {
  habit: HabitWithStats;
  profileId: string;
  profileName: string;
  onBadgesEarned?: (badges: BadgeType[]) => void;
};

export function HabitTile({ habit, profileId, profileName, onBadgesEarned }: Props) {
  const [checked, setChecked] = useState(habit.checkedToday);
  const [streak, setStreak] = useState(habit.streak);
  const [burst, setBurst] = useState(false);
  const [pending, startTransition] = useTransition();

  const c = colorClasses[getColor(habit.color)];
  const Icon = getIcon(habit.icon);

  const handleToggle = () => {
    const next = !checked;
    setChecked(next);
    setStreak((s) => Math.max(0, s + (next ? 1 : -1)));
    if (next) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 600);
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(15); } catch {}
      }
    }
    startTransition(async () => {
      try {
        const res = await toggleHabitAction(profileId, habit.id, next, profileName);
        if (next && res.newBadges.length > 0 && onBadgesEarned) {
          onBadgesEarned(res.newBadges);
        }
      } catch {
        setChecked(!next);
        setStreak((s) => Math.max(0, s + (next ? -1 : 1)));
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={checked}
      className={cn(
        "group relative w-full flex items-center gap-3.5 rounded-[var(--radius-lg)] p-3.5 text-left overflow-hidden",
        "bg-[color:var(--surface)] border border-[color:var(--border)]",
        "shadow-[var(--shadow-xs)] transition-all duration-150",
        "hover:shadow-[var(--shadow-sm)] hover:border-[color:var(--border-strong)]",
        "active:translate-y-px active:shadow-none",
        "disabled:opacity-90"
      )}
      style={{ minHeight: 72 }}
    >
      {/* Left accent rail — slides in when checked */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-300 ease-out",
          checked ? cn(c.bg, "opacity-100") : "opacity-0"
        )}
      />

      <motion.div
        animate={checked ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
        className={cn(
          "shrink-0 rounded-[var(--radius-md)] w-12 h-12 flex items-center justify-center transition-colors duration-200",
          checked ? c.bg : c.bgSoft
        )}
      >
        <Icon size={22} className={checked ? "text-white" : c.text} strokeWidth={checked ? 2.4 : 2} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "font-display font-semibold text-[15px] leading-tight transition-colors duration-200",
            checked
              ? "text-[color:var(--muted)] line-through decoration-[1.5px] decoration-[color:var(--muted)]/60"
              : "text-[color:var(--foreground)]"
          )}
        >
          {habit.name}
        </div>
        {streak > 0 && (
          <div
            className={cn(
              "mt-1 inline-flex items-center gap-1 text-[12px] font-medium tabular-nums",
              c.text
            )}
          >
            <Flame size={12} />
            <span>{streak} day{streak === 1 ? "" : "s"}</span>
          </div>
        )}
      </div>

      <motion.div
        animate={checked ? { scale: [1, 1.22, 1], rotate: [0, -6, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          "relative shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200",
          checked
            ? cn(c.bg, "shadow-[var(--shadow-xs)]")
            : "border-[1.5px] border-[color:var(--border-strong)] bg-transparent group-hover:border-[color:var(--foreground)]/40"
        )}
      >
        {burst && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full border-2 border-current animate-ripple",
              c.text
            )}
          />
        )}
        <AnimatePresence>
          {checked && (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 18 }}
              className="text-white"
            >
              <Check size={16} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
