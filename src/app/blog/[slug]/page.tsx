import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { sanitizeContent } from "@/lib/sanitize-content";
import { getBlogPost, getRelatedBlogPosts } from "@/lib/blog-store";
import { getPostCoverImage } from "@/lib/blog-thumbnail";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { BlogCategoryLink } from "@/app/components/blog-category-link";
import { BlogTagLink } from "@/app/components/blog-tag-link";
import { BlogPostCard } from "@/app/components/blog-post-card";
import { JsonLd } from "@/components/json-ld";
import { blogPostingSchema } from "@/lib/structured-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post?.published) return {};
  const coverImage = getPostCoverImage(post);
  const seoTitle = post.seoTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;
  const canonical = post.canonicalUrl || `${SITE_URL}/blog/${slug}`;
  const ogTitle = post.ogTitle || seoTitle;
  const ogDescription = post.ogDescription || description;
  const ogImage = post.ogImage || coverImage;
  const twitterTitle = post.twitterTitle || ogTitle;
  const twitterDescription = post.twitterDescription || ogDescription;
  const twitterImage = post.twitterImage || ogImage;

  const robots = {
    index: post.robotsIndex !== false,
    follow: post.robotsFollow !== false,
  };

  return {
    title: `${seoTitle} — SprintsPlans Blog`,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: "article",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [twitterImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post?.published) notFound();

  const tags = post.tags
    ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const coverImage = getPostCoverImage(post);
  const relatedPosts = await getRelatedBlogPosts(post);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <JsonLd data={blogPostingSchema(post)} />
      <SiteHeader />

      <main className="flex-1">
      {/* Content */}
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>

        {/* Cover image */}
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Category */}
        {post.category && (
          <BlogCategoryLink
            category={post.category}
            className="inline-flex items-center gap-1.5 mb-3 text-sm font-semibold uppercase tracking-wide text-primary hover:underline"
          />
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <BlogTagLink
                key={tag}
                tag={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              />
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="size-4" />
              {post.author}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Body */}
        <div
          className="prose prose-neutral dark:prose-invert max-w-none mt-8"
          dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }}
        />
      </div>

      {relatedPosts.length > 0 && (
        <section className="border-t border-border bg-muted/20 px-6 py-16">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Related posts</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <BlogPostCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}
      </main>

      <SiteFooter />
    </div>
  );
}
