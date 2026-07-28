import {
  ArrowRight,
  MessageSquare,
  Vote,
  Zap,
  Users,
  LayoutGrid,
  CheckCircle2,
  Timer,
  Shield,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { StarfishTemplatePreview } from "@/app/create/starfish-template-preview";
import { SailboatTemplatePreview } from "@/app/create/sailboat-template-preview";
import { getWedgeFillColor } from "@/app/board/[id]/starfish-geometry";
import { getSailboatSectionFillColor } from "@/app/board/[id]/sailboat-geometry";
import { BOARD_TEMPLATES, hasIllustratedLayout } from "@/lib/types";

function templateHref(id: string) {
  return id === "starfish" ? "/templates/starfish" : `/create?template=${id}`;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";

export const metadata: Metadata = {
  title: "Free Online Retrospective Board for Agile Teams",
  description:
    "Run better agile retrospectives online. Collect feedback, vote anonymously, and turn insights into action — in real time. Free for everyone.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
    type: "website",
    title: "SprintsPlans — Free Online Retrospective Board",
    description:
      "Run better agile retrospectives online. Collect feedback, vote anonymously, and turn insights into action — in real time. Free for everyone.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SprintsPlans — Free Online Retrospective Board",
    description:
      "Run better agile retrospectives online. Collect feedback, vote anonymously, and turn insights into action — in real time. Free for everyone.",
  },
};

const features = [
  {
    icon: MessageSquare,
    title: "Collect Feedback",
    description:
      "Team members add cards to columns like \"What went well\", \"What didn't\", and \"Action items\" in real time.",
  },
  {
    icon: Vote,
    title: "Anonymous Voting",
    description:
      "Let everyone vote on the most important topics without bias. Prioritize what matters most to your team.",
  },
  {
    icon: Zap,
    title: "Real-Time Collaboration",
    description:
      "See updates instantly across all participants. No need to refresh — everything syncs live.",
  },
  {
    icon: CheckCircle2,
    title: "Action Items Tracking",
    description:
      "Turn insights into actions. Assign owners, set deadlines, and track progress across sprints.",
  },
  {
    icon: LayoutGrid,
    title: "Customizable Templates",
    description:
      "Start from classic retrospective formats or create your own custom board layout to fit your needs.",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description:
      "Your data stays yours. Boards are private by default with optional password protection.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Board",
    description:
      "Choose a template or start blank. Share the link with your team — no sign-up required for participants.",
  },
  {
    step: "02",
    title: "Gather & Discuss",
    description:
      "Team members add cards, group similar items, and discuss each topic. Use the built-in timer to stay on track.",
  },
  {
    step: "03",
    title: "Vote & Prioritize",
    description:
      "Everyone votes anonymously on the most impactful items. The board auto-sorts by priority.",
  },
  {
    step: "04",
    title: "Take Action",
    description:
      "Convert top-voted items into action items with owners and deadlines. Export to Jira, Trello, or CSV.",
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SprintsPlans",
    url: SITE_URL,
    description:
      "Run better agile retrospectives online. Collect feedback, vote anonymously, and turn insights into action — in real time.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 pt-28 pb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <Timer className="size-4" />
            <span>Run a retro in under 30 minutes</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Better Retrospectives,{" "}
            <span className="text-primary">
              Happier Teams
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            The simplest way to run agile retrospectives online. Gather feedback,
            vote anonymously, and turn insights into action — all in real time.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Start Your Free Retro
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1 text-base font-semibold text-foreground hover:text-muted-foreground transition-colors"
            >
              See how it works <ArrowRight className="size-4" />
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · Free for everyone
          </p>
        </div>

        {/* Board preview mock */}
        <div className="mx-auto max-w-5xl px-6 pb-20">
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-yellow-400" />
              <span className="size-3 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 rounded-md border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                sprintsplans.com/room/abc123
              </div>
            </div>
            {/* Board title bar */}
            <div className="border-b border-border px-6 py-3">
              <p className="text-sm font-semibold">Sprint 24 Retrospective</p>
            </div>
            {/* Columns */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
              {/* What went well */}
              <div className="rounded-xl border border-green-200 bg-green-50/70 p-3.5 dark:border-green-900 dark:bg-green-950/30">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-400">
                  ✅ What went well
                </h3>
                <div className="space-y-2">
                  <div className="rounded-lg border border-green-100 bg-white p-3 text-sm shadow-sm dark:border-green-900/40 dark:bg-green-900/20">
                    <p className="font-medium leading-snug text-foreground">Great team collaboration on the API redesign</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3" /> 5 votes
                    </p>
                  </div>
                  <div className="rounded-lg border border-green-100 bg-white p-3 text-sm shadow-sm dark:border-green-900/40 dark:bg-green-900/20">
                    <p className="font-medium leading-snug text-foreground">Deployed to production with zero downtime</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3" /> 3 votes
                    </p>
                  </div>
                </div>
              </div>
              {/* What didn't go well */}
              <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 dark:border-red-900 dark:bg-red-950/30">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-400">
                  ❌ What didn&apos;t go well
                </h3>
                <div className="space-y-2">
                  <div className="rounded-lg border border-red-100 bg-white p-3 text-sm shadow-sm dark:border-red-900/40 dark:bg-red-900/20">
                    <p className="font-medium leading-snug text-foreground">Sprint scope changed mid-week again</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3" /> 7 votes
                    </p>
                  </div>
                  <div className="rounded-lg border border-red-100 bg-white p-3 text-sm shadow-sm dark:border-red-900/40 dark:bg-red-900/20">
                    <p className="font-medium leading-snug text-foreground">Staging environment was unstable</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3" /> 4 votes
                    </p>
                  </div>
                </div>
              </div>
              {/* Action items */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 dark:border-blue-900 dark:bg-blue-950/30">
                <h3 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                  🎯 Action Items
                </h3>
                <div className="space-y-2">
                  <div className="rounded-lg border border-blue-100 bg-white p-3 text-sm shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20">
                    <p className="font-medium leading-snug text-foreground">Set up scope-change review meeting</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3" /> Sarah · Due Apr 5
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-100 bg-white p-3 text-sm shadow-sm dark:border-blue-900/40 dark:bg-blue-900/20">
                    <p className="font-medium leading-snug text-foreground">Improve staging CI pipeline</p>
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="size-3" /> Alex · Due Apr 8
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEMPLATES ─── */}
      <section className="border-t border-border bg-gradient-to-br from-primary/5 via-background to-[#2b48a9]/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Retrospective Templates
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground leading-relaxed">
              Pick a format that fits your team — from classic three-column boards to the radial
              Starfish layout.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BOARD_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="flex flex-col rounded-2xl border border-primary/20 bg-background p-6 shadow-sm"
              >
                {template.id === "starfish" && (
                  <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="size-3.5" />
                    New
                  </div>
                )}
                <div
                  className={`mb-4 ${hasIllustratedLayout(template.layout) ? "flex justify-center" : "flex flex-wrap gap-2 text-2xl"}`}
                >
                  {template.layout === "radial" ? (
                    <StarfishTemplatePreview />
                  ) : template.layout === "sailboat" ? (
                    <SailboatTemplatePreview />
                  ) : (
                    template.columns.map((col) => (
                      <span key={col.title} title={col.title}>
                        {col.emoji}
                      </span>
                    ))
                  )}
                </div>
                <h3 className="text-lg font-bold tracking-tight">{template.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 text-xs font-bold uppercase tracking-wide">
                  {template.columns.map((col) => (
                    <span
                      key={col.title}
                      className="rounded-lg px-2.5 py-1.5"
                      style={{
                        backgroundColor:
                          template.layout === "sailboat"
                            ? getSailboatSectionFillColor(col.color)
                            : getWedgeFillColor(col.color),
                      }}
                    >
                      {col.title}
                    </span>
                  ))}
                </div>
                <a
                  href={templateHref(template.id)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                  {template.id === "starfish" ? "Explore Starfish" : "Use template"}
                  <ArrowRight className="size-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="border-t border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for effective retros
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Built by agile teams, for agile teams. Simple, fast, and focused on
              what matters — continuous improvement.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              No installation, no complex setup. Just create a board and invite
              your team.
            </p>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative">
                <div className="mb-4 text-4xl font-extrabold text-primary/20">
                  {s.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ─── */}
      <section className="border-t border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Users className="mx-auto mb-4 size-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by 2,000+ agile teams
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            From startups to enterprises, teams use SprintsPlans to run better
            sprints and build stronger products.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                quote:
                  "Our retros went from boring meetings to the most engaging ceremony of the sprint.",
                author: "Marie D.",
                role: "Scrum Master",
              },
              {
                quote:
                  "Anonymous voting changed everything. We finally get honest feedback from the whole team.",
                author: "Karim A.",
                role: "Tech Lead",
              },
              {
                quote:
                  "We cut our retro time in half and the action items actually get done now.",
                author: "Julie P.",
                role: "Product Owner",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="rounded-xl border border-border bg-background p-6 text-left"
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="border-t border-border bg-brand-blue-bg/40 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to transform your retrospectives?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of teams already running better retros with SprintsPlans.
            It takes less than a minute to get started.
          </p>
          <div className="mt-8">
            <a
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Create Your First Board — It&apos;s Free
              <ArrowRight className="size-5" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
    </>
  );
}
