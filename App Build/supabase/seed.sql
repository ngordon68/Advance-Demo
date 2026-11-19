-- Seed rows for Phase 3 testing.
-- 1. Open the app, then DevTools → Application → Local Storage → copy the value of
--    `allergy-checker:device-id`.
-- 2. Replace YOUR-DEVICE-ID below (one place) and run this in Supabase → SQL Editor.

with d as (select 'YOUR-DEVICE-ID'::text as device_id)
insert into public.checks (device_id, created_at, food_text, allergens, flagged_terms)
select d.device_id, v.created_at, v.food_text, v.allergens, v.flagged_terms
from d, (values
  (now() - interval '2 days',
   'Enriched wheat flour, sesame seeds, butter, sodium caseinate',
   array['wheat','sesame','milk'],
   array['caseinate','butter','wheat flour','sesame']),
  (now() - interval '1 day',
   'Eggplant, olive oil, garlic, salt',
   array['eggs'],
   array[]::text[]),
  (now() - interval '1 hour',
   'Whey protein, sugar, peanut oil, soy lecithin',
   array['milk','peanuts'],
   array['whey','peanut oil'])
) as v(created_at, food_text, allergens, flagged_terms);
