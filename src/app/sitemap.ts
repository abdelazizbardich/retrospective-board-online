import type { MetadataRoute } from "next";

import { blogSearchHref } from "@/lib/blog-links";
import { getAllBlogCategories } from "@/lib/blog-category-store";
import {
  BLOG_POSTS_PER_PAGE,
  getAllBlogPosts,
  getBlogPostsFiltered,
  getBlogPostsPage,
  type BlogPost,
} from "@/lib/blog-store";
import { SITE_URL } from "@/lib/config";
import { getAllPages } from "@/lib/page-store";

export const revalidate = 3600;

function collectUniqueTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags.split(",").map((t) => t.trim()).filter(Boolean)) {
      tags.add(tag);
    }
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

async function blogFilterRoutes(
  filters: { category?: string; tag?: string }
): Promise<MetadataRoute.Sitemap> {
  const { totalPages } = await getBlogPostsFiltered(filters, 1);
  if (totalPages === 0) return [];

  const routes: MetadataRoute.Sitemap = [];
  for (let page = 1; page <= totalPages; page++) {
    routes.push({
      url: `${SITE_URL}${blogSearchHref(filters, page)}`,
      changeFrequency: "weekly",
      priority: page === 1 ? 0.6 : 0.5,
    });
  }
  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, cmsPages, categories, blogIndex] = await Promise.all([
    getAllBlogPosts(false),
    getAllPages(false),
    getAllBlogCategories(),
    getBlogPostsPage(1, BLOG_POSTS_PER_PAGE, false),
  ]);

  const tags = collectUniqueTags(posts);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/create`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/templates/starfish`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const blogPagination: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, blogIndex.totalPages - 1) },
    (_, index) => ({
      url: `${SITE_URL}/blog?page=${index + 2}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })
  );

  const blogPostRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const cmsPageRoutes: MetadataRoute.Sitemap = cmsPages.map((page) => ({
    url: `${SITE_URL}/p/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const categoryRoutes = (
    await Promise.all(
      categories.map((category) =>
        blogFilterRoutes({ category: category.name })
      )
    )
  ).flat();

  const tagRoutes = (
    await Promise.all(tags.map((tag) => blogFilterRoutes({ tag })))
  ).flat();

  return [
    ...staticRoutes,
    ...blogPagination,
    ...blogPostRoutes,
    ...cmsPageRoutes,
    ...categoryRoutes,
    ...tagRoutes,
  ];
}
