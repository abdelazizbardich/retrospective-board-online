import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutGrid } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/config";
import { buildDocumentTitle } from "@/lib/seo/meta";
import { breadcrumbListSchema, faqPageSchema, webPageSchema } from "@/lib/structured-data";
import {
  getAllTemplatePages,
  templateCreatePath,
  templateHub,
  templateLandingPath,
} from "@/lib/template-pages";
import { StarfishTemplatePreview } from "@/app/create/starfish-template-preview";
import { SailboatTemplatePreview } from "@/app/create/sailboat-template-preview";
import { getWedgeFillColor } from "@/app/board/[id]/starfish-geometry";
import { getSailboatSectionFillColor } from "@/app/board/[id]/sailboat-geometry";
import { BOARD_TEMPLATES, hasIllustratedLayout } from "@/lib/types";

const PRIMARY_CTA =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export const metadata: Metadata = {
  title: buildDocumentTitle(templateHub.seoTitle),
  description: templateHub.metaDescription,
  alternates: { canonical: `${SITE_URL}/templates` },
  openGraph: {
    url: `${SITE_URL}/templates`,
    type: "website",
    title: templateHub.ogTitle,
    description: templateHub.ogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: templateHub.ogTitle,
    description: templateHub.ogDescription,
  },
};

export default function TemplatesHubPage() {
  const pages = getAllTemplatePages();
  const jsonLd = [
    webPageSchema({
      name: templateHub.h1,
      path: "/templates",
      description: templateHub.metaDescription,
      type: "CollectionPage",
    }),
    breadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "Templates", path: "/templates" },
    ]),
    faqPageSchema(templateHub.faqs),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="content" className="flex-1">
          <div className="mx-auto max-w-6xl px-6 pt-6">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="font-medium text-foreground" aria-current="page">
                  Templates
                </li>
              </ol>
            </nav>
          </div>

          <section className="border-b border-border">
            <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:py-24">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <LayoutGrid className="size-4" />
                Free for every team
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                {templateHub.h1}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {templateHub.intro}
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/create" className={PRIMARY_CTA}>
                  Create a board
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#template-list"
                  className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                >
                  Jump to templates <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </section>

          <section id="template-list" className="scroll-mt-24 bg-gradient-to-br from-primary/5 via-background to-[#2b48a9]/5 py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  All retrospective templates
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                  Each page explains the format, when to use it, and how the columns work — then
                  opens a free board with the same template query the homepage already uses.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => {
                  const template = BOARD_TEMPLATES.find((item) => item.id === page.slug);
                  const layout = template?.layout;
                  return (
                  <article
                    key={page.slug}
                    className="flex min-w-0 flex-col rounded-2xl border border-primary/20 bg-background p-6 shadow-sm"
                  >
                    <div
                      className={`mb-4 ${hasIllustratedLayout(layout) ? "flex justify-center" : "flex flex-wrap gap-2 text-2xl"}`}
                    >
                      {layout === "radial" ? (
                        <StarfishTemplatePreview />
                      ) : layout === "sailboat" ? (
                        <SailboatTemplatePreview />
                      ) : (
                        page.columns.map((column) => (
                          <span key={column.title} title={column.title}>
                            {column.emoji}
                          </span>
                        ))
                      )}
                    </div>
                    <h3 className="text-lg font-bold tracking-tight">
                      <Link
                        href={templateLandingPath(page.slug)}
                        className="rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {page.name}
                      </Link>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {page.bestFor}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5 text-xs font-bold uppercase tracking-wide">
                      {page.columns.map((column) => (
                        <span
                          key={column.title}
                          className="rounded-lg px-2.5 py-1.5"
                          style={{
                            backgroundColor:
                              page.slug === "sailboat"
                                ? getSailboatSectionFillColor(column.color)
                                : getWedgeFillColor(column.color),
                          }}
                        >
                          {column.title}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <Link
                        href={templateLandingPath(page.slug)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                      >
                        Read the guide
                        <ArrowRight className="size-4" />
                      </Link>
                      <Link
                        href={templateCreatePath(page.slug)}
                        className="inline-flex min-h-11 items-center text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                      >
                        Use this template free
                      </Link>
                    </div>
                  </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="border-t border-border py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Which template fits this sprint?
              </h2>
              <div className="mt-10 overflow-x-auto overscroll-contain rounded-2xl border border-border">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <caption className="sr-only">
                    Comparison of retrospective templates by best use and structure
                  </caption>
                  <thead className="bg-muted/60">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Template
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Best for
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Structure
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.slug} className="border-t border-border">
                        <th scope="row" className="px-4 py-3 font-semibold">
                          <Link
                            href={templateLandingPath(page.slug)}
                            className="rounded-sm text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            {page.name}
                          </Link>
                        </th>
                        <td className="px-4 py-3 text-muted-foreground">{page.bestFor}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {page.columns.map((column) => column.title).join(" · ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {templateHub.chooseHeading}
              </h2>
              <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
                {templateHub.chooseParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <ul className="mt-8 space-y-3">
                {[
                  "Classic or Start / Stop / Continue for a first or fast retro",
                  "4Ls when learning and gaps matter as much as delivery",
                  "Starfish when start/stop is too blunt and you need More and Less",
                  "Sailboat when the team needs a picture of the sprint goal",
                  "Mad / Sad / Glad when the room is tense and feelings need a column",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
              <div className="mt-10 space-y-8">
                {templateHub.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-border py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Looking for an EasyRetro or Miro alternative?
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Formats are one decision. Vendors are another. We publish honest side-by-sides of
                EasyRetro, Retrium, TeamRetro, Parabol, and Miro — including when those tools are
                the better fit, and when a free SprintsPlans board is enough.
              </p>
              <Link
                href="/compare"
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Compare retrospective tools
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>

          <section className="border-t border-border bg-brand-blue-bg/40 py-24">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {templateHub.ctaHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                {templateHub.ctaBody}
              </p>
              <Link href="/create" className={`${PRIMARY_CTA} mt-8 px-8 py-4`}>
                Create a board
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
