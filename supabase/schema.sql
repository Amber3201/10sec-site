-- 10sec blog: run this once in Supabase → SQL Editor.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null default 'web' check (category in ('web', 'social', 'search')),
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  meta_description text,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;

-- Anyone can read published posts
drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts" on public.posts
  for select using (status = 'published');

-- Signed-in team members can do everything.
-- Turn OFF public sign-ups in Supabase (Authentication → Sign In / Providers) so only people you invite can sign in.
drop policy if exists "Team can manage posts" on public.posts;
create policy "Team can manage posts" on public.posts
  for all to authenticated using (true) with check (true);

-- Public storage bucket for cover and in-post images
insert into storage.buckets (id, name, public) values ('covers', 'covers', true)
  on conflict (id) do nothing;

drop policy if exists "Public can view covers" on storage.objects;
create policy "Public can view covers" on storage.objects
  for select using (bucket_id = 'covers');

drop policy if exists "Team can upload covers" on storage.objects;
create policy "Team can upload covers" on storage.objects
  for insert to authenticated with check (bucket_id = 'covers');

drop policy if exists "Team can update covers" on storage.objects;
create policy "Team can update covers" on storage.objects
  for update to authenticated using (bucket_id = 'covers');

drop policy if exists "Team can delete covers" on storage.objects;
create policy "Team can delete covers" on storage.objects
  for delete to authenticated using (bucket_id = 'covers');
