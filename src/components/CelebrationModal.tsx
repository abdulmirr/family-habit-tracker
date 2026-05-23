"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { badgeLabel } from "@/lib/badges";
import { Button } from "@/components/ui/Button";
import type { BadgeType } from "@/lib/types";

type Props = {
  queue: BadgeType[];
  onDismiss: () => void;
};

const CONFETTI_PALETTE = ["#4f46e5", "#f59e0b", "#10b981", "#ec4899", "#06b6d4"];

export function CelebrationModal({ queue, onDismiss }: Props) {
  const current = queue[0];
  const confetti = useMemo(() => makeConfetti(36), []);

  useEffect(() => {
    if (current && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try { navigator.vibrate([20, 40, 20]); } catch {}
    }
  }, [current]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/55 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {confetti.map((p, i) => (
              <span
                key={i}
                className="absolute w-1.5 h-2.5 rounded-[1px]"
                style={{
                  left: `${p.left}%`,
                  top: "-5%",
                  background: p.color,
                  animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.88, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative bg-[color:var(--surface)] rounded-[var(--radius-xl)] px-7 py-8 max-w-[300px] w-full text-center shadow-[var(--shadow-lg)] border border-[color:var(--border)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Medallion with halo */}
            <div className="relative mx-auto mb-6 w-24 h-24">
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full bg-[color:var(--accent-soft)] blur-2xl"
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                initial={{ scale: 0.4, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.08 }}
                className="relative w-full h-full rounded-full bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/25 flex items-center justify-center text-5xl shadow-[var(--shadow-sm)]"
              >
                {badgeLabel(current).emoji}
              </motion.div>
            </div>

            <p className="eyebrow mb-1.5">Badge unlocked</p>
            <h2 className="font-display text-[22px] font-semibold leading-tight tracking-tight mb-6">
              {badgeLabel(current).label}
            </h2>

            <Button onClick={onDismiss} size="lg" className="w-full">
              Continue
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function makeConfetti(n: number) {
  return Array.from({ length: n }, () => ({
    left: Math.random() * 100,
    color: CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)],
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 0.4,
  }));
}

export function useCelebrationQueue() {
  const [queue, setQueue] = useState<BadgeType[]>([]);
  return {
    queue,
    push: (badges: BadgeType[]) => setQueue((q) => [...q, ...badges]),
    pop: () => setQueue((q) => q.slice(1)),
  };
}
