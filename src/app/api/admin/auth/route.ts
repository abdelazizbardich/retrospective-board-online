import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "change-me-in-production";
const COOKIE_NAME = "retro-admin-token";
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

/** Create a signed, time-stamped token: "<issuedAt>.<nonce>.<hmac>" */
function createSessionToken(): string {
  const issuedAt = Date.now().toString(36);
  const nonce = randomBytes(16).toString("base64url");
  const payload = `${issuedAt}.${nonce}`;
  const hmac = createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${hmac}`;
}

/** Returns true if the token has a valid signature and has not expired */
function verifySessionToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAtHex, nonce, suppliedHmac] = parts;
  const payload = `${issuedAtHex}.${nonce}`;
  const expectedHmac = createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
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

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const sessionToken = createSessionToken();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}

export async function DELETE(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}

/** Call from other admin route handlers to verify auth */
export function requireAdmin(request: NextRequest): NextResponse | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Server-component helper — reads cookies() directly */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return !!token && verifySessionToken(token);
}
