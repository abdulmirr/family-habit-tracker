"use client";

import { motion } from "framer-motion";
import { colorClasses, getColor } from "@/lib/icons";
import { cn } from "@/lib/utils";

type Props = {
  done: number;
  total: number;
  color?: string;
  label?: string;
};

// Chunky segmented XP bar — one block per habit when total ≤ 10, else a smooth fill.
// Looks like a Pokémon HP bar / Stardew stamina bar nested inside a pixel panel.
export function PixelXpBar({ done, total, color = "indigo", label = "Daily quests" }: Props) {
  const safeTotal = Math.max(0, total);
  const safeDone = Math.min(safeTotal, Math.max(0, done));
  const pct = safeTotal === 0 ? 0 : (safeDone / safeTotal) * 100;
  const c = colorClasses[getColor(color)];
  const segmented = safeTotal > 0 && safeTotal <= 10;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="pixel-eyebrow">{label}</span>
        <span className={cn("font-display text-[13px] font-semibold tabular-nums leading-none", c.text)}>
          {safeDone}<span className="text-[color:var(--muted)] font-medium">/{safeTotal}</span>
        </span>
      </div>

      {segmented ? (
        <div className="flex gap-[3px]" aria-label={`${safeDone} of ${safeTotal} complete`}>
          {Array.from({ length: safeTotal }).map((_, i) => {
            const filled = i < safeDone;
            return (
              <motion.div
                key={i}
                layout
                initial={false}
                animate={{ scale: filled ? [1, 1.08, 1] : 1 }}
                transition={{ duration: 0.25, delay: filled ? i * 0.025 : 0 }}
                className={cn(
                  "flex-1 h-3.5 rounded-[2px] border border-[color:var(--border-strong)]",
                  filled
                    ? cn(c.bg, "border-transparent")
                    : "bg-[color:var(--surface-2)]"
                )}
                style={
                  filled
                    ? { boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25)" }
                    : undefined
                }
              />
            );
          })}
        </div>
      ) : (
        <div
          className={cn(
            "h-4 rounded-[2px] border border-[color:var(--border-strong)]",
            "bg-[color:var(--surface-2)] overflow-hidden relative"
          )}
          aria-label={`${safeDone} of ${safeTotal} complete`}
        >
          <motion.div
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className={cn("h-full", c.bg)}
            style={{
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25)",
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.0) 0 6px, rgba(255,255,255,0.12) 6px 7px)",
            }}
          />
        </div>
      )}
    </div>
  );
}
