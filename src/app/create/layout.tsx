import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Board",
  description:
    "Start a free retrospective board in seconds. Pick a template and invite your team — no sign-up required.",
  alternates: { canonical: "/create" },
  openGraph: {
    url: "/create",
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
  return <>{children}</>;
}
