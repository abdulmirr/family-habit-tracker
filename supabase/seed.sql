-- Seed data: 5 family profiles + 5 shared family habits
-- Run after schema.sql

-- Profiles
insert into profiles (name, color_theme, sort_order) values
  ('Mirlanbek', 'sky',     1),
  ('Aigul',     'rose',    2),
  ('Abdul',     'teal',    3),
  ('Abdu',      'violet',  4),
  ('Zhannat',   'amber',   5),
  ('Osman',     'emerald', 6)
on conflict (name) do nothing;

-- Sort order (re-apply on every run so reorders propagate)
update profiles set sort_order = 1 where name = 'Mirlanbek';
update profiles set sort_order = 2 where name = 'Aigul';
update profiles set sort_order = 3 where name = 'Abdul';
update profiles set sort_order = 4 where name = 'Abdu';
update profiles set sort_order = 5 where name = 'Zhannat';
update profiles set sort_order = 6 where name = 'Osman';

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
  