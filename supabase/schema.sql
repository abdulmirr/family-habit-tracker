-- Family Habit Tracker — schema
-- Run this in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- 1. Profiles (5 family members)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  avatar_url text,
  color_theme text not null default 'slate',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Habits (shared if owner_id is null, otherwise personal to that profile)
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null,
  color text not null default 'slate',
  owner_id uuid references profiles(id) on delete cascade,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists habits_owner_idx on habits(owner_id);
create index if not exists habits_active_idx on habits(is_active);

-- 3. Check-ins (one row per (profile, habit, date) when completed)
create table if not exists check_ins (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  habit_id uuid not null references habits(id) on delete cascade,
  date date not null,
  completed_at timestamptz not null default now(),
  unique (profile_id, habit_id, date)
);

create index if not exists check_ins_profile_date_idx on check_ins(profile_id, date desc);
create index if not exists check_ins_habit_date_idx on check_ins(habit_id, date desc);

-- 4. Badges (earned achievements per profile)
create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  habit_id uuid references habits(id) on delete cascade,
  badge_type text not null,
  earned_at timestamptz not null default now(),
  unique (profile_id, habit_id, badge_type)
);

create index if not exists badges_profile_idx on badges(profile_id, earned_at desc);

-- Row Level Security: open for now (family-trust model, anon key only used internally).
-- Lock down later if you add per-user auth.
alter table profiles enable row level security;
alter table habits enable row level security;
alter table check_ins enable row level security;
alter table badges enable row level security;

drop policy if exists "anon all profiles" on profiles;
drop policy if exists "anon all habits" on habits;
drop policy if exists "anon all check_ins" on check_ins;
drop policy if exists "anon all badges" on badges;

create policy "anon all profiles" on profiles for all using (true) with check (true);
create policy "anon all habits" on habits for all using (true) with check (true);
create policy "anon all check_ins" on check_ins for all using (true) with check (true);
create policy "anon all badges" on badges for all using (true) with check (true);

-- Realtime: make sure these tables broadcast changes
alter publication supabase_realtime add table check_ins;
alter publication supabase_realtime add table habits;
alter publication supabase_realtime add table badges;
