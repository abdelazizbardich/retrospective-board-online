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
  tags             TEXT    NOT NULL DEFAULT '',
  meta_description TEXT    NOT NULL DEFAULT '',
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  scheduled_at     BIGINT,
  created_at       BIGINT  NOT NULL,
  updated_at       BIGINT  NOT NULL
);

-- Existing DBs:
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
-- ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS scheduled_at BIGINT;

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
