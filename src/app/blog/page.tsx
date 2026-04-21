import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, User, Tag } from "lucide-react";
import { getAllBlogPosts } from "@/lib/blog-store";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";

export const metadata: Metadata = {
  title: "Blog — SprintsPlans",
  description: "Tips, guides, and insights on agile retrospectives and team collaboration.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog — SprintsPlans",
    description: "Tips, guides, and insights on agile retrospectives and team collaboration.",
    url: `${SITE_URL}/blog`,
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border bg-muted/20 py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tips, guides, and insights on agile retrospectives and team collaboration.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-24">
            <p className="text-lg">No posts yet — check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-background overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
              >
                {post.coverImage && (
                  <div className="aspect-video overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  {post.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.tags.split(",").slice(0, 3).map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          <Tag className="size-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{post.excerpt}</p>
                  )}
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    {post.author && (
                      <span className="flex items-center gap-1">
                        <User className="size-3" />
                        {post.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
