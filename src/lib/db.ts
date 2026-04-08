import { createClient, type Client } from "@libsql/client";

let _client: Client | undefined;
let _initialized = false;

function getClient(): Client {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return _client;
}

async function ensureSchema(): Promise<void> {
  if (_initialized) return;
  const client = getClient();
  await client.batch([
    {
      sql: `CREATE TABLE IF NOT EXISTS boards (
        id         TEXT PRIMARY KEY,
        name       TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        data       TEXT NOT NULL
      )`,
      args: [],
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS pages (
        id               TEXT PRIMARY KEY,
        slug             TEXT UNIQUE NOT NULL,
        title            TEXT NOT NULL,
        content          TEXT NOT NULL DEFAULT '',
        meta_description TEXT NOT NULL DEFAULT '',
        published        INTEGER NOT NULL DEFAULT 0,
        created_at       INTEGER NOT NULL,
        updated_at       INTEGER NOT NULL
      )`,
      args: [],
    },
  ]);
  _initialized = true;
}

export { getClient, ensureSchema };
