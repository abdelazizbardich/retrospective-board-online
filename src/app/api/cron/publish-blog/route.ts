import { NextRequest, NextResponse } from "next/server";
import { publishDueBlogPosts } from "@/lib/blog-store";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const published = await publishDueBlogPosts();
  return NextResponse.json({ ok: true, published });
}
