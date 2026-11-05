import type { TemplatePageContent } from "./types";

export const fourLsPage: TemplatePageContent = {
  slug: "4ls",
  name: "4Ls Retrospective",
  badge: "Learning-focused",
  h1Lead: "4Ls",
  h1Accent: "Retrospective",
  seoTitle: "4Ls Retrospective Template",
  metaDescription:
    "Run a 4Ls retrospective online: Liked, Learned, Lacked, and Longed For. Free four-column board for agile teams — no sign-up required.",
  ogTitle: "4Ls Retrospective Template — SprintsPlans",
  ogDescription:
    "Liked, Learned, Lacked, Longed For — a deeper 4Ls retrospective format. Free real-time board for learning-focused teams.",
  intro:
    "The 4Ls retrospective asks the team to look past good-versus-bad. Four columns — Liked, Learned, Lacked, and Longed For — separate enjoyment, insight, gaps, and wishes. That split is why facilitators reach for a 4Ls retrospective when a classic board keeps producing the same two piles of praise and complaints. The format still ends in action. It just gathers richer raw material first.",
  bestFor: "Sprints where learning and gaps matter as much as delivery",
  whatHeading: "What is the 4Ls retrospective?",
  whatParagraphs: [
    "4Ls stands for Liked, Learned, Lacked, and Longed For. Each column is a different prompt, so a single event can land in more than one place. A painful outage might be Lacked (we lacked a runbook) and Learned (we learned the failover path) without forcing the team to call the whole week a failure.",
    "Compared with Start / Stop / Continue, 4Ls is less about immediate behavior change and more about sense-making. Compared with Mad / Sad / Glad, it is less about feelings and more about practice: what we enjoyed, what we figured out, what was missing, and what we still want.",
    "On SprintsPlans the four columns are ready to use. Everyone adds cards at once, votes on the themes that matter, and turns the Longed For list into experiments for the next sprint.",
  ],
  whenHeading: "When to use 4Ls",
  whenIntro: "Pick 4Ls when the team needs a wider lens than went-well / didn’t:",
  whenItems: [
    "After a spike, migration, or onboarding-heavy sprint where “what did we learn?” is the real question",
    "When classic retros keep repeating the same Went well / Didn’t cards with no new insight",
    "With teams that include juniors or new hires — Learned and Longed For give them a safe, useful voice",
    "At a quarter or release boundary, when you want a richer snapshot than a single good/bad split",
    "When psychological safety is decent and people can talk about gaps without the room going silent",
  ],
  whenSkipHeading: "Choose a different template when",
  whenSkip: [
    "You have 30 minutes and need a faster three-column pass — use Classic or Start / Stop / Continue",
    "The room is tense and feelings need a home first — Mad / Sad / Glad is more direct",
    "You want a visual process map rather than four lists — Starfish and Sailboat are built for that",
  ],
  columnsHeading: "The four L columns",
  columnsIntro:
    "Read the four prompts out loud before writing starts. People often mix up Lacked and Longed For until they hear a concrete example.",
  columns: [
    {
      title: "Liked",
      emoji: "💚",
      color: "green",
      description:
        "What felt good to do or receive? Liked is enjoyment and energy — pairing that clicked, a demo that landed, a ritual the team wants to keep.",
      sampleNotes: [
        "Design critique stayed kind and specific",
        "Friday demo had real users in the room",
      ],
    },
    {
      title: "Learned",
      emoji: "📘",
      color: "blue",
      description:
        "New knowledge, even if it came from a miss. Learned captures insights: a library quirk, a customer workaround, a process that finally made sense.",
      sampleNotes: [
        "Feature flags saved the broken rollout",
        "Support tickets cluster on empty states",
      ],
    },
    {
      title: "Lacked",
      emoji: "🔴",
      color: "red",
      description:
        "What was missing that the team needed? Lacked is a gap in time, skill, tooling, or clarity — not a personal failing.",
      sampleNotes: [
        "No staging data that looks like production",
        "Unclear owner for the billing bugs",
      ],
    },
    {
      title: "Longed for",
      emoji: "💜",
      color: "purple",
      description:
        "Wishes and experiments. Longed For is the future tense: a practice, tool, or working agreement the team wants to try next.",
      sampleNotes: [
        "A written definition of ready",
        "One pairing block on the calendar",
      ],
    },
  ],
  tipsHeading: "Practical tips for facilitating 4Ls",
  tips: [
    {
      title: "Give an example for Lacked vs Longed For",
      body: "Lacked is “we did not have X this sprint.” Longed For is “I want us to try Y next sprint.” If you skip the distinction, both columns fill with the same wish list and you lose the gap analysis.",
    },
    {
      title: "Protect the Learned column",
      body: "Some teams treat Learned as optional. It is often the highest-signal column after a messy sprint. Ask each person for one Learned card even if they think nothing “went well.”",
    },
    {
      title: "Vote across columns, not inside one",
      body: "Let people spend votes on any card. A Longed For experiment with eight votes beats a Lacked complaint with two. Discussion should follow the dots, not the facilitator’s favorite column.",
    },
    {
      title: "Turn Longed For into one or two experiments",
      body: "Do not convert every purple card into work. Pick one or two, phrase them as a test (“for two sprints we will…”), and put a review date on the next retro agenda.",
    },
  ],
  howHeading: "How to run a 4Ls retro online",
  howSteps: [
    "Create a 4Ls board and share the link. Mention the four prompts in the invite so people can think ahead.",
    "Write for 10–15 minutes. Nudge quiet columns — Learned and Longed For often lag if you do not ask.",
    "Group similar cards, vote, and discuss the top cluster in each column rather than reading every note.",
    "Leave with one experiment from Longed For and one gap from Lacked that has an owner. Export the board for next time.",
  ],
  faqs: [
    {
      question: "What does 4Ls stand for in a retrospective?",
      answer:
        "Liked, Learned, Lacked, and Longed For. The four columns help teams separate enjoyment, insight, missing pieces, and future wishes instead of sorting everything into good or bad.",
    },
    {
      question: "Is 4Ls better than Start / Stop / Continue?",
      answer:
        "It is different, not strictly better. Start / Stop / Continue is faster and more action-shaped. 4Ls is stronger when you care about learning and gaps. Many teams rotate the two formats across sprints.",
    },
    {
      question: "How many people can use a 4Ls board?",
      answer:
        "The online board supports the whole team adding cards at once. For discussion, 4–10 people is comfortable. Larger groups should vote tightly and discuss only the top themes.",
    },
    {
      question: "Can we run 4Ls asynchronously?",
      answer:
        "Yes. Leave the board open for a day so people in other time zones can add Liked, Learned, Lacked, and Longed For cards, then meet once to vote and choose experiments.",
    },
  ],
  relatedSlugs: ["classic", "start-stop-continue", "mad-sad-glad"],
  ctaHeading: "Use the 4Ls template free",
  ctaBody:
    "Open a Liked / Learned / Lacked / Longed For board in seconds. Real-time cards, anonymous votes, and no sign-up for participants.",
};
