import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { canonicalRedirectUrl, isBlogSearchPath } from "@/lib/canonical-url";

/**
 * Next.js 16 renamed middleware.ts → proxy.ts. This runs before the app
 * renders so HTTP and www requests 308 to https://sprintsplans.com + path
 * even when Cloudflare is misconfigured. Preview (*.vercel.app) and local
 * hosts are left alone.
 */
export function proxy(request: NextRequest) {
  const redirectTo = canonicalRedirectUrl({
    host: request.headers.get("host") ?? request.nextUrl.host,
    proto: request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
  });

  if (redirectTo) {
    return NextResponse.redirect(redirectTo, 308);
  }

  if (isBlogSearchPath(request.nextUrl.pathname)) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, follow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
