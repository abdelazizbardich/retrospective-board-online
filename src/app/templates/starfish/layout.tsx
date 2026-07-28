import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sprintsplans.com";

export const metadata: Metadata = {
  title: "Starfish Retrospective Template — Free Online Board",
  description:
    "Run a Starfish retrospective online with five colored arms: More, Less, Start, Stop, and Keep. Free radial board for agile teams — no sign-up required.",
  alternates: { canonical: `${SITE_URL}/templates/starfish` },
  openGraph: {
    url: `${SITE_URL}/templates/starfish`,
    type: "website",
    title: "Starfish Retrospective Template — SprintsPlans",
    description:
      "A visual five-arm retrospective format. Gather feedback across More, Less, Start, Stop, and Keep — free and real-time.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starfish Retrospective Template — SprintsPlans",
    description:
      "A visual five-arm retrospective format. Gather feedback across More, Less, Start, Stop, and Keep.",
  },
};

export default function StarfishTemplateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
