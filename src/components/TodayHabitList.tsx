"use client";

import { useState } from "react";
import { HabitTile } from "./HabitTile";
import { CelebrationModal, useCelebrationQueue } from "./CelebrationModal";
import type { BadgeType, HabitWithStats } from "@/lib/types";

type Props = {
  habits: HabitWithStats[];
  profileId: string;
  profileName: string;
};

export function TodayHabitList({ habits, profileId, profileName }: Props) {
  const { queue, push, pop } = useCelebrationQueue();
  const [doneCount, setDoneCount] = useState(habits.filter((h) => h.checkedToday).length);
  const total = habits.length;
  const allDone = total > 0 && doneCount === total;

  if (habits.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-6 text-center text-[color:var(--muted)] shadow-[var(--shadow-xs)]">
        No habits yet. Add some from the Habits tab.
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-2.5">
        {habits.map((h) => (
          <li key={h.id}>
            <HabitTile
              habit={h}
              profileId={profileId}
              profileName={profileName}
              onBadgesEarned={(badges) => {
                push(badges);
                if (!h.checkedToday) setDoneCount((c) => c + 1);
              }}
            />
          </li>
        ))}
      </ul>

      {allDone && (
        <div className="mt-6 relative rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-center shadow-[var(--shadow-md)] overflow-hidden">
          <span
            aria-hidden
            className="absolute inset-0 bg-[color:var(--accent-soft)] opacity-50"
          />
          <div className="relative">
            <div className="text-3xl mb-1">✨</div>
            <div className="font-display font-semibold text-[19px] tracking-tight">Perfect day</div>
            <div className="text-[13px] text-[color:var(--muted)] mt-0.5">
              Everything checked off. Keep it going.
            </div>
          </div>
        </div>
      )}

      <CelebrationModal queue={queue} onDismiss={pop} />
    </>
  );
}
