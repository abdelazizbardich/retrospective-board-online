-- Run this in your Supabase SQL editor to set up the schema.

-- ─── Boards ──────────────────────────────────────────────────────────────────
-- The entire Board object is stored as JSONB so the rich nested structure
-- (columns, cards, votes, reactions, participants, timer) needs no joins.
create table if not exists boards (
  id         text    primary key,
  name       text    not null,
  created_at bigint  not null,
  data       jsonb   not null
);

-- ─── Blog posts ───────────────────────────────────────────────────────────────
create table if not exists blog_posts (
  id           text    primary key,
  slug         text    unique not null,
  title        text    not null,
  excerpt      text    not null default '',
  content      text    not null default '',
  author       text    not null default 'SprintsPlans Team',
  cover_emoji  text    not null default '📝',
  cover_image  text    not null default '',
  published_at bigint  not null,
  published    boolean not null default false,
  tags         text[]  not null default '{}'
);

-- ─── Pages ───────────────────────────────────────────────────────────────────
create table if not exists pages (
  id               text    primary key,
  slug             text    unique not null,
  title            text    not null,
  content          text    not null default '',
  meta_description text    not null default '',
  published        boolean not null default false,
  created_at       bigint  not null,
  updated_at       bigint  not null
);

-- ─── Ad settings (single row, id always = 1) ─────────────────────────────────
create table if not exists ad_settings (
  id            integer primary key default 1,
  ads_enabled   boolean not null default true,
  ad_client_id  text    not null default 'ca-pub-XXXXXXXXXXXXXXXX',
  slot_id_left  text    not null default 'PLACEHOLDER',
  slot_id_right text    not null default 'PLACEHOLDER'
);

-- Seed the single ad_settings row
insert into ad_settings (id) values (1) on conflict do nothing;

-- ─── Supabase Storage bucket for blog cover uploads ───────────────────────────
-- Run this after creating the schema, or use the Supabase dashboard:
--
--   insert into storage.buckets (id, name, public)
--   values ('blog-images', 'blog-images', true)
--   on conflict do nothing;
--
--   create policy "Public read blog images"
--     on storage.objects for select
--     using ( bucket_id = 'blog-images' );
--
--   create policy "Service role upload blog images"
--     on storage.objects for insert
--     with check ( bucket_id = 'blog-images' );
