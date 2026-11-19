# Allergy Checker

A one-screen app. The user picks their allergens, pastes an ingredient list, and sees highlighted matches. Checks are saved to Supabase. **SPEC.md is the source of truth** for scope, the data model and acceptance criteria.

## Stack

- Vite + React + JavaScript (not TypeScript)
- `@supabase/supabase-js`, using one table: `checks` (SQL is in SPEC.md)
- `localStorage` for selected allergens and a random device ID
- Deploy target: Vercel or Netlify (build `npm run build`, output `dist`)

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the built dist/ locally
```

## How to work

- **Work one phase of SPEC.md at a time.** Don't start the next phase or build features from later phases early.
- **When a phase is done, stop.** Tell me how to test it: the commands to run, what to click or type, and what I should see. Go through that phase's acceptance criteria one by one.
- **Don't commit until I say the phase works.**
- **Commit messages use the form `Phase N: what changed`**, for example `Phase 2: add allergen picker and highlighting`.
- **Ask before installing any package not already in SPEC.md.** SPEC.md only covers Vite, React and `@supabase/supabase-js`. Anything else needs my OK first.

## Secrets

- **Never write API keys, URLs with keys, or other secrets into code.** Read them from `.env.local` with `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`.
- `.env.local` must stay in `.gitignore`. Check this before every commit.
- `.env.example` holds placeholder values only, never real keys.
