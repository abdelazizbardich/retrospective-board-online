import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";
const COOKIE_NAME = "retro-admin-token";
const COOKIE_VALUE = "retro-admin-authenticated";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
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
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (token !== COOKIE_VALUE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Server-component helper — reads cookies() directly */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}
