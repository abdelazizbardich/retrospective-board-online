import { getPost, getAllPosts } from "@/lib/blog-store";
import { LayoutGrid, ArrowLeft, Tag, CalendarDays, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DOMPurify from "isomorphic-dompurify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://retroboard.app";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  const image = post.coverImage || undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [post.author],
      tags: post.tags,
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: post.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(image && { images: [image] }),
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || !post.published) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: new Date(post.publishedAt).toISOString(),
    url: `${SITE_URL}/blog/${post.slug}`,
    ...(post.coverImage && { image: post.coverImage }),
    publisher: { "@type": "Organization", name: "SprintsPlans", url: SITE_URL },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <LayoutGrid className="size-6 text-primary" />
            <span>SprintsPlans</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="/blog" className="text-foreground font-semibold">Blog</Link>
            <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" /> All posts
        </Link>

        {/* Cover image or emoji fallback */}
        <div className="mb-8 relative h-64 w-full overflow-hidden rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-border/40">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-7xl">{post.coverEmoji}</div>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <Tag className="size-3" />{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-border/60 pb-6">
          <span className="flex items-center gap-1.5">
            <User className="size-3.5" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {new Date(post.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        {/* Content */}
        <div
          className="prose prose-neutral dark:prose-invert max-w-none mt-6"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 text-center">
          <p className="text-lg font-semibold">Ready to run a better retro?</p>
          <p className="mt-2 text-sm text-muted-foreground">It takes less than a minute to create your first board.</p>
          <Link
            href="/create"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Create a Free Board →
          </Link>
        </div>

        {/* Back */}
        <div className="mt-10">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="size-3.5" /> Back to all posts
          </Link>
        </div>
      </main>
    </div>
    </>
  );
}
