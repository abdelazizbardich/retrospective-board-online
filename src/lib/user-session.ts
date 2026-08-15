import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { getSessionSecret, newNonce, safeEqual, signPayload } from "./session-crypto";

export const USER_COOKIE_NAME = "retro-user-token";
const DEV_FALLBACK = "dev-user-session-secret";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_AGE_SEC = 30 * 24 * 60 * 60;

function secret(): string {
  return getSessionSecret("USER_SESSION_SECRET", DEV_FALLBACK);
}

/** Token format: userId.issuedAt.nonce.hmac */
export function createUserSessionToken(userId: string): string {
  const issuedAt = Date.now().toString(36);
  const nonce = newNonce();
  const payload = `${userId}.${issuedAt}.${nonce}`;
  return `${payload}.${signPayload(payload, secret())}`;
}

export function verifyUserSessionToken(token: string): { userId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 4) return null;
  const [userId, issuedAtHex, nonce, hmac] = parts;
  if (!userId) return null;
  const payload = `${userId}.${issuedAtHex}.${nonce}`;
  if (!safeEqual(hmac, signPayload(payload, secret()))) return null;
  const issuedAt = parseInt(issuedAtHex, 36);
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > MAX_AGE_MS) return null;
  return { userId };
}

export function setUserSessionCookie(res: NextResponse, userId: string): void {
  const token = createUserSessionToken(userId);
  res.cookies.set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export function clearUserSessionCookie(res: NextResponse): void {
  res.cookies.set(USER_COOKIE_NAME, "", { maxAge: 0, path: "/" });
}

export function getUserIdFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get(USER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserSessionToken(token)?.userId ?? null;
}

/** Server-component helper */
export async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserSessionToken(token)?.userId ?? null;
}
