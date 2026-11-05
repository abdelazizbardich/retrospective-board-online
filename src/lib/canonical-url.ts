/** Production canonical host (no www). Preview/local hosts must not redirect here. */
export const CANONICAL_HOST = "sprintsplans.com";

const SKIP_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);
const SKIP_HOST_SUFFIXES = [".localhost", ".vercel.app"] as const;

export function hostnameOf(hostHeader: string): string {
  return hostHeader.split(":")[0]?.trim().toLowerCase() ?? "";
}

export function forwardedProto(protoHeader: string | null, fallback: string): string {
  const raw = protoHeader?.split(",")[0]?.trim() || fallback;
  return raw.replace(/:$/, "").toLowerCase();
}

export function shouldSkipCanonicalRedirect(hostHeader: string): boolean {
  const hostname = hostnameOf(hostHeader);
  if (!hostname) return true;
  if (SKIP_HOSTS.has(hostname)) return true;
  return SKIP_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

/**
 * Permanent canonical URL, or null when the request is already canonical
 * (or should not be rewritten, e.g. preview deployments).
 */
export function canonicalRedirectUrl(input: {
  host: string;
  proto: string;
  pathname: string;
  search: string;
}): string | null {
  if (shouldSkipCanonicalRedirect(input.host)) return null;

  const hostname = hostnameOf(input.host);
  const proto = forwardedProto(input.proto, "https");
  const needsHttps = proto === "http";
  const needsHost = hostname !== CANONICAL_HOST;
  if (!needsHttps && !needsHost) return null;

  const path = input.pathname.startsWith("/") ? input.pathname : `/${input.pathname}`;
  return `https://${CANONICAL_HOST}${path}${input.search}`;
}

export function isBlogSearchPath(pathname: string): boolean {
  return pathname === "/blog/search" || pathname.startsWith("/blog/search/");
}
