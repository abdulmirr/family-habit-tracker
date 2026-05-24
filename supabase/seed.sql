-- Seed data: 5 family profiles + 5 shared family habits
-- Run after schema.sql

-- Profiles
insert into profiles (name, color_theme, sort_order) values
  ('Aigul',     'rose',    1),
  ('Mirlanbek', 'sky',     2),
  ('Abdu',      'violet',  3),
  ('Zhannat',   'amber',   4),
  ('Osman',     'emerald', 5),
  ('Abdul',     'teal',    6)
on conflict (name) do nothing;

-- Avatars (PNGs under public/avatars/<name>.png)
update profiles set avatar_url = '/avatars/aigul.png'     where name = 'Aigul';
update profiles set avatar_url = '/avatars/mirlanbek.png' where name = 'Mirlanbek';
update profiles set avatar_url = '/avatars/abdu.png'      where name = 'Abdu';
update profiles set avatar_url = '/avatars/zhannat.png'   where name = 'Zhannat';
update profiles set avatar_url = '/avatars/osman.png'     where name = 'Osman';
update profiles set avatar_url = '/avatars/abdul.png'     where name = 'Abdul';

-- Shared family habits (owner_id = null)
insert into habits (name, icon, color, owner_id, sort_order) values
  ('Five Prayers',         'prayer',  'indigo',  null, 1),
  ('Quran (1 page)',       'quran',   'emerald', null, 2),
  ('Religious Book 10 min','book',    'amber',   null, 3),
  ('Healthy Eating',       'apple',   'rose',    null, 4),
  ('Sport',                'dumbbell','sky',     null, 5);
  