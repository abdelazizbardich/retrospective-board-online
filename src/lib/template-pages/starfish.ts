import type { TemplatePageContent } from "./types";

export const starfishPage: TemplatePageContent = {
  slug: "starfish",
  name: "Starfish",
  badge: "Radial format",
  h1Lead: "Starfish",
  h1Accent: "Retrospective",
  seoTitle: "Starfish Retrospective",
  metaDescription:
    "Run a Starfish retrospective online with five colored arms: More, Less, Start, Stop, and Keep. Free radial board — no sign-up required.",
  ogTitle: "Starfish Retrospective Template — SprintsPlans",
  ogDescription:
    "A visual five-arm retrospective format. Gather feedback across More, Less, Start, Stop, and Keep — free and real-time.",
  intro:
    "The Starfish retrospective splits change into five arms: More, Less, Start, Stop, and Keep. That is more precise than a three-column Start / Stop / Continue board, because “less” is not the same as “stop,” and “more” is not the same as “start.” Teams use the radial layout to see whether the sprint was all complaints, all experiments, or actually balanced. On SprintsPlans the starfish is a real five-arm board — not five lists squeezed into a grid.",
  bestFor: "Process-tuning sprints when binary start/stop feels too blunt",
  whatHeading: "What is a Starfish retrospective?",
  whatParagraphs: [
    "Starfish (sometimes called the starfish diagram) is a five-section agile retrospective. Each arm asks a different question about how the team works. More amplifies what is already helping. Less reduces something without deleting it. Start introduces an experiment. Stop removes waste. Keep protects rituals that should not become collateral damage.",
    "The radial shape is part of the method. When all five arms have notes, the team can see imbalance at a glance — a stuffed Stop arm and an empty Keep arm is a warning. Flattening the format into unlabeled columns throws that picture away.",
    "SprintsPlans renders the five arms in color, lets everyone click a wedge to add a note, and then runs the usual vote and discuss phases on the same board.",
  ],
  whenHeading: "When to use Starfish",
  whenIntro: "Starfish is a strong default for healthy teams that want finer process control:",
  whenItems: [
    "Regular sprint retrospectives where both positive and negative feedback should have a home",
    "Teams that outgrew Start / Stop / Continue and need Less and More for smaller dials",
    "Remote or hybrid groups that benefit from a visual center on the shared screen",
    "Facilitators rotating formats to fight fatigue without switching to a loose game",
    "Weeks focused on working agreements, WIP, or meeting load rather than a single incident",
  ],
  whenSkipHeading: "Choose a different template when",
  whenSkip: [
    "The sprint was emotionally heavy — Mad / Sad / Glad or Sailboat may land better before you tune process",
    "The team is brand new and five arms will slow the first ceremony — Classic is enough",
    "You only have 30 minutes; explaining More vs Keep vs Start will crowd out writing",
  ],
  columnsHeading: "Five arms, five questions",
  columnsIntro:
    "Put the five prompts on the invite. During Write, click the arm that matches the type of change — not the type of feeling.",
  columns: [
    {
      title: "More",
      emoji: "📈",
      color: "blue",
      description:
        "What should the team do more of? Celebrate practices worth amplifying — pairing, smaller PRs, earlier reviews — without inventing a brand-new habit.",
      sampleNotes: ["Pair programming on the API", "Shorter pull requests"],
    },
    {
      title: "Less",
      emoji: "📉",
      color: "purple",
      description:
        "What should happen less often? Less is a dimmer switch: fewer ad-hoc meetings, less WIP, less after-hours Slack — not a total ban.",
      sampleNotes: ["Long standups", "Same-day “quick” scope adds"],
    },
    {
      title: "Start",
      emoji: "🚀",
      color: "yellow",
      description:
        "New ideas to try next sprint. Fresh experiments and improvements that do not exist yet — a checklist, a demo slot, a rotation.",
      sampleNotes: ["Weekly customer demos", "A rollback checklist"],
    },
    {
      title: "Stop",
      emoji: "🛑",
      color: "red",
      description:
        "What is not working? Call out blockers and wasteful activities the team is ready to drop, not merely reduce.",
      sampleNotes: ["Scope creep after freeze", "Deploying without notes"],
    },
    {
      title: "Keep",
      emoji: "✅",
      color: "green",
      description:
        "What is going well that must not quietly vanish? Keep locks the rituals and habits that already work.",
      sampleNotes: ["Code review SLA", "Friday bug bash"],
    },
  ],
  tipsHeading: "Practical tips for a Starfish retro",
  tips: [
    {
      title: "Explain Less versus Stop",
      body: "Less means “turn the volume down.” Stop means “end it.” If you skip that line, Stop absorbs every complaint and Less stays empty. Give one example of each before the timer starts.",
    },
    {
      title: "Keep More and Keep from collapsing",
      body: "More is investment (do this more often). Keep is protection (do not lose this). A weekly demo you want to hold steady belongs in Keep. Pairing you want to double belongs in More.",
    },
    {
      title: "Look at empty arms",
      body: "An empty Keep arm means the team only showed up to criticize. An empty Start arm means nobody has energy for experiments. Name the empty arm out loud — it is data.",
    },
    {
      title: "Still leave with owners",
      body: "Five arms can produce too many themes. After votes, pick one More or Start and one Less or Stop. Write owners on those cards so the pretty diagram becomes next sprint’s work.",
    },
  ],
  howHeading: "How to run a Starfish retro",
  howSteps: [
    "Create a board with the Starfish template and share the link with your team. No participant sign-up.",
    "During Write, click each arm to add sticky notes — More, Less, Start, Stop, Keep. Aim for cards on every arm.",
    "Organize similar cards, vote on the most important topics, then discuss the top items.",
    "Capture action items with owners and export or reopen the board when you are done.",
  ],
  featuresHeading: "Built for visual retros",
  featuresIntro:
    "More than a column layout — the Starfish board is designed around the radial format from the ground up.",
  features: [
    {
      title: "Radial starfish layout",
      description: "Five arms radiate from the center — a visual format teams instantly recognize.",
    },
    {
      title: "Color-coded sections",
      description: "Each arm has its own color so feedback is easy to scan at a glance.",
    },
    {
      title: "Click to add notes",
      description: "Tap any section to open a floating note. No hunting for add buttons.",
    },
    {
      title: "Real-time collaboration",
      description: "Everyone adds cards simultaneously. Updates sync live across the room.",
    },
    {
      title: "Vote and discuss",
      description: "Move through Write, Organize, Vote, and Discuss phases like any retro.",
    },
    {
      title: "Fully customizable",
      description: "Rename sections, change colors, add arms, or switch templates anytime.",
    },
  ],
  faqs: [
    {
      question: "What are the five arms of a Starfish retrospective?",
      answer:
        "More, Less, Start, Stop, and Keep. More amplifies existing good practice, Less reduces without eliminating, Start adds something new, Stop removes waste, and Keep protects what already works.",
    },
    {
      question: "How is Starfish different from Start / Stop / Continue?",
      answer:
        "Starfish adds More, Less, and Keep. You can turn a dial instead of flipping a switch — useful when the team is not ready to kill a meeting but is ready to shorten it, or when a habit should grow rather than be invented from scratch.",
    },
    {
      question: "Does the radial board work on a laptop?",
      answer:
        "Yes. Each arm is clickable, notes stay inside their wedge, and the same link works for the person projecting in a meeting room and the people joining remotely.",
    },
    {
      question: "Is the Starfish template free?",
      answer:
        "Yes. Create a board from the Starfish template at no cost. Participants join from the link without making an account.",
    },
  ],
  relatedSlugs: ["start-stop-continue", "sailboat", "4ls"],
  ctaHeading: "Try the Starfish template today",
  ctaBody:
    "Give your team a fresh way to reflect. Create a free radial board and run your next retrospective in minutes.",
};
