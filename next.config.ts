import type { NextConfig } from "next";

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
};

export default nextConfig;
