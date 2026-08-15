import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserById, getUserByUsername, verifyUser } from "@/lib/user-store";
import {
  clearUserSessionCookie,
  getUserIdFromRequest,
  setUserSessionCookie,
} from "@/lib/user-session";

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
  const { username, password, mode } = body;

  if (!username || typeof username !== "string" || username.trim().length < 2) {
    return NextResponse.json({ error: "Username must be at least 2 characters" }, { status: 400 });
  }
  if (username.trim().length > 50) {
    return NextResponse.json({ error: "Username too long (max 50 characters)" }, { status: 400 });
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

  const trimmedUsername = username.trim();

  if (mode === "register") {
    const existing = await getUserByUsername(trimmedUsername);
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    try {
      const user = await createUser(trimmedUsername, password);
      const res = NextResponse.json(user, { status: 201 });
      setUserSessionCookie(res, user.id);
      return res;
    } catch {
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
  }

  if (mode === "login") {
    const user = await verifyUser(trimmedUsername, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
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
