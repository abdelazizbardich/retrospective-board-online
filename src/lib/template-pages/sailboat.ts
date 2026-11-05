import type { TemplatePageContent } from "./types";

export const sailboatPage: TemplatePageContent = {
  slug: "sailboat",
  name: "Sailboat Retrospective",
  badge: "Visual metaphor",
  h1Lead: "Sailboat",
  h1Accent: "Retrospective",
  seoTitle: "Sailboat Retrospective",
  metaDescription:
    "Run a sailboat retrospective online: wind, sun, anchors, reefs, and the sprint goal. Free illustrated board — no sign-up required.",
  ogTitle: "Sailboat Retrospective Template — SprintsPlans",
  ogDescription:
    "Sail toward your sprint goal. Capture wind, sunshine, anchors, and reefs on a free real-time sailboat retrospective board.",
  intro:
    "A sailboat retrospective turns the sprint into a picture: the boat is the team, the island is the goal, wind is what pushes you, sun is what felt good, anchors drag beneath you, and reefs are risks ahead. People who are tired of three identical columns often write more on a sailboat because the metaphor does the prompting. On SprintsPlans the board is illustrated, not a set of unlabeled lists — so remote teammates see the same journey, not five generic swimlanes.",
  bestFor: "Teams that need a visual, goal-oriented retro after a long stretch of column boards",
  whatHeading: "What is a sailboat retrospective?",
  whatParagraphs: [
    "The sailboat (or speedboat) retrospective is a metaphorical agile format. Instead of asking what went well, you place notes on a seascape. Wind fills the sails — helpers and accelerators. The sun is morale and moments worth keeping. Anchors are drag you are already paying. Reefs are hazards you can still avoid. The island (sprint goal) is where the boat is headed, so discussion stays tied to an outcome rather than a vibe.",
    "That goal column is the difference between a cute drawing and a useful ceremony. Without an island, wind and anchors become another good/bad split. With it, every card answers “relative to where we said we would go.”",
    "The SprintsPlans sailboat layout is built for the metaphor: color-coded regions on an illustrated canvas, click-to-add notes, live updates, then the same vote and discuss phases as a column board.",
  ],
  whenHeading: "When to use the sailboat format",
  whenIntro: "Sailboat shines when the team needs both a picture and a destination:",
  whenItems: [
    "Retrospective fatigue after months of Classic or Start / Stop / Continue",
    "Kicking off a new quarter or a milestone, when naming the island (goal) is part of the work",
    "Sprints where risks are piling up and you want a dedicated Reefs area before they become incidents",
    "Workshops with stakeholders who will engage more with a story than with scrum jargon",
    "Hybrid rooms: put the illustrated board on the shared screen so in-office and remote people point at the same map",
  ],
  whenSkipHeading: "Choose a different template when",
  whenSkip: [
    "The team has never retrospected and needs the simplest possible prompts — start with Classic",
    "You have 25 minutes; explaining wind vs anchors vs reefs will eat the write-up",
    "Feelings are the whole topic and a seascape will feel evasive — Mad / Sad / Glad is more direct",
  ],
  columnsHeading: "The five parts of the sailboat",
  columnsIntro:
    "Walk the picture clockwise before anyone writes. One sentence per region is enough. Then leave the labels on screen.",
  columns: [
    {
      title: "Wind",
      emoji: "💨",
      color: "green",
      description:
        "What pushed the boat forward? Wind is force you want more of: a clear owner, a library that saved days, a stakeholder who unblocked a decision.",
      sampleNotes: [
        "Design tokens landed before the UI sprint",
        "On-call rotation actually rotated",
      ],
    },
    {
      title: "Sun",
      emoji: "☀️",
      color: "yellow",
      description:
        "What made the crew feel good? Sun is morale, not velocity — kudos, a calm demo, a week without heroics.",
      sampleNotes: [
        "Customer quote in the demo",
        "No weekend pages for once",
      ],
    },
    {
      title: "Anchor",
      emoji: "⚓",
      color: "blue",
      description:
        "What is already dragging under the hull? Anchors are current drag: flaky tests, unclear specs, a tool everyone works around.",
      sampleNotes: [
        "Review queue sits for two days",
        "Staging data resets overnight",
      ],
    },
    {
      title: "Reef",
      emoji: "🪸",
      color: "gray",
      description:
        "What could wreck the next stretch? Reefs are future risks — a dependency, a deadline, a single point of failure still ahead of you.",
      sampleNotes: [
        "Vendor contract ends mid-sprint",
        "Only one person knows billing",
      ],
    },
    {
      title: "Sprint Goal",
      emoji: "🏝️",
      color: "purple",
      description:
        "The island. Write the actual goal for this sprint or the next, then judge wind and anchors against it so the picture has a destination.",
      sampleNotes: [
        "Checkout live for 10% of traffic",
        "On-call runbook v1 published",
      ],
    },
  ],
  tipsHeading: "Practical tips for a sailboat retro",
  tips: [
    {
      title: "Write the island first",
      body: "If the Sprint Goal region is blank, fill it as a group before the timer starts. Wind and anchors only make sense relative to a destination. A fuzzy island produces pretty, unfocused notes.",
    },
    {
      title: "Keep anchors and reefs distinct",
      body: "Anchors are paying you now. Reefs might pay you later. “Flaky CI” is an anchor. “The only DBA is on leave in two sprints” is a reef. Mixing them hides which cards need a fix this week versus a watchlist.",
    },
    {
      title: "Vote on drag and risk, not only on wind",
      body: "It feels nicer to discuss sun and wind. Force a share of votes onto anchors and reefs or you will leave with celebrations and the same drag next week.",
    },
    {
      title: "Translate the picture into owners",
      body: "A sailboat without action items is a poster. Before you close, pick one anchor to lift and one reef to chart. Put names on those cards the same way you would on a classic board.",
    },
  ],
  howHeading: "How to run a sailboat retrospective online",
  howSteps: [
    "Create a sailboat board and share the link. Put the illustrated canvas on the meeting screen for hybrid teams.",
    "Agree the island (sprint goal) in two minutes. Then write for 10–15 minutes across wind, sun, anchors, and reefs.",
    "Cluster notes inside each region, vote, and discuss the heaviest anchors and the nearest reefs first.",
    "Capture one or two actions with owners. Export or reopen the board next sprint and ask whether those anchors actually lifted.",
  ],
  featuresHeading: "Built as a picture, not five lists",
  featuresIntro:
    "The sailboat template is an illustrated layout. Notes sit on the water and sky so the metaphor stays visible while you work.",
  features: [
    {
      title: "Illustrated seascape",
      description: "Wind, sun, anchors, reefs, and the island are regions on one canvas — easy to read on a shared screen.",
    },
    {
      title: "Click a region to add a note",
      description: "Tap the water, the sky, or the island. You do not hunt for a column header at the top of the page.",
    },
    {
      title: "Same retro flow",
      description: "Write, organize, vote, and discuss still apply. The picture does not replace facilitation — it supports it.",
    },
  ],
  faqs: [
    {
      question: "What is a sailboat retrospective?",
      answer:
        "It is a visual agile retrospective. The team is a boat sailing toward a goal (the island). Wind is what helps, sun is what felt good, anchors are current drag, and reefs are upcoming risks. The picture helps people place notes with more nuance than a good/bad board.",
    },
    {
      question: "Is sailboat the same as a speedboat retro?",
      answer:
        "They are close cousins. Speedboat often uses engines, anchors, rocks, and an island. Our sailboat template uses wind, sun, anchors, reefs, and a sprint goal — the same idea with a slightly warmer set of prompts.",
    },
    {
      question: "Does the illustrated board work for remote teams?",
      answer:
        "Yes. Everyone opens the same link and adds notes on the canvas in real time. For hybrid sessions, share the board on the room screen so people point at regions instead of describing column numbers.",
    },
    {
      question: "What if our sprint had no clear goal?",
      answer:
        "Write that on the island. “No shared goal” is itself a finding. Use five minutes at the start to name an island for next sprint, then fill wind and anchors against that destination.",
    },
  ],
  relatedSlugs: ["starfish", "classic", "mad-sad-glad"],
  ctaHeading: "Use the sailboat template free",
  ctaBody:
    "Open an illustrated sailboat board, share the link, and steer the next sprint with wind, anchors, and a visible goal. Free — no participant sign-up.",
};
