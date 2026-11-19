-- Replace YOUR-DEVICE-ID with the "Device ID" shown at the bottom of the app,
-- then run in Supabase → SQL Editor.
insert into public.checks (created_at, device_id, food_text, allergens, flagged_terms) values
  (now() - interval '2 days', 'YOUR-DEVICE-ID', 'Wheat flour, sesame seeds, tahini, water, yeast', '{wheat,sesame}', '{wheat,flour,sesame,tahini}'),
  (now() - interval '1 day',  'YOUR-DEVICE-ID', 'Eggplant, olive oil, garlic, salt',               '{eggs}',         '{}'),
  (now() - interval '1 hour', 'YOUR-DEVICE-ID', 'Whey protein, sugar, peanut oil, soy lecithin',   '{milk,peanuts}', '{whey,peanut}');
