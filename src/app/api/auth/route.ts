import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByUsername, verifyUser } from "@/lib/user-store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password, mode } = body;

  if (!username || typeof username !== "string" || username.trim().length < 2) {
    return NextResponse.json({ error: "Username must be at least 2 characters" }, { status: 400 });
  }
  if (username.trim().length > 50) {
    return NextResponse.json({ error: "Username too long (max 50 characters)" }, { status: 400 });
  }
  if (password !== undefined && typeof password === "string" && password.length > 200) {
    return NextResponse.json({ error: "Password too long" }, { status: 400 });
  }

  const trimmedUsername = username.trim();

  if (mode === "register") {
    const existing = await getUserByUsername(trimmedUsername);
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    try {
      const user = await createUser(trimmedUsername, password || undefined);
      return NextResponse.json(user, { status: 201 });
    } catch (e) {
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
  }

  if (mode === "login") {
    const user = await verifyUser(trimmedUsername, password || undefined);
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    return NextResponse.json(user);
  }

  return NextResponse.json({ error: "mode must be 'login' or 'register'" }, { status: 400 });
}
