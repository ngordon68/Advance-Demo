# Allergy Checker: v1 Spec

## Problem and User

**User:** a person with food allergies who checks food for themselves.

**Problem:** ingredient lists are long, and allergens hide under other names (for example "casein" is milk and "albumin" is egg). Scanning a label by eye is slow and easy to get wrong.

**v1 solution:** the user picks their allergens once. Then they paste an ingredient list and press **Check**. Every word that can trigger one of their allergies is highlighted, and the check is saved to a "Recent checks" list.

> Disclaimer shown in the app: *This is a keyword helper, not medical advice. Always read the full label.*

## Scope

**In v1 (about 90 minutes)**
- One screen, with no routing.
- Allergen picker for the 9 major allergens: milk, eggs, fish, shellfish, tree nuts, peanuts, wheat, soy and sesame.
- A text area for typed or pasted ingredients, and a **Check** button.
- Highlighted results, with a summary such as "3 matches: milk (whey, casein), soy (lecithin)".
- Each check is saved to one Supabase table, `checks`.
- A "Recent checks" list showing this device's last 10 checks.
- Selected allergens and a random device ID are kept in `localStorage`.
- Stack: Vite + React + JavaScript, `@supabase/supabase-js`.

**Out of v1**
- Login, accounts and payments.
- Photo upload or OCR. This is the first idea for v2.
- Looking up a dish name (for example "pad thai") to get its ingredients.
- Custom allergens and editing or deleting history.
- Severity levels and cross-contamination warnings.

## User Flows

1. **First visit:** the user ticks their allergens, for example Milk and Peanuts. The selection is saved to `localStorage`.
2. **Check food:** the user pastes "Whey protein, sugar, peanut oil, soy lecithin" and clicks **Check**.
   - Matching words are wrapped in `<mark>` and colored by allergen.
   - A summary lists each matched allergen and the words that matched it.
   - If nothing matches, a green "No matches for your allergens" message appears, along with the disclaimer.
   - The check is inserted into Supabase, and Recent checks refreshes.
3. **Review:** the user taps a row in Recent checks. Its text and allergens load back into the form and are re-checked.

## Data Model

**Allergen keywords (in code, not the database):** `src/lib/allergens.js` maps each allergen to its trigger words. Example:

```js
milk: ['milk', 'butter', 'cream', 'cheese', 'whey', 'casein', 'caseinate', 'lactose', 'ghee', 'yogurt']
```

Matching is case-insensitive, uses whole words and allows plurals. For example, `/\b(whey|casein)s?\b/gi`.

**Supabase:** one table, `checks`. The full definition is at the end of this file.

## Acceptance Criteria (overall)

- [ ] A user can select allergens, paste text, click Check and see highlighted matches in under 5 seconds.
- [ ] Highlighting is case-insensitive and does not match inside other words (for example "eggplant" is not flagged as egg).
- [ ] Every check is saved to Supabase and appears in Recent checks without a page reload.
- [ ] Selected allergens are still there after a page refresh.
- [ ] The app works at phone width (375px).
- [ ] The disclaimer is always visible.

## Build Plan

### Phase 1: Scaffold the app (about 10 min)
- `npm create vite@latest . -- --template react`, then `npm install @supabase/supabase-js`.
- Create `.env.example` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Replace the Vite demo with an empty `App.jsx` that shows the title "Allergy Checker".

**Acceptance criteria**
- [ ] `npm run dev` starts and shows "Allergy Checker" at `localhost:5173`.
- [ ] `npm run build` finishes with no errors.
- [ ] `.env` is listed in `.gitignore`, and `.env.example` is committed.

### Phase 2: Core screen with fake data (about 30 min)
- `src/lib/allergens.js`: the keyword map for the 9 allergens.
- `src/lib/highlight.js`: `findMatches(text, allergens)` returns the matched words and the text split into segments for highlighting.
- Components: `AllergenPicker`, `IngredientInput`, `ResultView` and `RecentChecks`. `RecentChecks` reads from a hardcoded array of 3 fake checks.
- Selected allergens are saved to `localStorage`.

**Acceptance criteria**
- [ ] Ticking Milk and checking "whey, sugar, Casein" highlights `whey` and `Casein`.
- [ ] "eggplant, bread" with Eggs selected shows no matches.
- [ ] The summary lists each matched allergen and the words that matched it.
- [ ] Checking with no allergens selected shows "Select at least one allergen".
- [ ] Recent checks shows the 3 fake rows, and clicking one fills the form.
- [ ] The selection is still there after a refresh.

### Phase 3: Read data from Supabase (about 20 min)
- Create the `checks` table and its RLS policies (SQL at the end of this file), plus 2 or 3 seed rows.
- `src/lib/supabase.js` creates the client from the env vars.
- On load, a random `device_id` is created once (`crypto.randomUUID()`) and stored in `localStorage`.
- `RecentChecks` fetches `select * from checks where device_id = ? order by created_at desc limit 10`.

**Acceptance criteria**
- [ ] Seed rows that use this device's ID appear in Recent checks, newest first.
- [ ] A "Loading…" state shows while fetching. If the fetch fails, an error message shows instead of a blank list.
- [ ] The fake data array is gone.
- [ ] No Supabase keys are hardcoded in the source.

### Phase 4: Write data to Supabase (about 15 min)
- When Check is clicked, run the match locally, then `insert` a row with `food_text`, `allergens`, `flagged_terms` and `device_id`.
- After the insert, refetch the list or add the new row to the top of it.

**Acceptance criteria**
- [ ] Clicking Check adds a new row in the Supabase table editor with the correct columns.
- [ ] The new check appears at the top of Recent checks without a reload.
- [ ] If the insert fails, the highlight still shows, and a small "Couldn't save" note appears.
- [ ] Empty text cannot be submitted, because the Check button is disabled.

### Phase 5: Deploy (about 15 min)
- Push to GitHub and import the repo into Vercel (or Netlify). The build command is `npm run build` and the output folder is `dist`.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host's environment settings.

**Acceptance criteria**
- [ ] The public URL loads the app on desktop and on a phone.
- [ ] A check made on the live site appears in Supabase and in Recent checks.
- [ ] A refresh on the live site keeps the selected allergens and history.

## Supabase Table: `checks`

| Column | Type | Required | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | yes | `gen_random_uuid()` | Primary key |
| `created_at` | `timestamptz` | yes | `now()` | Used to sort Recent checks |
| `device_id` | `text` | yes | none | Random ID from `localStorage`. Scopes history per device, since there is no login |
| `food_text` | `text` | yes | none | The ingredient text the user pasted. Limited to 1 to 5000 characters |
| `allergens` | `text[]` | yes | none | Allergens selected for this check, for example `{milk,peanuts}` |
| `flagged_terms` | `text[]` | yes | `'{}'` | Words that matched, for example `{whey,casein}`. Empty means safe |

```sql
create table public.checks (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  device_id     text not null,
  food_text     text not null check (char_length(food_text) between 1 and 5000),
  allergens     text[] not null,
  flagged_terms text[] not null default '{}'
);

create index checks_device_created_idx on public.checks (device_id, created_at desc);

alter table public.checks enable row level security;
create policy "anon can read"   on public.checks for select to anon using (true);
create policy "anon can insert" on public.checks for insert to anon with check (true);
```

> **Note:** with no login, `device_id` only filters the list in the app. It does not keep history private. Anyone with the anon key could read all rows. That is fine for a v1 demo, but don't put personal information in this table.
