import { nanoid } from "nanoid";
import { getSupabase } from "./db";
import { SeoAnalyzerService } from "./seo/seo-analyzer-service";
import type { SeoAnalysisOutput, SeoPostInput } from "./seo/types";
import { emptySeoFields } from "./seo/types";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML from rich-text editor
  author: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  tags: string; // comma-separated
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string;
  seoTitle: string;
  canonicalUrl: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  schemaType: string;
  seoScore: number;
  seoAnalysis: SeoAnalysisOutput | null;
  published: boolean;
  scheduledAt: number | null;
  createdAt: number;
  updatedAt: number;
}

export function blogPostToSeoInput(post: BlogPost): SeoPostInput {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    coverImageAlt: post.coverImageAlt,
    tags: post.tags,
    category: post.category,
    author: post.author,
    focusKeyword: post.focusKeyword,
    secondaryKeywords: post.secondaryKeywords,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    canonicalUrl: post.canonicalUrl,
    robotsIndex: post.robotsIndex,
    robotsFollow: post.robotsFollow,
    ogTitle: post.ogTitle,
    ogDescription: post.ogDescription,
    ogImage: post.ogImage,
    twitterTitle: post.twitterTitle,
    twitterDescription: post.twitterDescription,
    twitterImage: post.twitterImage,
    schemaType: post.schemaType,
  };
}

export function resolveBlogPublishState(input: {
  published?: boolean;
  scheduledAt?: number | null;
}): Pick<BlogPost, "published" | "scheduledAt"> {
  const scheduledAt =
    input.scheduledAt != null && Number.isFinite(input.scheduledAt)
      ? Math.floor(input.scheduledAt)
      : null;

  if (scheduledAt != null && scheduledAt > Date.now()) {
    return { published: false, scheduledAt };
  }

  if (input.published === true) {
    return { published: true, scheduledAt: null };
  }

  return { published: false, scheduledAt: null };
}

export type BlogPostStatus = "published" | "scheduled" | "draft";

export function getBlogPostStatus(post: BlogPost): BlogPostStatus {
  if (post.published) return "published";
  if (post.scheduledAt != null && post.scheduledAt > Date.now()) return "scheduled";
  return "draft";
}

// ── Row → domain converter ─────────────────────────────────────────────────

type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  cover_image: string;
  cover_image_alt?: string;
  tags: string;
  meta_description: string;
  focus_keyword?: string;
  secondary_keywords?: string;
  seo_title?: string;
  canonical_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_type?: string;
  seo_score?: number;
  seo_analysis?: string | null;
  published: boolean;
  scheduled_at: number | null;
  created_at: number;
  updated_at: number;
};

function parseSeoAnalysis(raw: string | null | undefined): SeoAnalysisOutput | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SeoAnalysisOutput;
  } catch {
    return null;
  }
}

