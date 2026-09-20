import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Create a Board",
  description:
    "Start a free retrospective board in seconds. Pick a template and invite your team — no sign-up required.",
  alternates: { canonical: `${SITE_URL}/create` },
  openGraph: {
    url: `${SITE_URL}/create`,
    type: "website",
    title: "Create a Free Retrospective Board — SprintsPlans",
    description:
      "Start a free retrospective board in seconds. Pick a template and invite your team — no sign-up required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Create a Free Retrospective Board — SprintsPlans",
    description:
      "Start a free retrospective board in seconds. Pick a template and invite your team — no sign-up required.",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <section
        aria-labelledby="create-guide-heading"
        className="border-t border-border bg-muted/20 px-6 py-14"
      >
        <div className="mx-auto max-w-4xl space-y-6 text-muted-foreground">
          <h2 id="create-guide-heading" className="text-xl font-bold text-foreground">
            How to start a retrospective on SprintsPlans
          </h2>
          <p className="leading-relaxed">
            Name your board, pick a template (classic columns, Starfish, or Sailboat), and share the
            link with your team. Participants join in the browser without creating an account. You
            can collect notes in real time, group themes, run anonymous dot voting, and capture
            action items for the next sprint.
          </p>
          <p className="leading-relaxed">
            Most teams finish setup in under a minute. If you already run retros in spreadsheets,
            use Import from Excel to bring columns and starter cards into a live board.
          </p>
        </div>
      </section>
    </>
  );
}
