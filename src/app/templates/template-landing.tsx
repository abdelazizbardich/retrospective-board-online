import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbListSchema, faqPageSchema, webPageSchema } from "@/lib/structured-data";
import {
  getTemplatePage,
  templateCreatePath,
  templateLandingPath,
  type TemplatePageContent,
} from "@/lib/template-pages";
import { getWedgeFillColor } from "@/app/board/[id]/starfish-geometry";
import { getSailboatSectionFillColor } from "@/app/board/[id]/sailboat-geometry";
import { ColumnHero } from "./column-hero";
import { SailboatHeroDiagram } from "./sailboat-hero-diagram";
import { StarfishHeroDiagram } from "./starfish-hero-diagram";

const COLOR_BADGE: Record<string, { text: string; bg: string }> = {
  green: { text: "text-[#269353]", bg: "bg-[#269353]/10" },
  red: { text: "text-red-600", bg: "bg-red-500/10" },
  blue: { text: "text-[#2b48a9]", bg: "bg-[#2b48a9]/10" },
  yellow: { text: "text-[#d5a615]", bg: "bg-[#d5a615]/10" },
  purple: { text: "text-[#a541b2]", bg: "bg-[#a541b2]/10" },
  gray: { text: "text-zinc-600 dark:text-zinc-300", bg: "bg-zinc-500/10" },
};

const PRIMARY_CTA =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function columnGridClass(count: number) {
  if (count >= 5) return "sm:grid-cols-2 lg:grid-cols-5";
  if (count === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-3";
}

function TemplateHeroVisual({ page }: { page: TemplatePageContent }) {
  if (page.slug === "starfish") {
    return (
      <div className="rounded-2xl border border-border bg-background p-6 shadow-xl">
        <StarfishHeroDiagram />
      </div>
    );
  }
  if (page.slug === "sailboat") {
    return <SailboatHeroDiagram />;
  }
  return <ColumnHero name={page.name} columns={page.columns} />;
}

export function TemplateLanding({ page }: { page: TemplatePageContent }) {
  const createHref = templateCreatePath(page.slug);
  const path = templateLandingPath(page.slug);
  const related = page.relatedSlugs
    .map((slug) => getTemplatePage(slug))
    .filter((item): item is TemplatePageContent => Boolean(item));

  const jsonLd = [
    webPageSchema({
      name: `${page.name} Template`,
      path,
      description: page.metaDescription,
    }),
    breadcrumbListSchema([
      { name: "Home", path: "/" },
      { name: "Templates", path: "/templates" },
      { name: page.name, path },
    ]),
    faqPageSchema(page.faqs),
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
                  <Link href="/" className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/templates" className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm">
                    Templates
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="min-w-0 truncate font-medium text-foreground" aria-current="page">
                  {page.name}
                </li>
              </ol>
            </nav>
          </div>

          <section className="relative overflow-hidden border-b border-border">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
              <div className="min-w-0">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                  <Sparkles className="size-4" />
                  {page.badge}
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                  {page.h1Lead}{" "}
                  <span className="text-primary">{page.h1Accent}</span>
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  {page.intro}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <Link href={createHref} className={PRIMARY_CTA}>
                    Use this template free
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/templates"
                    className="inline-flex min-h-11 items-center justify-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                  >
                    Browse all templates <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/compare"
                    className="inline-flex min-h-11 items-center justify-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                  >
                    Compare tools <ArrowRight className="size-4" />
                  </Link>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Free · No sign-up for participants · Ready in seconds
                </p>
              </div>
              <TemplateHeroVisual page={page} />
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {page.whatHeading}
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                {page.whatParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 py-24">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {page.whenHeading}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{page.whenIntro}</p>
                <ul className="mt-6 space-y-3">
                  {page.whenItems.map((item) => (
                    <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-background p-6 sm:p-8">
                <h3 className="text-lg font-semibold">{page.whenSkipHeading}</h3>
                <ul className="mt-4 space-y-3">
                  {page.whenSkip.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/templates"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                >
                  Compare all templates <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {page.columnsHeading}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                  {page.columnsIntro}
                </p>
              </div>
              <div className={`mt-14 grid gap-4 ${columnGridClass(page.columns.length)}`}>
                {page.columns.map((column) => {
                  const badge = COLOR_BADGE[column.color] ?? COLOR_BADGE.blue;
                  return (
                    <div
                      key={column.title}
                      className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md"
                    >
                      <div
                        className={`mb-3 inline-flex size-10 items-center justify-center rounded-lg text-lg ${badge.bg}`}
                      >
                        <span aria-hidden>{column.emoji}</span>
                      </div>
                      <h3 className={`text-sm font-extrabold uppercase tracking-wide ${badge.text}`}>
                        {column.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {column.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {page.features && page.features.length > 0 && (
            <section className="border-t border-border bg-muted/30 py-24">
              <div className="mx-auto max-w-6xl px-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {page.featuresHeading}
                  </h2>
                  {page.featuresIntro && (
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                      {page.featuresIntro}
                    </p>
                  )}
                </div>
                <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {page.features.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-xl border border-border bg-background p-6 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-t border-border py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {page.tipsHeading}
              </h2>
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {page.tips.map((tip) => (
                  <div key={tip.title} className="rounded-xl border border-border bg-background p-6">
                    <h3 className="font-semibold">{tip.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-muted/30 py-24">
            <div className="mx-auto max-w-4xl px-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {page.howHeading}
                </h2>
              </div>
              <ol className="mt-12 space-y-6">
                {page.howSteps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-muted-foreground leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                {["Write", "Organize", "Vote", "Discuss", "Done"].map((phase) => (
                  <span
                    key={phase}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 font-medium"
                  >
                    <CheckCircle2 className="size-3.5 text-primary" aria-hidden />
                    {phase}
                  </span>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Link href={createHref} className={PRIMARY_CTA}>
                  Use this template free
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently asked questions
              </h2>
              <div className="mt-10 space-y-8">
                {page.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="text-lg font-semibold">{faq.question}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {related.length > 0 && (
            <section className="border-t border-border bg-muted/30 py-24">
              <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Other templates to try
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  Rotate formats when this one goes stale. Each page explains the columns and links to a free board.
                </p>
                <div className="mt-10 grid gap-6 sm:grid-cols-3">
                  {related.map((item) => (
                    <article
                      key={item.slug}
                      className="flex min-w-0 flex-col rounded-2xl border border-border bg-background p-6"
                    >
                      <h3 className="text-lg font-bold tracking-tight">{item.name}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {item.bestFor}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5 text-xs font-bold uppercase tracking-wide">
                        {item.columns.map((column) => (
                          <span
                            key={column.title}
                            className="rounded-lg px-2.5 py-1.5"
                            style={{
                              backgroundColor:
                                item.slug === "sailboat"
                                  ? getSailboatSectionFillColor(column.color)
                                  : getWedgeFillColor(column.color),
                            }}
                          >
                            {column.title}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
                        <Link
                          href={templateLandingPath(item.slug)}
                          className="text-primary hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                        >
                          Explore template
                        </Link>
                        <Link
                          href={templateCreatePath(item.slug)}
                          className="text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm"
                        >
                          Use free
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="border-t border-border py-24">
            <div className="mx-auto max-w-3xl px-6 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {page.ctaHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                {page.ctaBody}
              </p>
              <Link href={createHref} className={`${PRIMARY_CTA} mt-8 px-8 py-4`}>
                Use this template free
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