function rowToPost(row: BlogPostRow): BlogPost {
  const defaults = emptySeoFields();
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    category: row.category ?? "",
    coverImage: row.cover_image,
    coverImageAlt: row.cover_image_alt ?? "",
    tags: row.tags,
    metaDescription: row.meta_description,
    focusKeyword: row.focus_keyword ?? defaults.focusKeyword,
    secondaryKeywords: row.secondary_keywords ?? defaults.secondaryKeywords,
    seoTitle: row.seo_title ?? defaults.seoTitle,
    canonicalUrl: row.canonical_url ?? defaults.canonicalUrl,
    robotsIndex: row.robots_index ?? defaults.robotsIndex,
    robotsFollow: row.robots_follow ?? defaults.robotsFollow,
    ogTitle: row.og_title ?? defaults.ogTitle,
    ogDescription: row.og_description ?? defaults.ogDescription,
    ogImage: row.og_image ?? defaults.ogImage,
    twitterTitle: row.twitter_title ?? defaults.twitterTitle,
    twitterDescription: row.twitter_description ?? defaults.twitterDescription,
    twitterImage: row.twitter_image ?? defaults.twitterImage,
    schemaType: row.schema_type ?? defaults.schemaType,
    seoScore: row.seo_score ?? defaults.seoScore,
    seoAnalysis: parseSeoAnalysis(row.seo_analysis),
    published: row.published,
    scheduledAt: row.scheduled_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function seoFieldsToRow(data: Partial<BlogPost>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.focusKeyword !== undefined) row.focus_keyword = data.focusKeyword;
  if (data.secondaryKeywords !== undefined) row.secondary_keywords = data.secondaryKeywords;
  if (data.seoTitle !== undefined) row.seo_title = data.seoTitle;
  if (data.canonicalUrl !== undefined) row.canonical_url = data.canonicalUrl;
  if (data.robotsIndex !== undefined) row.robots_index = data.robotsIndex;
  if (data.robotsFollow !== undefined) row.robots_follow = data.robotsFollow;
  if (data.ogTitle !== undefined) row.og_title = data.ogTitle;
  if (data.ogDescription !== undefined) row.og_description = data.ogDescription;
  if (data.ogImage !== undefined) row.og_image = data.ogImage;
  if (data.twitterTitle !== undefined) row.twitter_title = data.twitterTitle;
  if (data.twitterDescription !== undefined) row.twitter_description = data.twitterDescription;
  if (data.twitterImage !== undefined) row.twitter_image = data.twitterImage;
  if (data.schemaType !== undefined) row.schema_type = data.schemaType;
  if (data.seoScore !== undefined) row.seo_score = data.seoScore;
  if (data.seoAnalysis !== undefined) {
    row.seo_analysis = data.seoAnalysis ? JSON.stringify(data.seoAnalysis) : null;
  }
  return row;
}

const SEO_DB_KEYS = new Set([
  "focus_keyword",
  "secondary_keywords",
  "seo_title",
  "canonical_url",
  "robots_index",
  "robots_follow",
  "og_title",
  "og_description",
  "og_image",
  "twitter_title",
  "twitter_description",
  "twitter_image",
  "schema_type",
  "seo_score",
  "seo_analysis",
]);

let seoColumnsAvailable: boolean | null = null;

function isMissingSeoColumnError(message: string): boolean {
  return /could not find the .* column|column .* does not exist/i.test(message);
}

function stripSeoDbFields(data: Record<string, unknown>): Record<string, unknown> {
  const stripped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!SEO_DB_KEYS.has(key)) stripped[key] = value;
  }
  return stripped;
}

function seoDbUpdates(
  analysis: SeoAnalysisOutput,
  patch: Partial<BlogPost>
): Record<string, unknown> {
  return {
    seo_score: analysis.totalScore,
    seo_analysis: JSON.stringify(analysis),
    ...seoFieldsToRow({ ...patch, seoScore: analysis.totalScore, seoAnalysis: analysis }),
  };
}

async function writeBlogPost(
  mode: "insert" | "update",
  data: Record<string, unknown>,
  slug?: string
): Promise<{ error: { message: string } | null; seoPersisted: boolean }> {
  // Always try SEO columns first so migration takes effect without a server restart.
  const withSeo = data;
  const withoutSeo = stripSeoDbFields(data);

  if (mode === "insert") {
    const { error } = await getSupabase().from("blog_posts").insert(withSeo);
    if (!error) {
      seoColumnsAvailable = true;
      return { error: null, seoPersisted: true };
    }
    if (isMissingSeoColumnError(error.message)) {
      seoColumnsAvailable = false;
      const { error: retryError } = await getSupabase().from("blog_posts").insert(withoutSeo);
      return { error: retryError, seoPersisted: false };
    }
    return { error, seoPersisted: false };
  }

  const { error } = await getSupabase()
    .from("blog_posts")
    .update(withSeo)
    .eq("slug", slug!);
  if (!error) {
    seoColumnsAvailable = true;
    return { error: null, seoPersisted: true };
  }
  if (isMissingSeoColumnError(error.message)) {
    seoColumnsAvailable = false;
    const { error: retryError } = await getSupabase()
      .from("blog_posts")
      .update(withoutSeo)
      .eq("slug", slug!);
    return { error: retryError, seoPersisted: false };
  }
  return { error, seoPersisted: false };
}

export function getSeoColumnsAvailable(): boolean | null {
  return seoColumnsAvailable;
}

