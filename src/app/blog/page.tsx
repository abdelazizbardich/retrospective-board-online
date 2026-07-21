import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getBlogPostsPage } from "@/lib/blog-store";

import { SiteHeader, SiteFooter } from "@/app/components/site-nav";

import { BlogPagination } from "@/app/components/blog-pagination";

import { BlogPostCard } from "@/app/components/blog-post-card";

import { BlogSearchForm } from "@/app/components/blog-search-form";



const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";



export async function generateMetadata({

  searchParams,

}: Readonly<{

  searchParams: Promise<{ page?: string }>;

}>): Promise<Metadata> {

  const { page: pageParam } = await searchParams;

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const pageSuffix = page > 1 ? ` — Page ${page}` : "";



  return {

    title: `Blog${pageSuffix} — SprintsPlans`,

    description: "Tips, guides, and insights on agile retrospectives and team collaboration.",

    alternates: {

      canonical: page > 1 ? `${SITE_URL}/blog?page=${page}` : `${SITE_URL}/blog`,

    },

    openGraph: {

      title: `Blog${pageSuffix} — SprintsPlans`,

      description: "Tips, guides, and insights on agile retrospectives and team collaboration.",

      url: page > 1 ? `${SITE_URL}/blog?page=${page}` : `${SITE_URL}/blog`,

      type: "website",

    },

  };

}



export default async function BlogPage({

  searchParams,

}: Readonly<{

  searchParams: Promise<{ page?: string }>;

}>) {

  const { page: pageParam } = await searchParams;

  const requestedPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { posts, page, totalPages, total } = await getBlogPostsPage(requestedPage);



  if (requestedPage > totalPages && total > 0) {

    redirect(totalPages === 1 ? "/blog" : `/blog?page=${totalPages}`);

  }



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

          <BlogSearchForm />

        </div>

      </section>



      {/* Posts grid */}

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">

        {posts.length === 0 ? (

          <div className="text-center text-muted-foreground py-24">

            <p className="text-lg">No posts yet — check back soon!</p>

          </div>

        ) : (

          <>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

              {posts.map((post) => (

                <BlogPostCard key={post.id} post={post} />

              ))}

            </div>



            <BlogPagination page={page} totalPages={totalPages} />

          </>

        )}

      </main>



      <SiteFooter />

    </div>

  );

}


