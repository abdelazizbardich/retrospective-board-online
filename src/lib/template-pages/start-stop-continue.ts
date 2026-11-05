import type { TemplatePageContent } from "./types";

export const startStopContinuePage: TemplatePageContent = {
  slug: "start-stop-continue",
  name: "Start / Stop / Continue",
  badge: "Action-oriented",
  h1Lead: "Start, Stop,",
  h1Accent: "Continue",
  seoTitle: "Start Stop Continue Template",
  metaDescription:
    "Use a Start Stop Continue template online. Capture what to start, stop, and keep doing — free real-time retrospective board, no sign-up required.",
  ogTitle: "Start Stop Continue Template — SprintsPlans",
  ogDescription:
    "A practical Start / Stop / Continue retrospective. Three columns for concrete changes. Free, real-time, no participant sign-up.",
  intro:
    "A Start Stop Continue template is the fastest way to turn a retro into behavior change. Three columns ask for new experiments, wasted habits, and practices worth protecting. There is no “how did we feel” column and no island on the horizon — only what the team will do more of, less of, or the same. That is why it is the format new facilitators steal first, and why tired teams come back to it when every other board feels like theater.",
  bestFor: "Short retros that must produce concrete process changes",
  whatHeading: "What is Start / Stop / Continue?",
  whatParagraphs: [
    "Start / Stop / Continue is a three-column retrospective. Start collects experiments the team has not tried yet. Stop names activities that cost more than they return. Continue holds the habits that already work so they do not disappear while you fix everything else.",
    "The template is popular because every card is already shaped like a decision. “Start pairing on Fridays” is clearer than “collaboration was uneven.” You still need discussion and owners. You do not need a translator between sticky notes and next sprint’s working agreements.",
    "SprintsPlans gives you the three columns, live sync, and anonymous voting. Create the board, share the link, and run the session in the same Write → Organize → Vote → Discuss flow as every other template.",
  ],
  whenHeading: "When to use a Start Stop Continue template",
  whenIntro: "This format is a default for process-heavy sprints and first-time groups:",
  whenItems: [
    "First retrospectives, when the team needs obvious prompts and a finish line of “what changes Monday”",
    "Teams that already talk well about feelings and now need a tighter action list",
    "Sprints stuffed with meetings, handoffs, or WIP — Stop cards tend to write themselves",
    "Facilitators who have 30–45 minutes, not a full afternoon",
    "Follow-ups after a looser format (Sailboat, Mad / Sad / Glad) when it is time to convert insight into habits",
  ],
  whenSkipHeading: "Choose a different template when",
  whenSkip: [
    "People are angry or deflated and cannot jump to actions yet — run Mad / Sad / Glad first",
    "You need “less of” without a hard stop, or “more of” without a brand-new start — Starfish adds those arms",
    "Learning is the theme of the sprint — 4Ls makes Learned and Longed For first-class",
  ],
  columnsHeading: "The three columns",
  columnsIntro:
    "Anchor each column with a verb and an example. “Stop being slow” is not a card. “Stop adding tickets mid-sprint without a swap” is.",
  columns: [
    {
      title: "Start",
      emoji: "🚀",
      color: "green",
      description:
        "New behaviors, tools, or rituals to try next sprint. Prefer experiments with a time box over permanent policy on the first attempt.",
      sampleNotes: [
        "Start a 15-minute mid-sprint check",
        "Start posting PR context in Slack",
      ],
    },
    {
      title: "Stop",
      emoji: "🛑",
      color: "red",
      description:
        "Work, meetings, or habits that should end. Stop is for genuine waste — not for venting about people. Phrase cards as activities.",
      sampleNotes: [
        "Stop silent re-prioritization in chat",
        "Stop deploying without a rollback note",
      ],
    },
    {
      title: "Continue",
      emoji: "➡️",
      color: "blue",
      description:
        "Practices that already help. Continue exists so the team does not “improve” by accidentally dropping what works.",
      sampleNotes: [
        "Continue the Thursday bug bash",
        "Continue pairing on on-call handoff",
      ],
    },
  ],
  tipsHeading: "Practical tips for Start / Stop / Continue",
  tips: [
    {
      title: "Limit how many Starts you keep",
      body: "A board full of Start cards is a second backlog. After voting, keep one or two Starts. Everything else stays on the board as a parking lot, not as a promise.",
    },
    {
      title: "Make Stop reversible",
      body: "Frame Stop as a trial when the room is unsure: “Stop daily status mail for two sprints, then review.” Hard stops that scare half the team will be ignored by Monday.",
    },
    {
      title: "Do not skip Continue",
      body: "If Continue is empty, the retro will feel like a complaint meeting. Ask each person for one Continue card before you open discussion. Protecting good habits is part of the work.",
    },
    {
      title: "Assign owners in the room",
      body: "A Start without an owner is a wish. Before you close, every kept card needs a name and a date you will check it. Put those on the Action-shaped notes or in the board title for next time.",
    },
  ],
  howHeading: "How to run Start / Stop / Continue online",
  howSteps: [
    "Create a Start / Stop / Continue board and share the link. Tell people the time box up front (30–45 minutes is enough).",
    "Write silently. Require at least one card in each column so Continue does not get ignored.",
    "Group duplicates, vote, and discuss only the top-voted Starts and Stops. Read Continue aloud so wins are heard.",
    "Convert the kept cards into owners and dates. Reopen the board next sprint and start by checking those commitments.",
  ],
  faqs: [
    {
      question: "What is a Start Stop Continue template?",
      answer:
        "It is a three-column retrospective: Start (new things to try), Stop (things to drop), and Continue (things to keep). Teams use it to leave a sprint review with concrete process changes instead of a pile of observations.",
    },
    {
      question: "How is it different from a classic went-well retro?",
      answer:
        "Classic columns sort the past into good, bad, and actions. Start / Stop / Continue sorts the future into new, dropped, and kept behaviors. Many teams use classic when they need to unpack the sprint, then switch to this template when they already know the story and want decisions.",
    },
    {
      question: "Can remote teams use Start / Stop / Continue?",
      answer:
        "Yes. An online board lets everyone add cards at the same time, vote anonymously, and skip the “who has the marker” problem. Share one link; no participant account is required.",
    },
    {
      question: "How many action items should we leave with?",
      answer:
        "One or two Starts plus one Stop is plenty for a two-week sprint. Continue cards are reminders, not extra work. If you leave with eight changes, you will do none of them well.",
    },
  ],
  relatedSlugs: ["classic", "starfish", "4ls"],
  ctaHeading: "Use this Start Stop Continue template free",
  ctaBody:
    "Spin up a three-column board, share the link, and leave with a short list of changes. Free for the whole team — participants never have to sign up.",
};
