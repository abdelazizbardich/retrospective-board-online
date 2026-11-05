import type { TemplatePageContent } from "./types";

export const classicPage: TemplatePageContent = {
  slug: "classic",
  name: "Classic Retro",
  badge: "Most used format",
  h1Lead: "Classic",
  h1Accent: "Retrospective",
  seoTitle: "Classic Retro Template",
  metaDescription:
    "Run a classic sprint retrospective template online: What went well, What didn’t, and Action items. Free real-time board — no sign-up required.",
  ogTitle: "Classic Retrospective Template — SprintsPlans",
  ogDescription:
    "The standard three-column sprint retrospective: What went well, What didn’t go well, and Action items. Free and real-time.",
  intro:
    "The classic retrospective is the sprint retrospective template most teams learn first. Three columns — What went well, What didn’t go well, and Action items — give everyone a clear place to celebrate, name problems, and leave with owners. If you want a free online board that matches the format on a Scrum wall, start here. No extra metaphor. Just a structure that finishes in under an hour.",
  bestFor: "Regular sprint reviews when you need a simple, reliable format",
  whatHeading: "What is a classic retrospective?",
  whatParagraphs: [
    "A classic retrospective is a three-column agile format. The team looks at the last sprint through two lenses — what worked and what did not — then converts the discussion into action items. Facilitators also call it the “went well / didn’t go well” board or a standard sprint retrospective template.",
    "The power is the constraint. Everyone writes into the same three buckets, so the session stays comparable from sprint to sprint. New teammates recognize the columns immediately. Remote participants can add cards at the same time instead of waiting for a whiteboard marker.",
    "SprintsPlans loads those columns for you. Share a link, write in real time, vote anonymously, and keep action items on the same board. Participants do not need an account.",
  ],
  whenHeading: "When to use the classic format",
  whenIntro:
    "Use this template when the goal is a dependable ceremony, not a novel icebreaker. It earns its keep in these situations:",
  whenItems: [
    "End of a normal sprint, when the team needs a 45–60 minute loop of gather, vote, and act",
    "First retrospectives with a new team or a new facilitator — the columns need almost no explanation",
    "Mixed-seniority groups, where a familiar structure lowers the cost of speaking up",
    "Weeks when you already have a full calendar and cannot afford a 90-minute experimental format",
    "Comparing notes across sprints, because the same three columns make patterns easier to spot",
  ],
  whenSkipHeading: "Choose a different template when",
  whenSkip: [
    "The sprint was emotionally heavy and people need feelings named first — try Mad / Sad / Glad",
    "You want finer process knobs than start-or-stop — Starfish and 4Ls add More, Less, Learned, and Longed For",
    "The team is bored of the same three columns and needs a visual metaphor — Sailboat or Starfish will feel fresher",
  ],
  columnsHeading: "The three columns",
  columnsIntro:
    "Keep prompts visible during the Write phase. Vague columns produce vague cards. These are the questions we recommend on a classic board.",
  columns: [
    {
      title: "What went well",
      emoji: "✅",
      color: "green",
      description:
        "Wins worth repeating. Call out collaboration, delivery, tooling, and habits that made the sprint easier — not only the heroics.",
      sampleNotes: [
        "Pairing unblocked the API redesign",
        "Zero-downtime production deploy",
      ],
    },
    {
      title: "What didn't go well",
      emoji: "❌",
      color: "red",
      description:
        "Friction, surprises, and waste. Write observations, not accusations. “Staging failed twice on Thursday” is more useful than “QA is slow.”",
      sampleNotes: [
        "Scope changed mid-sprint again",
        "Staging CI was unstable",
      ],
    },
    {
      title: "Action items",
      emoji: "🎯",
      color: "blue",
      description:
        "Changes small enough to finish next sprint. Each card should name an owner and a check-in date before the board closes.",
      sampleNotes: [
        "Add a mid-sprint scope checkpoint",
        "Stabilize staging pipeline",
      ],
    },
  ],
  tipsHeading: "Practical tips for a better classic retro",
  tips: [
    {
      title: "Write into all three columns",
      body: "Teams often dump complaints into “What didn’t go well” and skip the rest. Ask everyone to add at least one card to What went well and one draft action before voting. Balance keeps the retro from becoming a vent session.",
    },
    {
      title: "Vote before you discuss",
      body: "Anonymous votes surface what the whole room cares about, not what the loudest person raises first. Time-box discussion to the top-voted cards. Parking-lot the rest so you still end on time.",
    },
    {
      title: "Make actions smaller than the pain",
      body: "“Fix communication” is not an action item. “Publish a written decision after every scope change” is. If a card still looks like a theme after discussion, split it until someone can finish it in one sprint.",
    },
    {
      title: "Bring last sprint’s actions back",
      body: "Open by reading the previous action items out loud. Mark done, blocked, or dropped. Closing the loop is how a classic retrospective stays useful instead of becoming theater.",
    },
  ],
  howHeading: "How to run a classic retro online",
  howSteps: [
    "Create a board with the classic template and paste the link into the calendar invite. Participants join without signing up.",
    "Spend 8–12 minutes in Write. Ask people to add cards across all three columns, then group duplicates.",
    "Vote on the most important topics. Discuss the top items and convert them into action cards with owners.",
    "Screenshot or export the board. Reopen it next sprint and start by reviewing those actions.",
  ],
  faqs: [
    {
      question: "Is the classic template the same as a sprint retrospective?",
      answer:
        "It is the most common sprint retrospective template: What went well, What didn’t go well, and Action items. You can run it at the end of every sprint, or after a project milestone if you do not work in Scrum.",
    },
    {
      question: "Do teammates need an account to join?",
      answer:
        "No. The facilitator creates the board; everyone else opens the link and adds cards. Sign-up is optional if you want to keep a history of boards you host.",
    },
    {
      question: "How long should a classic retrospective take?",
      answer:
        "Plan 45–60 minutes for a two-week sprint. Use about 10 minutes to write, 10 to group and vote, 25 to discuss, and 10 to lock action items. Cut discussion, not the write-up, if you are short on time.",
    },
    {
      question: "Can we add or rename columns later?",
      answer:
        "Yes. Start from the classic layout, then rename columns, change colors, or switch to another template if the team wants a different shape next time.",
    },
  ],
  relatedSlugs: ["start-stop-continue", "4ls", "starfish"],
  ctaHeading: "Use the classic template free",
  ctaBody:
    "Create a three-column board in seconds. Share the link, collect feedback in real time, and leave with action items — no credit card, no participant sign-up.",
};
