import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const COOKIE_NAME = "retro-admin-token";
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

function requireEnv(name: string, devFallback?: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} must be set in production`);
  }
  if (devFallback !== undefined) return devFallback;
  throw new Error(`${name} is required`);
}

function getAdminPassword(): string {
  return requireEnv("ADMIN_PASSWORD", "admin");
}

function getSessionSecret(): string {
  return requireEnv("ADMIN_SESSION_SECRET", "change-me-in-production");
}

/** Create a signed, time-stamped token: "<issuedAt>.<nonce>.<hmac>" */
function createSessionToken(): string {
  const issuedAt = Date.now().toString(36);
  const nonce = randomBytes(16).toString("base64url");
  const payload = `${issuedAt}.${nonce}`;
  const hmac = createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
  return `${payload}.${hmac}`;
}

/** Returns true if the token has a valid signature and has not expired */
function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAtHex, nonce, suppliedHmac] = parts;
  const payload = `${issuedAtHex}.${nonce}`;
  const expectedHmac = createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
  try {
    if (!timingSafeEqual(Buffer.from(suppliedHmac, "base64url"), Buffer.from(expectedHmac, "base64url"))) {
      return false;
    }
  } catch {
    return false;
  }
  const issuedAt = parseInt(issuedAtHex, 36);
  return Date.now() - issuedAt < SESSION_MAX_AGE_MS;
}

function passwordsEqual(supplied: unknown, expected: string): boolean {
  if (typeof supplied !== "string") return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Still do a compare against expected to reduce timing signal on length
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let adminPassword: string;
  try {
    adminPassword = getAdminPassword();
  } catch {
    return NextResponse.json({ error: "Admin auth is not configured" }, { status: 503 });
  }

  if (!passwordsEqual(password, adminPassword)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  let sessionToken: string;
  try {
    sessionToken = createSessionToken();
  } catch {
    return NextResponse.json({ error: "Admin auth is not configured" }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

/** Call from other admin route handlers to verify auth */
export function requireAdmin(request: NextRequest): NextResponse | null {
  try {
    getSessionSecret();
  } catch {
    return NextResponse.json({ error: "Admin auth is not configured" }, { status: 503 });
  }
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Server-component helper — reads cookies() directly */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    getSessionSecret();
  } catch {
    return false;
  }
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return !!token && verifySessionToken(token);
}
