import type { BlogPost } from "@/lib/blog-store";
import type { InternalLinkSuggestion } from "./types";
import { jaccardSimilarity, normalizeKeyword, tokenize } from "./utils";

export interface LinkCandidatePost {
  slug: string;
  title: string;
  content: string;
  category: string;
  tags: string;
  excerpt?: string;
}

interface LinkCandidate {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  tokens: string[];
}

function toCandidate(post: LinkCandidatePost): LinkCandidate {
  const text = [post.title, post.excerpt, post.category, post.tags].join(" ");
  return {
    slug: post.slug,
    title: post.title,
    category: post.category.trim().toLowerCase(),
    tags: post.tags
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean),
    tokens: tokenize(text),
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const SKIP_LINK_TAGS = new Set(["a", "pre", "code", "script", "style", "h1", "h2", "h3", "h4", "h5", "h6"]);

function transformHtmlTextNodes(html: string, transform: (text: string) => string): string {
  let insideSkip = 0;
  const tokens = html.split(/(<[^>]+>)/g);

  return tokens
    .map((token) => {
      if (token.startsWith("<")) {
        const openMatch = token.match(/^<([a-z0-9]+)/i);
        const closeMatch = token.match(/^<\/([a-z0-9]+)/i);
        if (openMatch && SKIP_LINK_TAGS.has(openMatch[1].toLowerCase()) && !token.endsWith("/>")) {
          insideSkip++;
        } else if (closeMatch && SKIP_LINK_TAGS.has(closeMatch[1].toLowerCase())) {
          insideSkip = Math.max(0, insideSkip - 1);
        }
        return token;
      }

      if (insideSkip > 0) return token;
      return transform(token);
    })
    .join("");
}

function wrapAnchorInHtml(content: string, anchor: string, href: string): string | null {
  const trimmed = anchor.trim();
  if (!trimmed) return null;

  const link = `<a href="${href}">${trimmed}</a>`;
  const regex = new RegExp(`(${escapeRegex(trimmed)})`, "i");
  let replaced = false;

  const result = transformHtmlTextNodes(content, (text) => {
    if (replaced || !regex.test(text)) return text;
    replaced = true;
    return text.replace(regex, link);
  });

  return replaced ? result : null;
}

function suggestAnchor(post: LinkCandidatePost, focusKeyword: string): string {
  if (focusKeyword && post.title.toLowerCase().includes(focusKeyword.toLowerCase())) {
    return focusKeyword;
  }
  const words = post.title.split(/\s+/);
  if (words.length <= 5) return post.title.toLowerCase();
  return words.slice(0, 4).join(" ").toLowerCase();
}

function isSlugLinkedInContent(content: string, slug: string): boolean {
  const linkRegex = /<a[^>]*href=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(content)) !== null) {
    const slugMatch = match[1].match(/\/blog\/([a-z0-9-]+)/);
    if (slugMatch?.[1] === slug) return true;
  }
  return content.includes(`/blog/${slug}`);
}

export function findInternalLinkSuggestions(
  currentPost: {
    slug: string;
    title: string;
    content: string;
    category: string;
    tags: string;
    focusKeyword: string;
  },
  allPosts: LinkCandidatePost[],
  limit = 5
): InternalLinkSuggestion[] {
  const currentTokens = tokenize(
    [currentPost.title, currentPost.content, currentPost.tags, currentPost.focusKeyword].join(" ")
  );
  const currentTags = currentPost.tags
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  const currentCategory = currentPost.category.trim().toLowerCase();
  const focus = normalizeKeyword(currentPost.focusKeyword);

  const candidates = allPosts
    .filter((p) => p.slug !== currentPost.slug && !isSlugLinkedInContent(currentPost.content, p.slug))
    .map((post) => {
      const c = toCandidate(post);
      let relevance = jaccardSimilarity(currentTokens, c.tokens) * 60;

      if (currentCategory && c.category === currentCategory) relevance += 20;
      const sharedTags = currentTags.filter((t) => c.tags.includes(t)).length;
      relevance += sharedTags * 8;

      if (focus && post.title.toLowerCase().includes(focus)) relevance += 10;
      if (focus && post.tags.toLowerCase().includes(focus)) relevance += 5;

      return {
        slug: post.slug,
        title: post.title,
        relevance: Math.min(99, Math.round(relevance)),
        suggestedAnchor: suggestAnchor(post, focus),
      };
    })
    .filter((s) => s.relevance >= 20)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);

  return candidates;
}

export function findOrphanPosts(
  allPosts: BlogPost[],
  incomingLinkCounts?: Map<string, number>
): BlogPost[] {
  const linked = incomingLinkCounts ?? countIncomingLinks(allPosts);
  return allPosts.filter((p) => (linked.get(p.slug) ?? 0) === 0);
}

export function countIncomingLinks(allPosts: BlogPost[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const post of allPosts) {
    const linkRegex = /<a[^>]*href=["']([^"']+)["']/gi;
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(post.content)) !== null) {
      const href = match[1];
      const slugMatch = href.match(/\/blog\/([a-z0-9-]+)/);
      if (slugMatch) {
        const targetSlug = slugMatch[1];
        counts.set(targetSlug, (counts.get(targetSlug) ?? 0) + 1);
      }
    }
  }
  return counts;
}

export function insertInternalLink(
  content: string,
  slug: string,
  anchor: string,
  linkText?: string
): string {
  const href = `/blog/${slug}`;
  if (content.includes(href)) return content;

  const wrapped = wrapAnchorInHtml(content, anchor, href);
  if (wrapped) return wrapped;

  const displayText = linkText?.trim() || anchor;
  const link = `<a href="${href}">${displayText}</a>`;
  const pMatch = content.match(/<p[^>]*>[\s\S]*?<\/p>/i);
  if (pMatch) {
    const idx = content.indexOf(pMatch[0]) + pMatch[0].length;
    return (
      content.slice(0, idx) +
      `<p>Related reading: ${link}.</p>` +
      content.slice(idx)
    );
  }
  return content + `<p>Related reading: ${link}.</p>`;
}
