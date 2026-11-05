import type { ComparePageContent } from "./types";

export const miroPage: ComparePageContent = {
  slug: "miro",
  competitorName: "Miro",
  competitorUrl: "https://miro.com",
  competitorPricingUrl: "https://miro.com/pricing/",
  badge: "Free board vs whiteboard",
  h1Lead: "Miro alternative",
  h1Accent: "for retrospectives",
  seoTitle: "Miro Retro Alternative",
  metaDescription:
    "Miro alternative for retrospectives — and a lighter FigJam option. Compare whiteboard retros vs a free SprintsPlans board with votes and templates.",
  ogTitle: "Miro Alternative for Retrospectives — SprintsPlans",
  ogDescription:
    "Skip the infinite whiteboard. SprintsPlans is a free retrospective board with templates and anonymous votes — built for the retro, not for every workshop.",
  intro:
    "Miro (and FigJam) can host a retrospective the same way a wall can: sticky notes, frames, a template from the gallery. That is the right tool for workshops, maps, and design critiques. It is a heavy tool for a 45-minute sprint retro. If you searched for a Miro alternative for retrospectives — or you are tired of herding stickies in FigJam — SprintsPlans is a free online retrospective board with columns, votes, and a share link.",
  bestFor: "Teams running retros on Miro or FigJam who want a purpose-built board instead of another whiteboard",
  pricingSnapshot: "Miro Free: 3 editable boards. Starter $8/member/mo yearly. FigJam free: 3 files.",
  whoHeading: "Who each tool is for",
  whoCompetitorHeading: "Keep Miro or FigJam when",
  whoCompetitor: [
    "The retro is one frame on a board you already use for planning, mapping, or design",
    "You need infinite canvas, diagrams, and 250+ integrations more than a vote phase",
    "The whole company already pays for Miro members or Figma Collab seats",
    "Facilitators want AI clustering of freeform stickies as part of a workshop, not a sprint ceremony",
  ],
  whoUsHeading: "Choose SprintsPlans when",
  whoUs: [
    "The meeting is a sprint retrospective, not a general workshop",
    "You want anonymous votes and a write → group → vote flow without building it from widgets",
    "Miro’s three editable boards (or FigJam’s three files) are already used by real work",
    "You do not want to pay per member for a column board",
  ],
  tableHeading: "Miro / FigJam vs a retro board",
  tableIntro:
    "This is not “which whiteboard is prettier.” It is whether a retrospective should live on an infinite canvas or in software that already knows the phases.",
  rows: [
    {
      label: "What it is",
      competitor: "General whiteboard (Miro) or Figma whiteboard (FigJam)",
      sprintsplans: "Purpose-built retrospective board",
    },
    {
      label: "Free plan",
      competitor: "Miro: 3 editable boards. FigJam Starter: 3 FigJam files",
      sprintsplans: "Create a retro board and share a link",
    },
    {
      label: "Paid starting price",
      competitor: "Miro Starter $8/member/mo yearly. FigJam Collab from $3/user/mo on Figma paid plans",
      sprintsplans: "Free",
    },
    {
      label: "Retro structure",
      competitor: "Template of stickies — you run the ceremony yourself",
      sprintsplans: "Templates plus write / group / vote / discuss phases",
    },
    {
      label: "Anonymous voting",
      competitor: "Voting is a whiteboard extra (often paid / limited on free)",
      sprintsplans: "Anonymous cards and votes are the retro flow",
    },
    {
      label: "Participant accounts",
      competitor: "Guests and permissions depend on plan; free Miro boards are team-visible",
      sprintsplans: "Open the link. No account required to add cards",
    },
    {
      label: "Canvas vs columns",
      competitor: "Infinite canvas — easy to wander, great for mixed workshops",
      sprintsplans: "Columns or illustrated layouts (Sailboat, Starfish) aimed at one retro",
    },
    {
      label: "When it shines",
      competitor: "Cross-functional workshops, diagrams, product discovery",
      sprintsplans: "The same 45–60 minutes at the end of every sprint",
    },
  ],
  pricingHeading: "Whiteboards charge for seats. Retros need a board.",
  pricingParagraphs: [
    "Miro’s public pricing (November 2026) gives a Free plan with three editable boards and unlimited members; older boards stop being editable. Starter is $8 per member per month billed yearly. FigJam is included with Figma: the free Starter plan caps FigJam files (three files is the figure commonly published), and paid Collab seats start around $3 per user per month on Figma Professional. Confirm both on the vendor pages — whiteboard SKUs move.",
    "Per-seat pricing is rational for a canvas everyone lives in. It is a bad fit for a Scrum Master who only needs a retro board twice a month. You also spend facilitation minutes on zooming, frames, and “please don’t delete the template.”",
    "SprintsPlans will not replace Miro for journey maps. It will replace the retro frame you rebuild every sprint. Templates load Classic, 4Ls, Start / Stop / Continue, Mad / Sad / Glad, Sailboat, or Starfish. People write on cards, vote anonymously, and leave with owners — without a Collab seat.",
  ],
  pickUsHeading: "Pick SprintsPlans if",
  pickUs: [
    "You want a Miro alternative for retrospectives, not a second infinite canvas",
    "FigJam stickies keep drifting and nobody remembers to vote",
    "The free whiteboard cap is already spent on real design or planning boards",
    "Anonymous voting should be a phase, not a plugin you hope the plan includes",
  ],
  pickThemHeading: "Stay on Miro or FigJam if",
  pickThem: [
    "The retro is embedded in a larger workshop on the same board",
    "You already pay for the seats and the template gallery is “good enough”",
    "Diagrams, sticky clustering, and cross-team canvases are the main job",
    "IT has standardized on Miro or Figma and will not add another URL",
  ],
  switchHeading: "Move the retro off the canvas",
  switchSteps: [
    "Pick a SprintsPlans template that matches the Miro/FigJam frame you used — Classic for three columns, Sailboat or Starfish if you liked the picture.",
    "Create the board and paste the link into the call chat. Participants join without a Miro guest dance.",
    "Write, vote anonymously, assign owners. Keep Miro for the workshop that actually needs a canvas.",
  ],
  faqs: [
    {
      question: "Can we run a retrospective in Miro or FigJam?",
      answer:
        "Yes. Both have retrospective templates. You supply the facilitation: timer, anonymity, voting rules, and where actions go afterward. SprintsPlans bakes those into a board so the retro is not another workshop frame.",
    },
    {
      question: "Is SprintsPlans a Miro alternative?",
      answer:
        "For retrospectives, yes. For product whiteboarding, no. Use SprintsPlans for the sprint ceremony and keep Miro or FigJam for maps, flows, and design critiques.",
    },
    {
      question: "What about FigJam specifically?",
      answer:
        "FigJam is the lighter whiteboard inside Figma. It has the same core mismatch: a canvas trying to be a retro. If your team already lives in Figma, FigJam is convenient. If you only needed a retro, a free dedicated board is less ceremony.",
    },
    {
      question: "Do we lose sticky-note freedom?",
      answer:
        "You trade freeform stickies for cards in columns (or Sailboat / Starfish sections). That constraint is the point: everyone writes in the same buckets, then votes. If you need an unbounded canvas, keep the whiteboard.",
    },
  ],
  relatedSlugs: ["easyretro", "parabol", "teamretro"],
  relatedTemplates: ["classic", "sailboat", "starfish"],
  ctaHeading: "A retro board, not another canvas",
  ctaBody:
    "Create a free SprintsPlans board, share the link, and vote anonymously. Leave Miro and FigJam for the work that needs a whiteboard.",
  ctaHref: "/create?template=classic",
};
