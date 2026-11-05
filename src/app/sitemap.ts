import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";
import { getAllComparePages } from "@/lib/compare-pages";
import { getCachedPublishedBlogPosts, getCachedPublishedPages } from "@/lib/public-content";
import { BOARD_TEMPLATES } from "@/lib/types";

export const revalidate = 3600;

/** Next.js sitemap XML does not escape `&` in loc URLs; encode for valid XML. */
function sitemapLoc(url: string): string {
  return url.replace(/&/g, "&amp;");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof getCachedPublishedBlogPosts>> = [];
  let cmsPages: Awaited<ReturnType<typeof getCachedPublishedPages>> = [];
  try {
    [posts, cmsPages] = await Promise.all([
      getCachedPublishedBlogPosts(),
      getCachedPublishedPages(),
    ]);
  } catch {
    // Still emit marketing URLs if CMS/blog data is unavailable.
  }

  // High-value URLs only: homepage, marketing, templates, comparisons, published posts/pages.
  // Tag search (`/blog/search?tag=`) and pagination (`/blog?page=N`) stay
  // crawlable via on-page links but are excluded so they do not dilute the map.
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: sitemapLoc(SITE_URL),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: sitemapLoc(`${SITE_URL}/create`),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: sitemapLoc(`${SITE_URL}/templates`),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...BOARD_TEMPLATES.map((template) => ({
      url: sitemapLoc(`${SITE_URL}/templates/${template.id}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: sitemapLoc(`${SITE_URL}/compare`),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...getAllComparePages().map((page) => ({
      url: sitemapLoc(`${SITE_URL}/compare/${page.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: sitemapLoc(`${SITE_URL}/contact`),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: sitemapLoc(`${SITE_URL}/terms`),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: sitemapLoc(`${SITE_URL}/privacy`),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: sitemapLoc(`${SITE_URL}/blog`),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const blogPostRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: sitemapLoc(`${SITE_URL}/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const cmsPageRoutes: MetadataRoute.Sitemap = cmsPages.map((page) => ({
    url: sitemapLoc(`${SITE_URL}/p/${page.slug}`),
    lastModified: new Date(page.updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...blogPostRoutes, ...cmsPageRoutes];
}
