create extension if not exists pgcrypto;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_admins enable row level security;

drop policy if exists "Admins read own membership" on public.site_admins;
create policy "Admins read own membership"
on public.site_admins for select
using (user_id = auth.uid());

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique check (char_length(slug) between 1 and 120),
  title text not null check (char_length(title) between 1 and 180),
  author text not null check (char_length(author) between 1 and 120),
  summary text not null check (char_length(summary) between 1 and 500),
  category text not null default 'Analysis' check (char_length(category) <= 100),
  tags text[] not null default '{}',
  cover_image_url text,
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_public_listing_idx
  on public.articles (status, published_at desc);

create index if not exists articles_owner_updated_idx
  on public.articles (owner_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before insert or update on public.articles
for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "Published articles are public" on public.articles;
create policy "Published articles are public"
on public.articles for select
using (
  status = 'published'
  or exists (select 1 from public.site_admins where user_id = auth.uid())
);

drop policy if exists "Admins insert articles" on public.articles;
create policy "Admins insert articles"
on public.articles for insert
with check (
  owner_id = auth.uid()
  and exists (select 1 from public.site_admins where user_id = auth.uid())
);

drop policy if exists "Admins update articles" on public.articles;
create policy "Admins update articles"
on public.articles for update
using (
  owner_id = auth.uid()
  and exists (select 1 from public.site_admins where user_id = auth.uid())
)
with check (
  owner_id = auth.uid()
  and exists (select 1 from public.site_admins where user_id = auth.uid())
);

drop policy if exists "Admins delete articles" on public.articles;
create policy "Admins delete articles"
on public.articles for delete
using (
  owner_id = auth.uid()
  and exists (select 1 from public.site_admins where user_id = auth.uid())
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'article-images',
  'article-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Admins upload article images" on storage.objects;
create policy "Admins upload article images"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'article-images'
  and exists (select 1 from public.site_admins where user_id = auth.uid())
);

drop policy if exists "Admins update article images" on storage.objects;
create policy "Admins update article images"
on storage.objects for update to authenticated
using (
  bucket_id = 'article-images'
  and exists (select 1 from public.site_admins where user_id = auth.uid())
);

drop policy if exists "Admins delete article images" on storage.objects;
create policy "Admins delete article images"
on storage.objects for delete to authenticated
using (
  bucket_id = 'article-images'
  and exists (select 1 from public.site_admins where user_id = auth.uid())
);
