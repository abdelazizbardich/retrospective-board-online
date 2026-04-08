import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.SQLITE_DB_PATH ?? path.join(process.cwd(), "data", "app.db");

let _db: Database.Database | undefined;

function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    _db.exec(`
      CREATE TABLE IF NOT EXISTS boards (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        data       TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS pages (
        id               TEXT PRIMARY KEY,
        slug             TEXT UNIQUE NOT NULL,
        title            TEXT NOT NULL,
        content          TEXT NOT NULL DEFAULT '',
        meta_description TEXT NOT NULL DEFAULT '',
        published        INTEGER NOT NULL DEFAULT 0,
        created_at       INTEGER NOT NULL,
        updated_at       INTEGER NOT NULL
      );
    `);
  }
  return _db;
}

export const db = new Proxy({} as Database.Database, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
