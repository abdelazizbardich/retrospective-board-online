import { getSupabase } from "./db";
import { nanoid } from "nanoid";
import crypto from "crypto";

export interface AppUser {
  id: string;
  username: string;
  hasPassword: boolean;
  createdAt: number;
}

type UserRow = {
  id: string;
  username: string;
  password_hash: string | null;
  password_salt: string | null;
  created_at: number;
};

function rowToUser(row: UserRow): AppUser {
  return {
    id: row.id,
    username: row.username,
    hasPassword: row.password_hash !== null,
    createdAt: row.created_at,
  };
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
}

function hashesEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function createUser(username: string, password: string): Promise<AppUser> {
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  const id = nanoid(12);
  const now = Date.now();

  const password_salt = crypto.randomBytes(32).toString("hex");
  const password_hash = hashPassword(password, password_salt);

  const { error } = await getSupabase().from("users").insert({
    id,
    username,
    password_hash,
    password_salt,
    created_at: now,
  });

  if (error) throw new Error(error.message);
  return { id, username, hasPassword: true, createdAt: now };
}

export async function getAllUsers(): Promise<AppUser[]> {
  const { data, error } = await getSupabase()
    .from("users")
    .select("id, username, password_hash, password_salt, created_at")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return ((data ?? []) as UserRow[]).map(rowToUser);
}

export async function getUserById(id: string): Promise<AppUser | undefined> {
  const { data, error } = await getSupabase()
    .from("users")
    .select("id, username, password_hash, password_salt, created_at")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw new Error(error.message);
  }
  return rowToUser(data as UserRow);
}

export async function getUserByUsername(username: string): Promise<AppUser | undefined> {
  const { data, error } = await getSupabase()
    .from("users")
    .select("id, username, password_hash, password_salt, created_at")
    .eq("username", username)
    .single();

  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw new Error(error.message);
  }
  return rowToUser(data as UserRow);
}

/** Returns the user if credentials are valid, null otherwise. */
export async function verifyUser(username: string, password: string): Promise<AppUser | null> {
  const { data, error } = await getSupabase()
    .from("users")
    .select("id, username, password_hash, password_salt, created_at")
    .eq("username", username)
    .single();

  if (error || !data) return null;

  const row = data as UserRow;

  // Passwordless accounts are no longer accepted
  if (!row.password_hash || !row.password_salt || !password) return null;

  const hash = hashPassword(password, row.password_salt);
  if (!hashesEqual(hash, row.password_hash)) return null;

  return rowToUser(row);
}