// ── CRUD ───────────────────────────────────────────────────────────────────

export const BLOG_POSTS_PER_PAGE = 9;

export interface BlogPostsPage {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BlogPostsFilter {
  category?: string;
  tag?: string;
  q?: string;
}

function postHasTag(post: BlogPost, tag: string): boolean {
  const normalized = tag.trim().toLowerCase();
  return parseTags(post.tags).includes(normalized);
}

function postMatchesCategory(post: BlogPost, category: string): boolean {
  return post.category.trim().toLowerCase() === category.trim().toLowerCase();
}

function postMatchesQuery(post: BlogPost, q: string): boolean {
  const normalized = q.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [post.title, post.excerpt, post.category, post.tags]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export async function getBlogPostsFiltered(
  filters: BlogPostsFilter,
  page = 1,
  pageSize = BLOG_POSTS_PER_PAGE,
  includeUnpublished = false
): Promise<BlogPostsPage> {
  const category = filters.category?.trim();
  const tag = filters.tag?.trim();
  const q = filters.q?.trim();
  const safePage = Math.max(1, Math.floor(page) || 1);

  if (category && !tag && !q) {
    let query = getSupabase()
      .from("blog_posts")
      .select("*", { count: "exact" })
      .ilike("category", category)
      .order("created_at", { ascending: false });

    if (!includeUnpublished) {
      query = query.eq("published", true);
    }

    const from = (safePage - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error, count } = await query.range(from, to);
    if (error) throw new Error(error.message);

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      posts: (data ?? []).map(rowToPost),
      total,
      page: Math.min(safePage, totalPages),
      pageSize,
      totalPages,
    };
  }

  let posts = await getAllBlogPosts(includeUnpublished);

  if (category) {
    posts = posts.filter((post) => postMatchesCategory(post, category));
  }
  if (tag) {
    posts = posts.filter((post) => postHasTag(post, tag));
  }
  if (q) {
    posts = posts.filter((post) => postMatchesQuery(post, q));
  }

  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (safePage - 1) * pageSize;

  return {
    posts: posts.slice(from, from + pageSize),
    total,
    page: Math.min(safePage, totalPages),
    pageSize,
    totalPages,
  };
}

export async function getBlogPostsPage(
  page = 1,
  pageSize = BLOG_POSTS_PER_PAGE,
  includeUnpublished = false
): Promise<BlogPostsPage> {
  const safePage = Math.max(1, Math.floor(page) || 1);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = getSupabase()
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    posts: (data ?? []).map(rowToPost),
    total,
    page: Math.min(safePage, totalPages),
    pageSize,
    totalPages,
  };
}

export async function getAllBlogPosts(includeUnpublished = false): Promise<BlogPost[]> {
  let query = getSupabase()
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (!includeUnpublished) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(rowToPost);
}

function parseTags(tags: string): string[] {
  return tags
    ? tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];
}

export async function getRelatedBlogPosts(
  post: BlogPost,
  limit = 3
): Promise<BlogPost[]> {
  const postTags = new Set(parseTags(post.tags));
  const postCategory = post.category.trim().toLowerCase();

  const candidates = (await getAllBlogPosts(false)).filter(
    (p) => p.slug !== post.slug
  );

  const scored = candidates.map((candidate) => {
    let score = 0;
    if (postCategory && candidate.category.trim().toLowerCase() === postCategory) {
      score += 2;
    }
    for (const tag of parseTags(candidate.tags)) {
      if (postTags.has(tag)) score += 1;
    }
    return { post: candidate, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.createdAt - a.post.createdAt;
  });

  const related = scored
    .filter((entry) => entry.score > 0)
    .slice(0, limit)
    .map((entry) => entry.post);

  if (related.length < limit) {
    const relatedSlugs = new Set(related.map((p) => p.slug));
    for (const candidate of candidates) {
      if (related.length >= limit) break;
      if (!relatedSlugs.has(candidate.slug)) {
        related.push(candidate);
        relatedSlugs.add(candidate.slug);
      }
    }
  }

  return related;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const { data, error } = await getSupabase()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw new Error(error.message);
  }
  return rowToPost(data);
}

