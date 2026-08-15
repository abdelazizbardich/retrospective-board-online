import { createHmac, timingSafeEqual, randomBytes } from "crypto";

/** Resolve a signing secret; production requires an explicit env value. */
export function getSessionSecret(envName: string, devFallback: string): string {
  const value = process.env[envName]?.trim();
  if (value) return value;
  const shared = process.env.SESSION_SECRET?.trim();
  if (shared) return shared;
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${envName} or SESSION_SECRET must be set in production`);
  }
  return process.env.ADMIN_SESSION_SECRET?.trim() || devFallback;
}

export function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function safeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function newNonce(): string {
  return randomBytes(16).toString("base64url");
}
