import { unstable_cache } from "next/cache";

import {
  BLOG_POSTS_PER_PAGE,
  getAllBlogPosts,
  getBlogPost,
  getBlogPostsFiltered,
  getBlogPostsPage,
  getRelatedBlogPosts,
  type BlogPost,
  type BlogPostsPage,
} from "./blog-store";
import { getNavLinks, type NavLink, type NavLinkArea } from "./nav-link-store";
import { getAllPages, getPage, type Page } from "./page-store";
import { CACHE_TAGS, PUBLIC_CACHE_REVALIDATE_SECONDS } from "./public-cache";

const blogCache = {
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.blog],
};
const pagesCache = {
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.pages],
};
const navCache = {
  revalidate: PUBLIC_CACHE_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.nav],
};

export const getCachedNavLinks = unstable_cache(
  async (area: NavLinkArea | ""): Promise<NavLink[]> =>
    getNavLinks(area || undefined),
  ["public-nav-links"],
  navCache
);

export const getCachedPublishedBlogPost = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const post = await getBlogPost(slug);
    if (!post?.published) return null;
    return post;
  },
  ["public-blog-post"],
  blogCache
);

export const getCachedPublishedBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => getAllBlogPosts(false),
  ["public-blog-posts"],
  blogCache
);

export const getCachedBlogPostsPage = unstable_cache(
  async (page: number): Promise<BlogPostsPage> =>
    getBlogPostsPage(page, BLOG_POSTS_PER_PAGE, false),
  ["public-blog-posts-page"],
  blogCache
);

export const getCachedBlogPostsFiltered = unstable_cache(
  async (
    category: string,
    tag: string,
    q: string,
    page: number
  ): Promise<BlogPostsPage> =>
    getBlogPostsFiltered(
      {
        category: category || undefined,
        tag: tag || undefined,
        q: q || undefined,
      },
      page,
      BLOG_POSTS_PER_PAGE,
      false
    ),
  ["public-blog-posts-filtered"],
  blogCache
);

export const getCachedRelatedBlogPosts = unstable_cache(
  async (slug: string): Promise<BlogPost[]> => {
    const post = await getBlogPost(slug);
    if (!post?.published) return [];
    return getRelatedBlogPosts(post);
  },
  ["public-related-blog-posts"],
  blogCache
);

export const getCachedPublishedPage = unstable_cache(
  async (slug: string): Promise<Page | null> => {
    const page = await getPage(slug);
    if (!page?.published) return null;
    return page;
  },
  ["public-cms-page"],
  pagesCache
);

export const getCachedPublishedPages = unstable_cache(
  async (): Promise<Page[]> => getAllPages(false),
  ["public-cms-pages"],
  pagesCache
);
