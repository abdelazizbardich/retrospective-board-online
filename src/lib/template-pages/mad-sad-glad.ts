import type { TemplatePageContent } from "./types";

export const madSadGladPage: TemplatePageContent = {
  slug: "mad-sad-glad",
  name: "Mad / Sad / Glad",
  badge: "Emotion-focused",
  h1Lead: "Mad / Sad /",
  h1Accent: "Glad",
  seoTitle: "Mad Sad Glad Retrospective",
  metaDescription:
    "Run a Mad Sad Glad retrospective online. Surface how the team really feels, then vote and act — free board, no participant sign-up.",
  ogTitle: "Mad Sad Glad Retrospective — SprintsPlans",
  ogDescription:
    "An emotion-focused Mad / Sad / Glad retrospective. Three columns for how the sprint felt. Free and real-time.",
  intro:
    "A Mad Sad Glad retrospective gives feelings a column of their own. Mad holds frustration and anger. Sad holds loss, disappointment, and fatigue. Glad holds relief, pride, and gratitude. Process templates skip that layer and jump to Start / Stop. When a sprint has been tense, skipping it is how you get polite cards and no honesty. This format slows the room down just long enough to say how the work actually felt — then you still vote and pick actions.",
  bestFor: "Sprints with tension, change, or a team that has gone quiet",
  whatHeading: "What is a Mad Sad Glad retrospective?",
  whatParagraphs: [
    "Mad / Sad / Glad is a three-column, emotion-first retro. Instead of asking what went well, it asks how people felt about the sprint. The same event can appear in more than one column: a missed launch can be Mad (the last-minute scope dump) and Sad (the weekend that disappeared) and still leave a Glad card (the way the team covered for each other).",
    "The format comes from the idea that unsaid emotion leaks into the next sprint as sarcasm, silence, or heroics. Naming it in a structured board is safer than hoping a “professional” classic retro will magically surface it.",
    "On SprintsPlans the three columns are ready, color-coded, and shared in real time. Anonymous voting helps quieter people rank what actually needs airtime once the cards are up.",
  ],
  whenHeading: "When to use Mad / Sad / Glad",
  whenIntro: "Reach for this template when the weather in the team is the topic:",
  whenItems: [
    "After conflict, a painful incident, or a re-org — people need a place for heat before they will problem-solve",
    "When the last two classic retros were dry: few cards, lots of “it was fine,” no energy",
    "During crunch or on-call heavy sprints, where Glad cards keep the room from only cataloguing damage",
    "With teams that already trust each other enough to write feelings without turning the meeting into therapy",
    "As a one-off reset, then return to Classic or Start / Stop / Continue once the air is clearer",
  ],
  whenSkipHeading: "Choose a different template when",
  whenSkip: [
    "Psychological safety is low and emotion columns will freeze the room — start with Classic and a prime directive",
    "You only have 25 minutes and need decisions, not processing — Start / Stop / Continue is tighter",
    "The issue is a specific production incident that needs a timeline and causes — use a post-incident format, not a mood board",
  ],
  columnsHeading: "The three columns",
  columnsIntro:
    "Define the words. Mad is not “slightly annoyed.” Sad is not “the build failed.” Glad is not “we shipped.” Give one example each so the board fills with real texture.",
  columns: [
    {
      title: "Mad",
      emoji: "😡",
      color: "red",
      description:
        "Anger, frustration, and injustice. Mad cards should name situations and systems (“requirements flipped after QA”) rather than people.",
      sampleNotes: [
        "Scope landed on Friday at 4pm",
        "We were blamed for a vendor outage",
      ],
    },
    {
      title: "Sad",
      emoji: "😢",
      color: "blue",
      description:
        "Disappointment, loss, and tiredness. Sad often holds the human cost: dropped ideas, missed family time, a teammate leaving.",
      sampleNotes: [
        "Cut the accessibility pass we promised",
        "Two nights of incident load in a row",
      ],
    },
    {
      title: "Glad",
      emoji: "😊",
      color: "green",
      description:
        "Pride, relief, and thanks. Glad is required, not optional — it keeps the retro from becoming a pile-on and shows what to protect.",
      sampleNotes: [
        "Support covered Slack while we recovered",
        "The rollback actually worked",
      ],
    },
  ],
  tipsHeading: "Practical tips for Mad / Sad / Glad",
  tips: [
    {
      title: "Set the prime directive out loud",
      body: "Remind the team that everyone did the best they could with what they knew. Emotion columns without that frame can slide into blame. The board is for shared conditions, not a courtroom.",
    },
    {
      title: "Keep Glad in the write-up",
      body: "If Glad is empty after five minutes, pause and ask for one card each. A retro that only catalogues Mad and Sad leaves people worse than when they arrived — and no energy to act.",
    },
    {
      title: "Translate feelings into systems",
      body: "During discussion, ask “what made that feeling likely?” A Mad card about a late request should end as a working agreement or an owner, not as a personality review.",
    },
    {
      title: "Time-box the vent, then move",
      body: "Allow heat. Do not live there. After the top-voted cards have been heard, switch explicitly: “We are picking one change.” If you need more process detail, run Start / Stop / Continue next sprint.",
    },
  ],
  howHeading: "How to run Mad / Sad / Glad online",
  howSteps: [
    "Create the board and share the link. In the invite, note that columns are Mad, Sad, and Glad so nobody is surprised.",
    "Read the prime directive. Write silently for 8–12 minutes. Private browsers and anonymous cards help if the sprint was tense.",
    "Group similar feelings, vote, and let the authors of top cards talk first. Facilitators should paraphrase, not debate.",
    "Pick one or two changes that would reduce Mad/Sad or grow Glad. Put owners on the board before you leave.",
  ],
  faqs: [
    {
      question: "What is a Mad Sad Glad retrospective?",
      answer:
        "It is an emotion-focused agile retrospective with three columns: Mad (frustrated), Sad (disappointed or drained), and Glad (grateful or proud). Teams use it when how the sprint felt is as important as what got done.",
    },
    {
      question: "Is Mad / Sad / Glad too “soft” for engineering teams?",
      answer:
        "Only if you stop at the feelings. Used well, the columns reveal load, unfair process, and hidden wins that a went-well board misses. The last ten minutes should still produce owners and a check-in date.",
    },
    {
      question: "Should names be on the cards?",
      answer:
        "Prefer describing events, not people. “The release window moved twice” belongs on the board. “Alex keeps changing the date” does not. Anonymous voting on SprintsPlans also reduces pressure to perform.",
    },
    {
      question: "How often should we run this format?",
      answer:
        "Use it when the temperature is high, not every week by default. Rotating back to Classic or Start / Stop / Continue afterwards keeps the emotion format special — and keeps regular sprints action-oriented.",
    },
  ],
  relatedSlugs: ["classic", "sailboat", "start-stop-continue"],
  ctaHeading: "Use Mad / Sad / Glad free",
  ctaBody:
    "Open a three-column emotion board, share one link, and let the team write at the same time. Free for everyone — no participant account.",
};