export async function createBlogPost(
  data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">
): Promise<BlogPost> {
  const id = nanoid(8);
  const now = Date.now();

  const seoInput = blogPostToSeoInput({ ...data, id, createdAt: now, updatedAt: now } as BlogPost);
  const analysis = SeoAnalyzerService.analyze(seoInput);

  const insertData: Record<string, unknown> = {
    id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    category: data.category,
    cover_image: data.coverImage,
    cover_image_alt: data.coverImageAlt,
    tags: data.tags,
    meta_description: data.metaDescription,
    published: data.published,
    scheduled_at: data.scheduledAt ?? null,
    created_at: now,
    updated_at: now,
    ...seoDbUpdates(analysis, data),
  };

  const { error } = await writeBlogPost("insert", insertData);
  if (error) throw new Error(error.message);
  return {
    id,
    ...data,
    seoScore: analysis.totalScore,
    seoAnalysis: analysis,
    createdAt: now,
    updatedAt: now,
  };
}

export async function updateBlogPost(
  slug: string,
  patch: Partial<Omit<BlogPost, "id" | "createdAt">>
): Promise<BlogPost | undefined> {
  const existing = await getBlogPost(slug);
  if (!existing) return undefined;

  const merged: BlogPost = { ...existing, ...patch, updatedAt: Date.now() };
  const seoInput = blogPostToSeoInput(merged);
  const allPosts = await getAllBlogPosts(true);
  const analysis = SeoAnalyzerService.analyze(seoInput, {
    existingTitles: allPosts.map((p) => p.seoTitle || p.title),
    existingDescriptions: allPosts.map((p) => p.metaDescription),
  });

  const updates: Record<string, unknown> = {
    updated_at: Date.now(),
    ...seoDbUpdates(analysis, patch),
  };

  if (patch.slug !== undefined)            updates.slug             = patch.slug;
  if (patch.title !== undefined)           updates.title            = patch.title;
  if (patch.excerpt !== undefined)         updates.excerpt          = patch.excerpt;
  if (patch.content !== undefined)         updates.content          = patch.content;
  if (patch.author !== undefined)          updates.author           = patch.author;
  if (patch.category !== undefined)        updates.category         = patch.category;
  if (patch.coverImage !== undefined)      updates.cover_image      = patch.coverImage;
  if (patch.coverImageAlt !== undefined)   updates.cover_image_alt  = patch.coverImageAlt;
  if (patch.tags !== undefined)            updates.tags             = patch.tags;
  if (patch.metaDescription !== undefined) updates.meta_description = patch.metaDescription;
  if (patch.published !== undefined)       updates.published        = patch.published;
  if (patch.scheduledAt !== undefined)    updates.scheduled_at     = patch.scheduledAt;
  if (patch.published === true)            updates.scheduled_at     = null;

  const { error } = await writeBlogPost("update", updates, slug);
  if (error) throw new Error(error.message);

  const newSlug = patch.slug ?? slug;
  return getBlogPost(newSlug);
}

export async function deleteBlogPost(slug: string): Promise<boolean> {
  const { error, count } = await getSupabase()
    .from("blog_posts")
    .delete({ count: "exact" })
    .eq("slug", slug);

  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function deleteBlogPosts(slugs: string[]): Promise<number> {
  if (slugs.length === 0) return 0;

  const { error, count } = await getSupabase()
    .from("blog_posts")
    .delete({ count: "exact" })
    .in("slug", slugs);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function updateBlogPostsPublished(slugs: string[], published: boolean): Promise<number> {
  if (slugs.length === 0) return 0;

  const { error, count } = await getSupabase()
    .from("blog_posts")
    .update({ published, scheduled_at: null, updated_at: Date.now() }, { count: "exact" })
    .in("slug", slugs);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

/** Publish posts whose scheduled_at time has passed. Called by cron. */
export async function publishDueBlogPosts(): Promise<number> {
  const now = Date.now();

  const { error, count } = await getSupabase()
    .from("blog_posts")
    .update({ published: true, scheduled_at: null, updated_at: now }, { count: "exact" })
    .eq("published", false)
    .not("scheduled_at", "is", null)
    .lte("scheduled_at", now);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
