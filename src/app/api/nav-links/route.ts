import { NextRequest, NextResponse } from "next/server";
import { getNavLinks, createNavLink } from "@/lib/nav-link-store";
import { requireAdmin } from "@/app/api/admin/auth/route";
import type { NavLinkArea } from "@/lib/nav-link-store";

/** Public GET — used by SiteHeader / SiteFooter server components */
export async function GET(request: NextRequest) {
  const area = request.nextUrl.searchParams.get("area") as NavLinkArea | null;
  const links = await getNavLinks(area ?? undefined);
  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  const authError = requireAdmin(request);
  if (authError) return authError;

  const body = await request.json();
  const { label, href, area, position, openInNewTab } = body;

  if (!label || !href || !area) {
    return NextResponse.json({ error: "label, href and area are required" }, { status: 400 });
  }
  if (area !== "header" && area !== "footer") {
    return NextResponse.json({ error: "area must be 'header' or 'footer'" }, { status: 400 });
  }

  const link = await createNavLink({
    label: String(label).trim().slice(0, 100),
    href: String(href).trim().slice(0, 500),
    area,
    position: typeof position === "number" ? position : 99,
    openInNewTab: openInNewTab === true,
  });

  return NextResponse.json(link, { status: 201 });
}
