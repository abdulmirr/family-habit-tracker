"use client";

import { useState } from "react";
import { HabitTile } from "./HabitTile";
import { PixelXpBar } from "./PixelXpBar";
import { PixelPanel } from "./PixelPanel";
import { CelebrationModal, useCelebrationQueue } from "./CelebrationModal";
import { PixelCheck } from "./PixelCheck";
import type { BadgeType, HabitWithStats } from "@/lib/types";

type Props = {
  habits: HabitWithStats[];
  profileId: string;
  profileName: string;
  profileColor?: string;
};

export function TodayHabitList({ habits, profileId, profileName, profileColor = "indigo" }: Props) {
  const { queue, push, pop } = useCelebrationQueue();
  const [doneCount, setDoneCount] = useState(habits.filter((h) => h.checkedToday).length);
  const total = habits.length;
  const allDone = total > 0 && doneCount === total;

  if (habits.length === 0) {
    return (
      <PixelPanel padded className="text-center text-[color:var(--muted)] py-8">
        <div className="text-[28px] mb-2 pixel-art" aria-hidden>
          ⚔
        </div>
        <p className="font-display font-semibold text-[15px] text-[color:var(--foreground)] mb-1">
          No quests yet
        </p>
        <p className="text-[13px]">Add some from the Habits tab.</p>
      </PixelPanel>
    );
  }

  return (
    <>
      <div className="mb-4">
        <PixelXpBar
          done={doneCount}
          total={total}
          color={profileColor}
          label="Daily quests"
        />
      </div>

      <ul className="space-y-2.5">
        {habits.map((h) => (
          <li key={h.id}>
            <HabitTile
              habit={h}
              profileId={profileId}
              profileName={profileName}
              onCheckChange={(next) =>
                setDoneCount((c) => Math.max(0, Math.min(total, c + (next ? 1 : -1))))
              }
              onBadgesEarned={(badges) => push(badges)}
            />
          </li>
        ))}
      </ul>

      {allDone && (
        <PixelPanel tone="accent" className="mt-6 p-5 text-center overflow-hidden relative">
          <div className="relative flex flex-col items-center gap-2">
            <span className="pixel-art" aria-hidden>
              <PixelCheck size={28} />
            </span>
            <div className="font-display font-semibold text-[18px] tracking-tight">
              Perfect day
            </div>
            <div className="text-[13px] text-[color:var(--muted)]">
              All quests cleared. Keep the streak alive.
            </div>
          </div>
        </PixelPanel>
      )}

      <CelebrationModal queue={queue} onDismiss={pop} />
    </>
  );
}
