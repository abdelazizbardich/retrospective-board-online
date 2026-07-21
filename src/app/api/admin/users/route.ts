import { NextRequest, NextResponse } from "next/server";
import { getAllUsers } from "@/lib/user-store";
import { requireAdmin } from "../auth/route";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const users = await getAllUsers();

  return NextResponse.json({ users, total: users.length });
}
