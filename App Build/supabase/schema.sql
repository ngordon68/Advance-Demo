-- Allergy Checker: `checks` table (from SPEC.md).
-- Run once in Supabase → SQL Editor.

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

-- Newer Supabase projects do not auto-grant table access to anon; RLS policies above still apply.
grant select, insert on public.checks to anon;
