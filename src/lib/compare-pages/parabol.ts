import type { ComparePageContent } from "./types";

export const parabolPage: ComparePageContent = {
  slug: "parabol",
  competitorName: "Parabol",
  competitorUrl: "https://www.parabol.co",
  competitorPricingUrl: "https://www.parabol.co/pricing/",
  badge: "Free Parabol alternative",
  h1Lead: "Parabol alternative",
  h1Accent: "when you only need the retro",
  seoTitle: "Parabol Alternative",
  metaDescription:
    "Parabol alternative for focused sprint retros. Compare Parabol vs SprintsPlans: free forever boards vs a 10-meeting Starter cap. Create a board.",
  ogTitle: "Parabol Alternative — SprintsPlans",
  ogDescription:
    "A free Parabol alternative for teams that want a retrospective board without a 10-meetings-per-month cap, poker, or per-active-user billing.",
  intro:
    "Parabol is an open-source meeting app: retrospectives, standups, check-ins, Sprint Poker, and (on paid) team health. The Starter plan is free for two teams and ten meetings a month, with 30 days of history. If you searched for a Parabol alternative or Parabol vs SprintsPlans, you either hit that monthly cap or you do not want poker and standups in the same product. SprintsPlans is a free retrospective board — the ceremony, not the suite.",
  bestFor: "Teams that like Parabol’s retro idea but not the meeting caps or per-user upgrade",
  pricingSnapshot: "Parabol Starter: free for 2 teams, 10 meetings/month. Team $8 per active user/month.",
  whoHeading: "Who each tool is for",
  whoCompetitorHeading: "Parabol is a strong fit when",
  whoCompetitor: [
    "You want retros, standups, check-ins, and Sprint Poker in one account",
    "Open-source / self-host (Enterprise) or SOC 2 Type II on the SaaS is a requirement",
    "Two teams and ten meetings a month is enough, or you will pay $8 per active user",
    "Jira, GitHub, and Slack integrations are how tasks leave the meeting",
  ],
  whoUsHeading: "Choose SprintsPlans when",
  whoUs: [
    "You only run sprint retrospectives and do not need poker or standups",
    "Ten meetings a month (or 30-day history) is a real constraint",
    "You do not want billing that scales with every active facilitator and attendee",
    "A template link plus anonymous votes is the whole workflow",
  ],
  tableHeading: "Parabol vs SprintsPlans",
  tableIntro:
    "Parabol’s free tier is generous until you outgrow two teams or ten meetings. SprintsPlans stays a retro board: no poker, no per-user meter, no 30-day history window on the product page.",
  rows: [
    {
      label: "What it is",
      competitor: "Agile meetings: retro, standup, check-in, Sprint Poker, health (paid)",
      sprintsplans: "Retrospective board with sprint templates",
    },
    {
      label: "Free plan",
      competitor: "2 teams, 10 meetings/month, 30 days of history, 2 custom templates",
      sprintsplans: "Free to create a retro board and share a link",
    },
    {
      label: "Paid starting price",
      competitor: "$8 per active user per month (Team). Enterprise is custom",
      sprintsplans: "Free",
    },
    {
      label: "Users on free",
      competitor: "Unlimited users inside the meeting caps",
      sprintsplans: "Join from a link — no meeting quota in the product",
    },
    {
      label: "Anonymity",
      competitor: "Anonymity by default in meetings",
      sprintsplans: "Anonymous cards and votes on the board",
    },
    {
      label: "Templates",
      competitor: "90+ meeting templates; 2 custom on Starter",
      sprintsplans: "Classic, 4Ls, Start / Stop / Continue, Mad / Sad / Glad, Sailboat, Starfish",
    },
    {
      label: "AI extras",
      competitor: "Prompts on Starter; grouping and unlimited summaries on Team",
      sprintsplans: "No AI summaries — discussion stays human",
    },
    {
      label: "Integrations & SSO",
      competitor: "Jira / GitHub / Slack on plans; SAML SSO on Enterprise",
      sprintsplans: "Excel export; no SAML SSO",
    },
  ],
  pricingHeading: "Free until the meeting counter matters",
  pricingParagraphs: [
    "Parabol’s pricing page (November 2026) lists Starter as free for up to two teams per company, ten meetings per month, unlimited users, 90+ templates, 30 days of history, and two custom templates. Team is $8 per active user per month and unlocks unlimited teams and history, private teams, team health, and more AI. Enterprise adds SAML SSO, SCIM, optional on-prem, and annual contracts. An “active user” is someone who logged in within 30 days.",
    "Ten meetings sounds large until you count standups. If the same two teams run a weekly standup plus a sprint retro, Starter is a countdown, not a home. Even retro-only teams on a one-week cadence can brush the cap.",
    "SprintsPlans does not include Sprint Poker or team health. If those are why you opened Parabol, stay. If you opened Parabol for a retrospective and the rest is noise, a free board with anonymous votes is the smaller Parabol alternative.",
  ],
  pickUsHeading: "Pick SprintsPlans if",
  pickUs: [
    "You want a Parabol alternative that is only a retrospective, forever free for that job",
    "Ten meetings a month or 30-day history would clip a real team calendar",
    "Per-active-user pricing would bill people who only attend the retro",
    "You already have Jira and Slack; you just need a board for the hour",
  ],
  pickThemHeading: "Stay on Parabol if",
  pickThem: [
    "Standups, check-ins, and Sprint Poker belong in the same product as the retro",
    "You are inside two teams and ten meetings and like the Starter plan as-is",
    "Open source, self-host, or Enterprise SSO is a hard requirement",
    "Team health checks (paid) are the reason you evaluated Parabol",
  ],
  switchHeading: "Keep the retro, leave the meeting quota",
  switchSteps: [
    "Create a SprintsPlans board with Classic or the format you used in Parabol.",
    "Share the link in the same Slack channel you used for Parabol invites. No one needs a second meeting seat.",
    "Write, group, vote anonymously, assign owners. Export to Excel if you were using Parabol’s CSV habit.",
  ],
  faqs: [
    {
      question: "Is Parabol free?",
      answer:
        "Starter is free for two teams and ten meetings per month, with 30 days of history (November 2026). Team is $8 per active user per month. Confirm current limits on parabol.co/pricing.",
    },
    {
      question: "Is SprintsPlans a Parabol alternative?",
      answer:
        "For sprint retrospectives, yes. It is not a replacement for Sprint Poker, standups, team health, or Parabol’s integrations. Use it when the retro is the only meeting you needed the tool for.",
    },
    {
      question: "What happens if we outgrow Parabol Starter?",
      answer:
        "Parabol asks you to pay $8 per active user. SprintsPlans does not have that upgrade path because the board itself is free. You also give up Parabol’s extra meeting types.",
    },
    {
      question: "Do people need accounts?",
      answer:
        "Parabol is account-centric (Google or Microsoft sign-on on the SaaS). SprintsPlans lets participants join from a link without signing up. Facilitators can optionally keep an account for a list of hosted boards.",
    },
  ],
  relatedSlugs: ["easyretro", "teamretro", "miro"],
  relatedTemplates: ["classic", "start-stop-continue", "4ls"],
  ctaHeading: "A retro without a meeting counter",
  ctaBody:
    "Create a free board, share the link, and vote anonymously. No ten-meeting cap. No per-user upgrade for the basics.",
  ctaHref: "/create?template=classic",
};
