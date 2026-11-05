import type { NextConfig } from "next";
import { LEGACY_BLOG_SLUG_REDIRECTS } from "./src/lib/blog-legacy-redirects";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com https://fal.ai https://*.fal.ai https://*.public.blob.vercel-storage.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Skip browser source maps in production — saves significant memory during build
  productionBrowserSourceMaps: false,

  turbopack: {},

  experimental: {
    // Reduce peak webpack memory by processing modules more incrementally
    webpackMemoryOptimizations: true,
    // Optimize tree-shaking for large packages not in Next.js's built-in default list
    optimizePackageImports: ["emoji-picker-react", "react-fluentui-emoji"],
    // Don't eagerly load all page JS into memory when the server starts
    preloadEntriesOnStart: false,
    // Skip generating server-side source maps
    serverSourceMaps: false,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/blog/search",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/blog",
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/blog/:path*",
        headers: [
          {
            key: "CDN-Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  async redirects() {
    const canonicalHostRedirects = [
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.sprintsplans.com" }],
        destination: "https://sprintsplans.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          { type: "host" as const, value: "sprintsplans.com" },
          { type: "header" as const, key: "x-forwarded-proto", value: "http" },
        ],
        destination: "https://sprintsplans.com/:path*",
        permanent: true,
      },
    ];

    const legacyBlogRedirects = Object.entries(LEGACY_BLOG_SLUG_REDIRECTS).map(
      ([fromSlug, toSlug]) => ({
        source: `/blog/${fromSlug}`,
        destination: `/blog/${toSlug}`,
        permanent: true,
      })
    );

    return [...canonicalHostRedirects, ...legacyBlogRedirects];
  },
};

export default nextConfig;
