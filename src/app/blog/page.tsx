import { getAllPosts } from "@/lib/blog-store";
import { LayoutGrid, ArrowRight, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips, best practices, and insights on running effective agile retrospectives.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — SprintsPlans",
    description: "Tips, best practices, and insights on running effective agile retrospectives.",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — SprintsPlans",
    description: "Tips, best practices, and insights on running effective agile retrospectives.",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
          <Link href="/create" className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">
            Get Started Free
          </Link>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-border/40">
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 left-1/2 -z-10 h-80 w-200 -translate-x-1/2 rounded-full bg-linear-to-tr from-indigo-400/20 to-purple-400/10 blur-3xl" />
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            The SprintsPlans{" "}
            <span className="bg-linear-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Tips, frameworks, and insights on running retrospectives that actually lead to change.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts yet — check back soon!</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="group flex flex-col rounded-xl border border-border bg-background hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden">
                {/* Cover image or emoji fallback */}
                <div className="relative h-44 w-full shrink-0 overflow-hidden bg-linear-to-br from-indigo-500/10 to-purple-500/10 border-b border-border/40">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl">{post.coverEmoji}</div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  {post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          <Tag className="size-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="mb-2 text-lg font-bold leading-snug group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-border/40 pt-4">
                    <div>
                      <p className="text-xs font-medium">{post.author}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                      Read <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <section className="border-t border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-lg font-semibold">Ready to put it into practice?</p>
          <p className="mt-2 text-sm text-muted-foreground">Start a free retrospective in under a minute.</p>
          <Link href="/create" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
            Create a Board — It&apos;s Free <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
