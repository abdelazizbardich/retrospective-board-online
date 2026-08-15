-- Schema reference for Supabase. Apply DDL manually in the Supabase SQL editor.

-- ─── Boards ──────────────────────────────────────────────────────────────────
-- The entire Board object is stored as JSON so the rich nested structure
-- (columns, cards, votes, reactions, participants, timer) needs no joins.
CREATE TABLE IF NOT EXISTS boards (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  created_at INTEGER NOT NULL,
  data       TEXT    NOT NULL
);

-- ─── Navigation Links ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nav_links (
  id              TEXT    PRIMARY KEY,
  label           TEXT    NOT NULL,
  href            TEXT    NOT NULL,
  area            TEXT    NOT NULL CHECK (area IN ('header', 'footer')),
  position        INTEGER NOT NULL DEFAULT 0,
  open_in_new_tab BOOLEAN NOT NULL DEFAULT FALSE
);

-- ─── Blog Categories ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_categories (
  id         TEXT   PRIMARY KEY,
  name       TEXT   UNIQUE NOT NULL,
  created_at BIGINT NOT NULL
);

-- ─── Blog Posts ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id               TEXT    PRIMARY KEY,
  slug             TEXT    UNIQUE NOT NULL,
  title            TEXT    NOT NULL,
  excerpt          TEXT    NOT NULL DEFAULT '',
  content          TEXT    NOT NULL DEFAULT '',
  author           TEXT    NOT NULL DEFAULT '',
  category         TEXT    NOT NULL DEFAULT '',
  cover_image      TEXT    NOT NULL DEFAULT '',
  cover_image_alt  TEXT    NOT NULL DEFAULT '',
  tags             TEXT    NOT NULL DEFAULT '',
  meta_description TEXT    NOT NULL DEFAULT '',
  focus_keyword    TEXT    NOT NULL DEFAULT '',
  secondary_keywords TEXT  NOT NULL DEFAULT '',
  seo_title        TEXT    NOT NULL DEFAULT '',
  canonical_url    TEXT    NOT NULL DEFAULT '',
  robots_index     BOOLEAN NOT NULL DEFAULT TRUE,
  robots_follow    BOOLEAN NOT NULL DEFAULT TRUE,
  og_title         TEXT    NOT NULL DEFAULT '',
  og_description   TEXT    NOT NULL DEFAULT '',
  og_image         TEXT    NOT NULL DEFAULT '',
  twitter_title    TEXT    NOT NULL DEFAULT '',
  twitter_description TEXT NOT NULL DEFAULT '',
  twitter_image    TEXT    NOT NULL DEFAULT '',
  schema_type      TEXT    NOT NULL DEFAULT 'BlogPosting',
  seo_score        INTEGER NOT NULL DEFAULT 0,
  seo_analysis     TEXT,
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  scheduled_at     BIGINT,
  created_at       BIGINT  NOT NULL,
  updated_at       BIGINT  NOT NULL
);

-- Existing DBs:
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS scheduled_at BIGINT;
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS focus_keyword TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS secondary_keywords TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS canonical_url TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS robots_index BOOLEAN NOT NULL DEFAULT TRUE;
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS robots_follow BOOLEAN NOT NULL DEFAULT TRUE;
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_title TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_description TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS og_image TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS twitter_title TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS twitter_description TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS twitter_image TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS schema_type TEXT NOT NULL DEFAULT 'BlogPosting';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_score INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_analysis TEXT;

-- ─── Pages ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pages (
  id               TEXT    PRIMARY KEY,
  slug             TEXT    UNIQUE NOT NULL,
  title            TEXT    NOT NULL,
  content          TEXT    NOT NULL DEFAULT '',
  meta_description TEXT    NOT NULL DEFAULT '',
  published        INTEGER NOT NULL DEFAULT 0,
  created_at       INTEGER NOT NULL,
  updated_at       INTEGER NOT NULL
);

-- ─── Users (app accounts for My Boards) ──────────────────────────────────────
-- `username` column stores the account email (unique, lowercased).
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  password_salt TEXT,
  created_at    BIGINT NOT NULL
);

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- App server uses the service role key (bypasses RLS). Enabling RLS with no
-- policies denies anon/authenticated Data API access as defense in depth.
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public read of published content via service role only — no anon policies.
-- If you later expose anon key to clients, add explicit SELECT policies here.
