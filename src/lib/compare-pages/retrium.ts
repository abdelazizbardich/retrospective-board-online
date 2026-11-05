import type { ComparePageContent } from "./types";

export const retriumPage: ComparePageContent = {
  slug: "retrium",
  competitorName: "Retrium",
  competitorUrl: "https://www.retrium.com",
  competitorPricingUrl: "https://www.retrium.com/pricing",
  badge: "Free Retrium alternative",
  h1Lead: "Retrium alternative",
  h1Accent: "without a Team Room bill",
  seoTitle: "Retrium Alternative",
  metaDescription:
    "Retrium alternative for teams that want a free retro board. Compare Retrium vs SprintsPlans: $39 per Team Room vs free boards, anonymous votes, no trial cliff.",
  ogTitle: "Retrium Alternative — SprintsPlans",
  ogDescription:
    "A free Retrium alternative for sprint retrospectives. Skip the $39 Team Room and the 30-day trial — create a live board and share a link.",
  intro:
    "Retrium is a facilitation-first retrospective product: Team Rooms, many activities, Jira Cloud, and a 30-day trial — then a bill per room. If you searched for a Retrium alternative or Retrium vs SprintsPlans, you probably like the ceremony and dislike paying $39 per Team Room each month after the trial. SprintsPlans is the free online board for the same gather → vote → act loop.",
  bestFor: "Teams leaving a Retrium trial who still need a live retro, not a per-room subscription",
  pricingSnapshot: "Retrium: no free plan. Team $39 per Team Room/month. 30-day trial.",
  whoHeading: "Who each tool is for",
  whoCompetitorHeading: "Retrium is a strong fit when",
  whoCompetitor: [
    "You want a library of facilitated activities, not only column boards",
    "Jira Cloud integration and Team Room history are required, not nice-to-have",
    "Procurement needs SSO, SOC audit access, or invoicing — those sit on Business and above",
    "You will keep enough rooms busy that $39 per room is cheaper than a messy whiteboard",
  ],
  whoUsHeading: "Choose SprintsPlans when",
  whoUs: [
    "The trial is ending and you only needed a board, not a Team Room platform",
    "You run one or two squads and cannot justify a per-room invoice",
    "Anonymous voting and a shareable link are the whole requirement",
    "You want Classic, Starfish, or Sailboat live in the browser without a credit card",
  ],
  tableHeading: "Retrium vs SprintsPlans",
  tableIntro:
    "Retrium sells structured facilitation and org features. SprintsPlans sells a free board. Both can run a sprint retro; only one asks for a Team Room after 30 days.",
  rows: [
    {
      label: "What it is",
      competitor: "Facilitation platform: Team Rooms, activities, Jira Cloud",
      sprintsplans: "Free online retrospective board with sprint templates",
    },
    {
      label: "Free plan",
      competitor: "None — 30-day trial of column and team-radar techniques",
      sprintsplans: "Free to create a board and run the retro",
    },
    {
      label: "Paid starting price",
      competitor: "$39 per Team Room / month (Team). Business $715 / room / year",
      sprintsplans: "Free",
    },
    {
      label: "Users",
      competitor: "Unlimited users per Team Room",
      sprintsplans: "Join from a link — no per-seat fee because there is no seat fee",
    },
    {
      label: "Anonymous voting",
      competitor: "Part of the facilitated retro activities",
      sprintsplans: "Anonymous cards and votes on the board",
    },
    {
      label: "Jira",
      competitor: "Jira Cloud integration on paid plans",
      sprintsplans: "No Jira sync — export the board to Excel if you need a file",
    },
    {
      label: "SSO & compliance extras",
      competitor: "SAML SSO, SOC audit access on Business; more on Enterprise",
      sprintsplans: "Not an enterprise admin suite",
    },
    {
      label: "Best use",
      competitor: "Orgs that will live in Team Rooms and pay for them",
      sprintsplans: "Squads that need a retro this afternoon",
    },
  ],
  pricingHeading: "Retrium’s price is the product",
  pricingParagraphs: [
    "Retrium’s pricing page (November 2026) lists no free-forever plan. Sign-up includes 30 days of column-based and team-radar techniques. After that, Team Edition is $39 per Team Room per month, billed monthly or annually, with unlimited users and retrospectives plus Jira Cloud. Business is listed at $715 per Team Room per year (also shown as $59 per room per month) and adds invoicing, volume discounts, priority support, SOC audit access, and SAML SSO. Enterprise is custom for larger rollouts.",
    "A Team Room is where the team starts retros, reviews history, and checks actions. Retrium lets you delete a room so another team can use the slot in the same billing period — which is fair, and still a subscription you have to manage.",
    "SprintsPlans has no Team Room meter. If your “Retrium alternative” search is really “we liked the trial and do not want the invoice,” create a board and run the same phases: write, group, vote, discuss, done.",
  ],
  pickUsHeading: "Pick SprintsPlans if",
  pickUs: [
    "The Retrium trial is the only thing standing between you and a paid room",
    "You need a free Retrium alternative for one team, not 25",
    "Jira sync and SSO are not in this quarter’s retro checklist",
    "You want the meeting to start from a template link, not a billing screen",
  ],
  pickThemHeading: "Stay on Retrium if",
  pickThem: [
    "Facilitators rely on Retrium’s wider activity set, not only columns",
    "Jira Cloud and Team Room history are how actions survive the meeting",
    "Security review requires SAML SSO or SOC materials Retrium sells on Business",
    "You are rolling out many teams and want invoicing, tagging, and a CSM",
  ],
  switchHeading: "Move the next retro off a trial",
  switchSteps: [
    "Create a SprintsPlans board with the format you already run — Classic if you used columns in Retrium.",
    "Share the link. Nobody needs a Team Room seat to type a card.",
    "Use the timer and anonymous votes, then capture owners on action cards. Export to Excel for the people who lived in Retrium history.",
  ],
  faqs: [
    {
      question: "Does Retrium have a free plan?",
      answer:
        "No permanent free plan. Retrium offers a 30-day trial, then Team Edition at $39 per Team Room per month as of November 2026. Check retrium.com/pricing for the current figure.",
    },
    {
      question: "Is SprintsPlans a Retrium alternative?",
      answer:
        "For sprint retrospectives on a live board, yes. It is not a clone of Retrium’s activity library, Jira Cloud integration, or Business-tier SSO. Use it when the job is the retro, not the platform.",
    },
    {
      question: "What is a Team Room in Retrium vs a SprintsPlans board?",
      answer:
        "A Retrium Team Room is a billed workspace for starting retros and reviewing history. A SprintsPlans board is a single session you create and share. Create a new board next sprint; you are not leasing a room.",
    },
    {
      question: "Can we keep anonymous voting without paying?",
      answer:
        "On SprintsPlans, yes — anonymous cards and votes are part of the free board. Retrium includes retro activities during the trial and on paid rooms; after the trial you need a subscription to keep using them.",
    },
  ],
  relatedSlugs: ["easyretro", "teamretro", "parabol"],
  relatedTemplates: ["classic", "4ls", "starfish"],
  ctaHeading: "Skip the Team Room invoice",
  ctaBody:
    "Create a free retrospective board, share the link, and run write → vote → act this sprint. No trial countdown.",
  ctaHref: "/create?template=classic",
};
