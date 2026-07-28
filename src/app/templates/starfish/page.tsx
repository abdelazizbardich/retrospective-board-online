import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Palette,
  MousePointerClick,
  Users,
  Vote,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/app/components/site-nav";
import { StarfishHeroDiagram } from "./starfish-hero-diagram";
import { BOARD_TEMPLATES } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";
const starfish = BOARD_TEMPLATES.find((t) => t.id === "starfish")!;

const sections = [
  {
    title: "More",
    emoji: "📈",
    color: "text-[#2b48a9]",
    bg: "bg-[#2b48a9]/10",
    description: "What should the team do more of? Celebrate practices worth amplifying.",
  },
  {
    title: "Less",
    emoji: "📉",
    color: "text-[#a541b2]",
    bg: "bg-[#a541b2]/10",
    description: "What should happen less often? Identify habits to reduce without losing momentum.",
  },
  {
    title: "Start",
    emoji: "🚀",
    color: "text-[#d5a615]",
    bg: "bg-[#d5a615]/10",
    description: "New ideas to try next sprint. Fresh experiments and improvements.",
  },
  {
    title: "Stop",
    emoji: "🛑",
    color: "text-red-600",
    bg: "bg-red-500/10",
    description: "What's not working? Call out blockers and wasteful activities.",
  },
  {
    title: "Keep",
    emoji: "✅",
    color: "text-[#269353]",
    bg: "bg-[#269353]/10",
    description: "What's going well? Reinforce the rituals and habits that already work.",
  },
];

const features = [
  {
    icon: LayoutGrid,
    title: "Radial starfish layout",
    description: "Five arms radiate from the center — a visual format teams instantly recognize.",
  },
  {
    icon: Palette,
    title: "Color-coded sections",
    description: "Each arm has its own color so feedback is easy to scan at a glance.",
  },
  {
    icon: MousePointerClick,
    title: "Click to add notes",
    description: "Tap any section to open a floating note. No hunting for add buttons.",
  },
  {
    icon: Users,
    title: "Real-time collaboration",
    description: "Everyone adds cards simultaneously. Updates sync live across the room.",
  },
  {
    icon: Vote,
    title: "Vote & discuss",
    description: "Move through Write, Organize, Vote, and Discuss phases like any retro.",
  },
  {
    icon: Sparkles,
    title: "Fully customizable",
    description: "Rename sections, change colors, add arms, or switch templates anytime.",
  },
];

export default function StarfishTemplatePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Starfish Retrospective Template",
    url: `${SITE_URL}/templates/starfish`,
    description:
      "Free online Starfish retrospective board with five sections: More, Less, Start, Stop, and Keep.",
    isPartOf: { "@type": "WebSite", name: "SprintsPlans", url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="size-4" />
                New template
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Starfish{" "}
                <span className="text-primary">Retrospective</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                {starfish.description} Gather balanced feedback across five arms — then vote,
                discuss, and turn insights into action.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/create?template=starfish"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
                >
                  Start a Starfish Retro
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse all templates <ArrowRight className="size-4" />
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Free · No sign-up for participants · Ready in seconds
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-6 shadow-xl">
              <StarfishHeroDiagram />
            </div>
          </div>
        </section>

        {/* Five arms */}
        <section className="bg-muted/30 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Five arms, five questions
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                The Starfish format gives every type of feedback a clear home — from things to
                amplify to things to drop.
              </p>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {sections.map((section) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md"
                >
                  <div
                    className={`mb-3 inline-flex size-10 items-center justify-center rounded-lg text-lg ${section.bg}`}
                  >
                    {section.emoji}
                  </div>
                  <h3 className={`text-sm font-extrabold uppercase tracking-wide ${section.color}`}>
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for visual retros
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                More than a column layout — the Starfish board is designed around the radial
                format from the ground up.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-background p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to run */}
        <section className="border-t border-border bg-muted/30 py-24">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How to run a Starfish retro
              </h2>
            </div>
            <ol className="mt-12 space-y-6">
              {[
                "Create a board with the Starfish template and share the link with your team.",
                "During the Write phase, click each arm to add sticky notes — More, Less, Start, Stop, Keep.",
                "Organize similar cards, vote on the most important topics, then discuss top items.",
                "Capture action items and export the board when you're done.",
              ].map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
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
                  <CheckCircle2 className="size-3.5 text-primary" />
                  {phase}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Try the Starfish template today
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Give your team a fresh way to reflect. Create a free board and run your next
              retrospective in minutes.
            </p>
            <Link
              href="/create?template=starfish"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Create Starfish Board — Free
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
