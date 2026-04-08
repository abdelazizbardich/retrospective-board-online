-- SQLite schema reference (tables are auto-created by src/lib/db.ts).

-- ─── Boards ──────────────────────────────────────────────────────────────────
-- The entire Board object is stored as JSON so the rich nested structure
-- (columns, cards, votes, reactions, participants, timer) needs no joins.
CREATE TABLE IF NOT EXISTS boards (
  id         TEXT    PRIMARY KEY,
  name       TEXT    NOT NULL,
  created_at INTEGER NOT NULL,
  data       TEXT    NOT NULL
);

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