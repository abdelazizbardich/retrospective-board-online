export type PricingFaq = {
  question: string;
  answer: string;
};

export type PricingPageContent = {
  seoTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  h1: string;
  intro: string;
  includedHeading: string;
  includedIntro: string;
  included: { title: string; body: string }[];
  limitsHeading: string;
  limitsIntro: string;
  limits: { title: string; body: string }[];
  notIncludedHeading: string;
  notIncluded: string[];
  whyHeading: string;
  whyIntro: string;
  why: { title: string; body: string }[];
  chooseHeading: string;
  chooseParagraphs: string[];
  faqs: PricingFaq[];
  ctaHeading: string;
  ctaBody: string;
};

export const pricingPage: PricingPageContent = {
  seoTitle: "Free Retrospective Board Pricing",
  metaDescription:
    "SprintsPlans is a free retrospective board: templates, live cards, anonymous votes. No paid plan. See what’s included and create a board.",
  ogTitle: "Free Retrospective Board Pricing — SprintsPlans",
  ogDescription:
    "A free online retrospective board with no paid plan. Templates, real-time cards, and anonymous votes — create a board in seconds.",
  h1: "A free retrospective board. No paid plan.",
  intro:
    "SprintsPlans is a free retrospective board for sprint teams. Retrospective board pricing here is simple because there is nothing to buy: pick a template, share a link, write cards, and vote anonymously. Participants do not sign up. There is no Pro tier hiding the basics.",
  includedHeading: "What’s free on a SprintsPlans board",
  includedIntro:
    "These are product features that exist today — not a catalog of upgrades. Create a board and the same flow is available to every team.",
  included: [
    {
      title: "Create boards without a monthly cap",
      body: "There is no one-board-per-month ceiling in the product. Start this sprint’s retro without deleting last sprint’s board to stay on a free plan.",
    },
    {
      title: "Templates facilitators actually search for",
      body: "Classic, 4Ls, Start / Stop / Continue, Mad / Sad / Glad, Sailboat, and Starfish. You can switch templates on an existing board, or import columns from Excel.",
    },
    {
      title: "Real-time cards, grouping, and phases",
      body: "The team writes, groups similar cards, votes, and discusses in a shared board. A timer and write → organize → vote → discuss phases keep the meeting moving.",
    },
    {
      title: "Anonymous cards and votes",
      body: "Cards can be posted without a name. Votes are anonymous so the loudest person in the call does not set the agenda. Each person gets a default budget of five votes — a facilitation default, not a paid lock.",
    },
    {
      title: "No participant sign-up",
      body: "Share the board link. People join in the browser with a display name. An account is optional, and only useful if you want hosted boards listed under My Boards.",
    },
    {
      title: "Excel export",
      body: "Download the board as an Excel file when you want a copy next to the sprint notes. There is no Jira, Trello, Slack, or Confluence two-way sync.",
    },
  ],
  limitsHeading: "Honest limits (not a paywall)",
  limitsIntro:
    "A free retrospective board still has product rules. None of these unlock with a credit card, because SprintsPlans does not sell plans.",
  limits: [
    {
      title: "Guest boards are not auto-saved to an account",
      body: "You can skip sign-in and still run the retro. The board will not appear under My Boards unless you create it while signed in. Keep the link, or export to Excel.",
    },
    {
      title: "Unused boards may be removed after 90 days",
      body: "Our privacy policy says boards that have not been accessed for more than 90 days may be deleted automatically. Export if you need a lasting file. That is a retention policy, not a paid-history upsell.",
    },
    {
      title: "Later joiners wait for the host",
      body: "The first person in becomes the host. People who join after that wait for host approval so a guessed link does not drop strangers into a live retro.",
    },
    {
      title: "Five votes per person, by default",
      body: "Voting uses a per-person budget (five votes on a new board). It is there so the retro can rank topics, not so we can charge for extra dots.",
    },
  ],
  notIncludedHeading: "What we do not sell — because it is not in the product",
  notIncluded: [
    "Paid plans, seats, trials, or a Pro upgrade. There is no checkout.",
    "SAML SSO, SCIM, or an enterprise admin suite.",
    "AI summaries, team health radars, Sprint Poker, or standups.",
    "Jira two-way sync or Slack / Confluence export. Export is Excel.",
    "A published uptime SLA. The service is provided as-is.",
  ],
  whyHeading: "Why teams pick a free board over paid retro tools",
  whyIntro:
    "Paid tools are often better at SSO, AI recaps, and org-wide reports. They are a poor trade if the job is a 45-minute sprint retrospective every two weeks.",
  why: [
    {
      title: "The ceremony is the product",
      body: "You need columns, live cards, and anonymous votes — not a second whiteboard seat or a facilitation suite you will not open.",
    },
    {
      title: "No trial cliff next sprint",
      body: "Retrium and TeamRetro run a trial, then a per-room or per-team subscription. SprintsPlans does not turn the next retro into a billing task.",
    },
    {
      title: "No one-board-per-month tax",
      body: "EasyRetro’s public free plan is one board a month. Scrum teams retro every sprint. That cap is the usual reason people search for a free EasyRetro alternative.",
    },
    {
      title: "Participants stay out of IT’s way",
      body: "Teammates join from the invite link. They do not create accounts, and they do not need a paid Collab seat to add a sticky note.",
    },
  ],
  chooseHeading: "When a paid tool is still the right call",
  chooseParagraphs: [
    "Stay on the paid product if you need SAML SSO, SOC reports, Jira two-way sync, team health, or one app for standups and estimation. Those are real features. SprintsPlans does not pretend to ship them.",
    "Choose SprintsPlans when retrospective board pricing is the blocker: you want a free online retrospective board this afternoon, not a procurement thread. Compare EasyRetro, Retrium, TeamRetro, Parabol, and Miro on our comparison pages if you are still shopping vendors.",
  ],
  faqs: [
    {
      question: "Is SprintsPlans a free retrospective board?",
      answer:
        "Yes. SprintsPlans is a free online retrospective board. Create a board, share the link, write cards, and vote anonymously. Participants do not need an account. There is no paid plan for those basics.",
    },
    {
      question: "Does SprintsPlans have paid plans or hidden limits?",
      answer:
        "No paid plans exist. There is no Pro checkout. Practical product rules still apply: a default of five votes per person, host approval for later joiners, optional accounts for My Boards, and unused boards may be removed after 90 days of no access as described in the privacy policy.",
    },
    {
      question: "Do teammates need to sign up?",
      answer:
        "No. Paste the board URL into the calendar invite. People join in the browser with a display name. Sign-in is optional for facilitators who want a list of boards they hosted.",
    },
    {
      question: "How does SprintsPlans pricing compare to EasyRetro or Retrium?",
      answer:
        "SprintsPlans has no paid tier for the retro itself. EasyRetro’s free plan is one public board per month, then a paid Team plan. Retrium and TeamRetro use a trial, then a per-room or per-team subscription. Confirm current competitor prices on their sites — we snapshot them on the comparison pages.",
    },
  ],
  ctaHeading: "Create a free retrospective board",
  ctaBody:
    "No credit card. No participant sign-up. Pick a template, share a link, and run this sprint’s retro.",
};

export function pricingPageWordCount(page: PricingPageContent = pricingPage): number {
  const chunks = [
    page.h1,
    page.intro,
    page.includedIntro,
    ...page.included.flatMap((item) => [item.title, item.body]),
    page.limitsIntro,
    ...page.limits.flatMap((item) => [item.title, item.body]),
    ...page.notIncluded,
    page.whyIntro,
    ...page.why.flatMap((item) => [item.title, item.body]),
    ...page.chooseParagraphs,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
    page.ctaBody,
  ];
  return chunks
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
