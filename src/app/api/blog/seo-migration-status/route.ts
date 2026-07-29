import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/app/api/admin/auth/route";
import { getSeoColumnsAvailable } from "@/lib/blog-store";
import { getSupabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const cached = getSeoColumnsAvailable();
  if (cached === true) {
    return NextResponse.json({ migrated: true, source: "cache" });
  }
  if (cached === false) {
    return NextResponse.json({ migrated: false, source: "cache" });
  }

  const { error } = await getSupabase()
    .from("blog_posts")
    .select("seo_score")
    .limit(1);

  if (error && /could not find the .* column|column .* does not exist/i.test(error.message)) {
    return NextResponse.json({ migrated: false, source: "probe" });
  }

  return NextResponse.json({ migrated: !error, source: "probe" });
}
