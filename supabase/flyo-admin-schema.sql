-- Flyo Admin Dashboard schema
-- Run this in the Supabase SQL Editor for project jlsdgouhesdgzdrmyqhw.

create extension if not exists pgcrypto;

create table if not exists public.flyo_packages (
  slug text primary key,
  title text not null,
  status text not null default 'draft' check (status in ('published', 'draft', 'hidden')),
  featured boolean not null default false,
  display_order integer not null default 9999,
  package_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flyo_settings (
  id text primary key default 'site',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.flyo_countries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  image_url text,
  flag_url text,
  status text not null default 'published' check (status in ('published', 'hidden')),
  display_order integer not null default 9999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flyo_experiences (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  status text not null default 'published' check (status in ('published', 'draft', 'hidden')),
  display_order integer not null default 9999,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flyo_enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  phone text,
  email text,
  package_slug text,
  package_title text,
  travel_date text,
  travellers text,
  message text,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Follow-up', 'Confirmed', 'Closed')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.flyo_media (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt_text text,
  usage text,
  file_size text,
  dimensions text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_flyo_packages_updated_at on public.flyo_packages;
create trigger set_flyo_packages_updated_at
before update on public.flyo_packages
for each row execute function public.set_updated_at();

drop trigger if exists set_flyo_settings_updated_at on public.flyo_settings;
create trigger set_flyo_settings_updated_at
before update on public.flyo_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_flyo_countries_updated_at on public.flyo_countries;
create trigger set_flyo_countries_updated_at
before update on public.flyo_countries
for each row execute function public.set_updated_at();

drop trigger if exists set_flyo_experiences_updated_at on public.flyo_experiences;
create trigger set_flyo_experiences_updated_at
before update on public.flyo_experiences
for each row execute function public.set_updated_at();

drop trigger if exists set_flyo_enquiries_updated_at on public.flyo_enquiries;
create trigger set_flyo_enquiries_updated_at
before update on public.flyo_enquiries
for each row execute function public.set_updated_at();

alter table public.flyo_packages enable row level security;
alter table public.flyo_settings enable row level security;
alter table public.flyo_countries enable row level security;
alter table public.flyo_experiences enable row level security;
alter table public.flyo_enquiries enable row level security;
alter table public.flyo_media enable row level security;

drop policy if exists "Public can read published packages" on public.flyo_packages;
create policy "Public can read published packages"
on public.flyo_packages for select
using (status = 'published');

drop policy if exists "Authenticated admins can manage packages" on public.flyo_packages;
create policy "Authenticated admins can manage packages"
on public.flyo_packages for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read site settings" on public.flyo_settings;
create policy "Public can read site settings"
on public.flyo_settings for select
using (id = 'site');

drop policy if exists "Authenticated admins can manage settings" on public.flyo_settings;
create policy "Authenticated admins can manage settings"
on public.flyo_settings for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published countries" on public.flyo_countries;
create policy "Public can read published countries"
on public.flyo_countries for select
using (status = 'published');

drop policy if exists "Authenticated admins can manage countries" on public.flyo_countries;
create policy "Authenticated admins can manage countries"
on public.flyo_countries for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read published experiences" on public.flyo_experiences;
create policy "Public can read published experiences"
on public.flyo_experiences for select
using (status = 'published');

drop policy if exists "Authenticated admins can manage experiences" on public.flyo_experiences;
create policy "Authenticated admins can manage experiences"
on public.flyo_experiences for all
to authenticated
using (true)
with check (true);

drop policy if exists "Anyone can create enquiries" on public.flyo_enquiries;
create policy "Anyone can create enquiries"
on public.flyo_enquiries for insert
with check (true);

drop policy if exists "Authenticated admins can manage enquiries" on public.flyo_enquiries;
create policy "Authenticated admins can manage enquiries"
on public.flyo_enquiries for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read media" on public.flyo_media;
create policy "Public can read media"
on public.flyo_media for select
using (true);

drop policy if exists "Authenticated admins can manage media" on public.flyo_media;
create policy "Authenticated admins can manage media"
on public.flyo_media for all
to authenticated
using (true)
with check (true);

insert into public.flyo_settings (id, settings)
values (
  'site',
  jsonb_build_object(
    'aedToInr', 26,
    'aedToUsd', 1 / 3.67,
    'uaeWhatsapp', '+971 50 535 7300',
    'indiaWhatsapp', '+91 6361 25 4400',
    'uaeOfficePhone', '04 396 4626',
    'indiaOfficePhone', '+91 6361 25 4400',
    'uaeEmail', 'info.dubai@flyotour.com',
    'indiaEmail', 'info.india@flyotour.com',
    'uaeLocation', 'Deira, Dubai',
    'indiaLocation', 'Karnataka, India'
  )
)
on conflict (id) do nothing;
