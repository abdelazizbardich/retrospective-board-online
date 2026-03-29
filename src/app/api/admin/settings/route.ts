import { NextRequest, NextResponse } from "next/server";
import { getAdSettings, updateAdSettings } from "@/lib/ad-settings";
import { requireAdmin } from "../auth/route";

// Public read — AdSlot component fetches this without admin auth
export async function GET() {
  return NextResponse.json(await getAdSettings());
}

export async function PATCH(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;
  const body = await request.json();
  const updated = await updateAdSettings(body);
  return NextResponse.json(updated);
}
