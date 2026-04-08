import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://retroboard.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/create`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
