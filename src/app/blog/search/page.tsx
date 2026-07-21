import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowLeft, Folder, Tag } from "lucide-react";
import { getBlogPostsFiltered } from "@/lib/blog-store";
import { blogSearchHref } from "@/lib/blog-links";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { BlogPostCard } from "@/app/components/blog-post-card";
import { BlogPagination } from "@/app/components/blog-pagination";
import { BlogSearchForm } from "@/app/components/blog-search-form";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";

function getFilterLabel(category?: string, tag?: string, q?: string) {
  if (q) return `Results for “${q}”`;
  if (category) return `Posts in ${category}`;
  if (tag) return `Posts tagged “${tag}”`;
  return "Search";
}

function getFilterDescription(category?: string, tag?: string, q?: string) {
  if (q) return `Blog posts matching “${q}”.`;
  if (category) return `Browse blog posts filtered by category “${category}”.`;
  if (tag) return `Browse blog posts filtered by tag “${tag}”.`;
  return "Browse filtered blog posts.";
}

export async function generateMetadata({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>;
}>): Promise<Metadata> {
  const { page: pageParam, category, tag, q } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const label = getFilterLabel(category, tag, q);
  const pageSuffix = page > 1 ? ` — Page ${page}` : "";

  return {
    title: `${label}${pageSuffix} — SprintsPlans Blog`,
    description: getFilterDescription(category, tag, q),
    alternates: {
      canonical: `${SITE_URL}${blogSearchHref({ category, tag, q }, page)}`,
    },
    openGraph: {
      title: `${label}${pageSuffix} — SprintsPlans Blog`,
      description: getFilterDescription(category, tag, q),
      url: `${SITE_URL}${blogSearchHref({ category, tag, q }, page)}`,
      type: "website",
    },
  };
}

export default async function BlogSearchPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ page?: string; category?: string; tag?: string; q?: string }>;
}>) {
  const { page: pageParam, category, tag, q } = await searchParams;
  const requestedPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  if (!category?.trim() && !tag?.trim() && !q?.trim()) {
    redirect("/blog");
  }

  const filters = {
    category: category?.trim() || undefined,
    tag: tag?.trim() || undefined,
    q: q?.trim() || undefined,
  };

  const { posts, page, totalPages, total } = await getBlogPostsFiltered(
    filters,
    requestedPage
  );

  if (requestedPage > totalPages && total > 0) {
    redirect(blogSearchHref(filters, totalPages));
  }

  const label = getFilterLabel(filters.category, filters.tag, filters.q);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <section className="border-b border-border bg-muted/20 py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{label}</h1>
          <p className="mt-4 flex flex-wrap items-center gap-2 text-lg text-muted-foreground">
            {filters.category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Folder className="size-4" />
                {filters.category}
              </span>
            )}
            {filters.tag && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Tag className="size-4" />
                {filters.tag}
              </span>
            )}
          </p>
          <BlogSearchForm defaultValue={filters.q} />
        </div>
      </section>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-24">
            <p className="text-lg">No posts found for this filter.</p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              View all posts
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            <BlogPagination
              page={page}
              totalPages={totalPages}
              hrefForPage={(p) => blogSearchHref(filters, p)}
            />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
