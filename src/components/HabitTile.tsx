"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { colorClasses, getColor, getIcon } from "@/lib/icons";
import { toggleHabitAction } from "@/app/actions";
import { cn } from "@/lib/utils";
import { PixelCheck } from "./PixelCheck";
import type { BadgeType, HabitWithStats } from "@/lib/types";

type Props = {
  habit: HabitWithStats;
  profileId: string;
  profileName: string;
  onCheckChange?: (next: boolean) => void;
  onBadgesEarned?: (badges: BadgeType[]) => void;
};

export function HabitTile({ habit, profileId, profileName, onCheckChange, onBadgesEarned }: Props) {
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
    onCheckChange?.(next);
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
        onCheckChange?.(!next);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={checked}
      className={cn(
        "group relative w-full flex items-center gap-3 p-3 text-left",
        "rounded-[var(--radius-md)] border border-[color:var(--border)]",
        "bg-[color:var(--surface)] shadow-[var(--shadow-xs)]",
        "transition-[transform,box-shadow] duration-100",
        "active:translate-y-[1px] hover:border-[color:var(--border-strong)]",
        "disabled:opacity-90",
        checked && "bg-[color:var(--surface-2)]"
      )}
      style={{ minHeight: 68 }}
    >
      {/* Pixel icon tile — chunky 2px border, hard offset shadow, fills with color when complete */}
      <motion.div
        animate={checked ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "shrink-0 w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center",
          "border transition-colors duration-150",
          checked
            ? cn(c.bg, "border-transparent")
            : cn(c.bgSoft, "border-[color:var(--border)]")
        )}
        style={
          checked
            ? { boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.22)" }
            : undefined
        }
      >
        <Icon
          size={22}
          strokeWidth={checked ? 2.6 : 2.2}
          className={checked ? "text-white" : c.text}
        />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "font-display font-semibold text-[15px] leading-tight transition-colors duration-150",
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
              "mt-1 inline-flex items-center gap-1 text-[12px] font-semibold tabular-nums",
              c.text
            )}
          >
            <Flame size={12} strokeWidth={2.4} />
            <span>{streak}d streak</span>
          </div>
        )}
      </div>

      {/* Square pixel checkbox — chunky 2px frame, PixelCheck when complete */}
      <motion.div
        animate={checked ? { scale: [1, 1.18, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
        className={cn(
          "relative shrink-0 w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center",
          "border transition-colors duration-150",
          checked
            ? cn(c.bg, "border-transparent")
            : "bg-[color:var(--surface)] border-[color:var(--border)] group-hover:border-[color:var(--foreground)]/40"
        )}
        style={
          checked
            ? { boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.22)" }
            : undefined
        }
      >
        {burst && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[var(--radius-md)] border-2 border-current animate-ripple",
              c.text
            )}
          />
        )}
        <AnimatePresence>
          {checked && (
            <motion.span
              key="check"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 18 }}
              className="pixel-art"
            >
              <PixelCheck size={20} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
