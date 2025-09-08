-- Public Profile Page prerequisites

-- 1) Unique, case-insensitive username
create unique index if not exists idx_user_profiles_username_ci on public.user_profiles (lower(username));

-- 2) RLS: allow anon to SELECT public profiles, public prompts/tools
-- Ensure RLS is enabled (no-op if already enabled)
alter table public.user_profiles enable row level security;
alter table public.prompts enable row level security;
alter table public.tools enable row level security;
alter table public.categories enable row level security;

-- Policies (Postgres doesn't support IF NOT EXISTS for policies; use DO blocks)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'user_profiles' and policyname = 'public_profiles_select'
  ) then
    create policy public_profiles_select on public.user_profiles for select to anon using (profile_public is true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'prompts' and policyname = 'public_prompts_select'
  ) then
    create policy public_prompts_select on public.prompts for select to anon using (is_public is true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'tools' and policyname = 'public_tools_select'
  ) then
    create policy public_tools_select on public.tools for select to anon using (is_public is true);
  end if;
end $$;

-- 3) Indexes for public queries
create index if not exists idx_prompts_user_pub_created on public.prompts (user_id, is_public, created_at desc);
create index if not exists idx_tools_user_pub_created on public.tools (user_id, is_public, created_at desc);
create index if not exists idx_categories_user_type on public.categories (user_id, type);
-- Useful for EXISTS fallbacks/policies
create index if not exists idx_prompts_category_public on public.prompts (category, is_public);
create index if not exists idx_tools_category_public on public.tools (category, is_public);
-- Optional search helpers
create index if not exists idx_prompts_lower_title on public.prompts (lower(title));
create index if not exists idx_tools_lower_name on public.tools (lower(name));

-- 4) Public categories view (preferred approach)
create or replace view public.public_categories as
  select distinct c.*
  from public.categories c
  where (c.type = 'prompt' and exists (select 1 from public.prompts p where p.category = c.id::text and p.is_public))
     or (c.type = 'tool'   and exists (select 1 from public.tools   t where t.category = c.id::text and t.is_public));

grant select on public.public_categories to anon;

-- If RLS is enabled on categories, allow anon to select only categories that have public content
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'categories' and policyname = 'public_categories_with_public_items'
  ) then
    create policy public_categories_with_public_items on public.categories
      for select to anon using (
        (type = 'prompt' and exists (select 1 from public.prompts p where p.category = categories.id::text and p.is_public))
        or (type = 'tool'   and exists (select 1 from public.tools   t where t.category = categories.id::text and t.is_public))
      );
  end if;
end $$;
