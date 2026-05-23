-- Seed data: 5 family profiles + 5 shared family habits
-- Run after schema.sql

-- Profiles
insert into profiles (name, color_theme, sort_order) values
  ('Aigul',     'rose',    1),
  ('Mirlanbek', 'sky',     2),
  ('Abdu',      'violet',  3),
  ('Zhannat',   'amber',   4),
  ('Osman',     'emerald', 5)
on conflict (name) do nothing;

-- Shared family habits (owner_id = null)
insert into habits (name, icon, color, owner_id, sort_order) values
  ('Five Prayers',         'prayer',  'indigo',  null, 1),
  ('Quran (1 page)',       'quran',   'emerald', null, 2),
  ('Religious Book 10 min','book',    'amber',   null, 3),
  ('Healthy Eating',       'apple',   'rose',    null, 4),
  ('Sport',                'dumbbell','sky',     null, 5);
