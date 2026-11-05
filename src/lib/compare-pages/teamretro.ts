import type { ComparePageContent } from "./types";

export const teamretroPage: ComparePageContent = {
  slug: "teamretro",
  competitorName: "TeamRetro",
  competitorUrl: "https://www.teamretro.com",
  competitorPricingUrl: "https://www.teamretro.com/pricing/",
  badge: "Free TeamRetro alternative",
  h1Lead: "TeamRetro alternative",
  h1Accent: "for the retro itself",
  seoTitle: "TeamRetro Alternative",
  metaDescription:
    "TeamRetro alternative for simple sprint retros. Compare TeamRetro vs SprintsPlans — paid from about $21/team vs a free board you can share in seconds.",
  ogTitle: "TeamRetro Alternative — SprintsPlans",
  ogDescription:
    "A free TeamRetro alternative when you need a sprint retrospective, not health checks, standups, and a per-team subscription after the trial.",
  intro:
    "TeamRetro is a full agile-meeting suite: guided retros, health checks, estimation, standups, AI summaries, and SSO on every paid plan. There is no free-forever tier — a 30-day trial, then a per-team subscription. If you want a TeamRetro alternative because you only needed the retrospective, SprintsPlans is the free board: templates, live cards, anonymous votes, done.",
  bestFor: "Teams that tried TeamRetro for retros and do not need the rest of the meeting suite",
  pricingSnapshot: "TeamRetro: 30-day trial, then Standard from US$250/team/year (~US$20.83/mo).",
  whoHeading: "Who each tool is for",
  whoCompetitorHeading: "TeamRetro is a strong fit when",
  whoCompetitor: [
    "You want retros, health checks, standups, and estimation in one product",
    "AI grouping, summaries, and suggested actions are part of facilitation",
    "SSO / SAML, US or EU hosting, and SOC reports matter on day one",
    "Per-team pricing with unlimited members is easier than per-seat whiteboards",
  ],
  whoUsHeading: "Choose SprintsPlans when",
  whoUs: [
    "The only meeting you need software for is the sprint retrospective",
    "A 30-day trial that locks history afterward is a non-starter",
    "You want a link-based board with anonymous votes and no participant accounts",
    "Classic, 4Ls, Starfish, or Sailboat is enough structure for the room",
  ],
  tableHeading: "TeamRetro vs SprintsPlans",
  tableIntro:
    "TeamRetro is broader. SprintsPlans is narrower and free. If “TeamRetro vs SprintsPlans” is a budget question, start from whether you need health checks and SSO — not from who has more menu items.",
  rows: [
    {
      label: "What it is",
      competitor: "Retros + health checks + standups + estimation + AI",
      sprintsplans: "Online retrospective board only",
    },
    {
      label: "Free plan",
      competitor: "30-day trial, then subscribe to keep access to retros and actions",
      sprintsplans: "Free board — no trial cliff for the basics",
    },
    {
      label: "Paid starting price",
      competitor: "Standard US$250/team/year (~US$20.83/mo); Business US$350/team/year",
      sprintsplans: "Free",
    },
    {
      label: "Participants",
      competitor: "Unlimited members; participants do not need accounts",
      sprintsplans: "Join from a link; participants do not need accounts",
    },
    {
      label: "Anonymity & voting",
      competitor: "Anonymity options and private voting on paid plans",
      sprintsplans: "Anonymous cards and votes on the board",
    },
    {
      label: "AI",
      competitor: "Assistant, grouping, summaries, sentiment on Standard+",
      sprintsplans: "No AI layer — the team groups and discusses",
    },
    {
      label: "SSO & hosting",
      competitor: "SSO / SAML and US or EU hosting on Standard",
      sprintsplans: "No SAML SSO or region picker",
    },
    {
      label: "Integrations",
      competitor: "Jira, Confluence, Azure DevOps, Slack, Teams, API / MCP",
      sprintsplans: "Excel export; no Jira two-way sync",
    },
  ],
  pricingHeading: "No free-forever plan is a feature, not a footnote",
  pricingParagraphs: [
    "TeamRetro’s pricing page (November 2026) is explicit: Standard is US$20.83 per team per month when billed yearly (US$250), with unlimited members, meetings, AI, SSO, and integrations. Business is US$29.17 per team per month yearly (US$350) for SCIM, cross-team insights, programs, and a SOC 2 Type 2 report. Enterprise is quote-based. Monthly billing exists; the published headline numbers are annual.",
    "The trial is 30 days with no credit card. TeamRetro’s FAQ says that if you do not subscribe, actions and retrospectives are no longer accessible (they retain data for a limited time if you upgrade later). That is the opposite of a free EasyRetro-style forever tier.",
    "SprintsPlans will not match TeamRetro on health-check radar, standup reminders, or MCP access. It will match the hour you actually booked: a sprint retrospective with columns, votes, and owners — without converting a trial into a per-team invoice.",
  ],
  pickUsHeading: "Pick SprintsPlans if",
  pickUs: [
    "You searched for a TeamRetro alternative because the trial is ending and you only ran retros",
    "Health checks, poker, and standups already live in other tools",
    "You need a free board this week, not a SOC 2 packet",
    "Anonymous voting on a simple template is the entire buying criterion",
  ],
  pickThemHeading: "Stay on TeamRetro if",
  pickThem: [
    "You want one vendor for retros, health, standups, and estimation",
    "AI summaries and suggested actions are how you close the meeting",
    "SSO, EU hosting, or SOC reports are required to onboard the company",
    "Cross-team programs and insights (Business) are the reason you evaluated it",
  ],
  switchHeading: "Keep the retro, drop the suite",
  switchSteps: [
    "Pick the format you used in TeamRetro — Classic, Start / Stop / Continue, or 4Ls map cleanly.",
    "Create the SprintsPlans board and drop the link in Slack or the calendar. No team subscription to provision.",
    "Write and vote anonymously. Put owners on action cards. Export to Excel if someone wants the old TeamRetro report habit.",
  ],
  faqs: [
    {
      question: "Is there a free TeamRetro plan?",
      answer:
        "There is a 30-day trial, not a free-forever plan. After the trial you subscribe per team (Standard from US$250/year as of November 2026) or lose access to retros and actions. Confirm current terms on teamretro.com/pricing.",
    },
    {
      question: "How is SprintsPlans different from TeamRetro?",
      answer:
        "SprintsPlans is only a retrospective board. TeamRetro also sells health checks, standups, estimation, AI facilitation, and enterprise admin. If you do not need that bundle, a free board is the smaller tool.",
    },
    {
      question: "Do TeamRetro participants need accounts?",
      answer:
        "No. TeamRetro says team members do not need accounts to join a retro. SprintsPlans works the same way: share a link. The difference is what the facilitator pays after 30 days.",
    },
    {
      question: "Can we still rotate templates?",
      answer:
        "Yes. SprintsPlans includes Classic, 4Ls, Start / Stop / Continue, Mad / Sad / Glad, Sailboat, and Starfish. You will not get TeamRetro’s full custom-workflow catalog — you will get the formats sprint teams reuse.",
    },
  ],
  relatedSlugs: ["easyretro", "retrium", "parabol"],
  relatedTemplates: ["classic", "4ls", "start-stop-continue"],
  ctaHeading: "Run the retro without the suite",
  ctaBody:
    "Create a free board, share the link, and finish with owners. No 30-day countdown on the meeting you actually have.",
  ctaHref: "/create?template=classic",
};
