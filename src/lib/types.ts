export type Profile = {
  id: string;
  name: string;
  avatar_url: string | null;
  color_theme: string;
  sort_order: number;
  created_at: string;
};

export type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  owner_id: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type CheckIn = {
  id: string;
  profile_id: string;
  habit_id: string;
  date: string;
  completed_at: string;
};

export type Badge = {
  id: string;
  profile_id: string;
  habit_id: string | null;
  badge_type: BadgeType;
  earned_at: string;
};

export type BadgeType =
  | "streak_3"
  | "streak_7"
  | "streak_14"
  | "streak_30"
  | "streak_60"
  | "streak_100"
  | "perfect_day"
  | "perfect_week"
  | "family_champion";

export type HabitWithStats = Habit & {
  streak: number;
  checkedToday: boolean;
};
