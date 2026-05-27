"use server";

import { revalidatePath } from "next/cache";
import {
  toggleCheckIn,
  evaluateBadgesAfterCheckIn,
  createHabit,
  deactivateHabit,
} from "@/lib/data";
import type { BadgeType } from "@/lib/types";
import { slugify } from "@/lib/utils";

export async function toggleHabitAction(
  profileId: string,
  habitId: string,
  checked: boolean,
  profileName: string
): Promise<{ newBadges: BadgeType[] }> {
  await toggleCheckIn(profileId, habitId, checked);
  let newBadges: BadgeType[] = [];
  if (checked) {
    newBadges = await evaluateBadgesAfterCheckIn(profileId, habitId);
  }
  revalidatePath(`/p/${slugify(profileName)}`);
  revalidatePath(`/p/${slugify(profileName)}/stats`);
  revalidatePath(`/board`);
  revalidatePath(`/leaderboard`);
  return { newBadges };
}

export async function createHabitAction(input: {
  name: string;
  icon: string;
  color: string;
  owner_id: string | null;
}) {
  const h = await createHabit(input);
  revalidatePath("/board");
  revalidatePath("/manage");
  if (input.owner_id) {
    // We don't have profile name here; broad revalidate is fine.
  }
  return h;
}

export async function deleteHabitAction(habitId: string) {
  await deactivateHabit(habitId);
  revalidatePath("/board");
  revalidatePath("/manage");
}
