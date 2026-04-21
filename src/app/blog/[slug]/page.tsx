import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { getBlogPost } from "@/lib/blog-store";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post?.published) return {};
  return {
    title: `${post.title} — SprintsPlans Blog`,
    description: post.metaDescription || post.excerpt || undefined,
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt || undefined,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Content */}
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="size-4" />
          Back to Blog
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
              >
                <Tag className="size-3" />
                {tag}
              </span>
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
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
