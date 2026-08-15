import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, getUserById, verifyUser } from "@/lib/user-store";
import {
  clearUserSessionCookie,
  getUserIdFromRequest,
  setUserSessionCookie,
} from "@/lib/user-session";
import { isValidEmail, normalizeEmail } from "@/lib/email";

const MIN_PASSWORD_LENGTH = 8;

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password, mode } = body;
  // Accept email (preferred) or legacy username field
  const rawEmail =
    typeof body.email === "string"
      ? body.email
      : typeof body.username === "string"
        ? body.username
        : "";

  if (!rawEmail || typeof rawEmail !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
  }
  if (password.length > 200) {
    return NextResponse.json({ error: "Password too long" }, { status: 400 });
  }

  if (mode === "register") {
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    try {
      const user = await createUser(email, password);
      const res = NextResponse.json(user, { status: 201 });
      setUserSessionCookie(res, user.id);
      return res;
    } catch {
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
  }

  if (mode === "login") {
    const user = await verifyUser(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const res = NextResponse.json(user);
    setUserSessionCookie(res, user.id);
    return res;
  }

  return NextResponse.json({ error: "mode must be 'login' or 'register'" }, { status: 400 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearUserSessionCookie(res);
  return res;
}
