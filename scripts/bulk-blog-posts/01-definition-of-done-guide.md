---
title: "Definition of Done: A Practical Guide for Agile Teams"
slug: definition-of-done-guide
excerpt: "Learn how to write, agree on, and use a Definition of Done that keeps your Agile team aligned on quality and delivery standards."
author: SprintsPlans
category: "Guides"
coverImage: https://sprintsplans.com/images/blog/definition-of-done-guide.jpg
tags: definition of done, agile, scrum, quality standards, sprint planning, team alignment, acceptance criteria, continuous improvement
metaDescription: "A practical guide to creating and using a Definition of Done for Agile teams. Learn examples, templates, and how to keep your DoD evolving."
published: TRUE
---

# Definition of Done: A Practical Guide for Agile Teams

Every Agile team eventually hits the same wall: someone says a story is "done," and someone else disagrees. The developer shipped the code. The tester found edge cases. The product owner expected documentation. The designer noticed a spacing issue on mobile. Without a shared standard, "done" means something different to everyone in the room.

A **Definition of Done (DoD)** solves this problem. It is a clear, agreed-upon checklist that describes what must be true before work is considered complete. Not aspirational. Not vague. A practical contract your team can reference during [sprint planning](https://sprintsplans.com/blog/sprint-planning-guide), daily work, and reviews.

This guide walks you through what a Definition of Done is, why it matters, how to create one, and how to keep it useful as your team grows.

## What Is a Definition of Done?

A Definition of Done is a shared set of criteria that every product increment must meet before the team considers it complete. In Scrum, it applies at the increment level — the sum of all completed work in a sprint. In Kanban and other Agile approaches, it serves the same purpose: a quality gate everyone understands.

The DoD is different from **acceptance criteria**, which describe what a specific user story must do. Acceptance criteria are story-level. The Definition of Done is team-level. Every story must satisfy both.

| Concept | Scope | Example |
|---------|-------|---------|
| Acceptance criteria | Single user story | "User can reset password via email link" |
| Definition of Done | All completed work | "Code reviewed, tests passing, deployed to staging" |
| Definition of Ready | Work entering a sprint | "Story has clear AC, estimated, no blockers" |

If acceptance criteria answer "what does this feature do?", the Definition of Done answers "what does finished look like for us?"

## Why Your Team Needs a Definition of Done

Without a DoD, teams accumulate hidden work. A story marked complete might still need testing, documentation, security review, or deployment steps that were never accounted for. This creates unpredictable velocity, erodes trust with stakeholders, and leads to quality problems discovered late.

A well-crafted Definition of Done delivers several benefits:

- **Predictable delivery** — You know what "complete" means before the sprint starts
- **Fewer surprises** — Quality checks happen during development, not after
- **Better estimates** — Teams account for review, testing, and deployment in their planning
- **Shared accountability** — Everyone agrees on the standard, not just the developer who wrote the code
- **Foundation for improvement** — A living DoD evolves as your team matures

The DoD also connects directly to your team's improvement loop. When retrospectives surface quality gaps, updating the Definition of Done turns insight into a lasting standard. Teams that treat their DoD as static miss one of its most valuable uses.

## How to Create Your First Definition of Done

Building a DoD is a collaborative exercise, not a document handed down by management. The people who do the work should define what done means for their context.

### Step 1: Gather the Right People

Include developers, testers, designers, product owners, and anyone else who touches completed work. If your team has distinct [Scrum roles](https://sprintsplans.com/blog/scrum-roles-explained), each role should contribute perspective on what they need before signing off.

### Step 2: List Current Completion Activities

Ask: "What do we actually do before we call something done today?" Write everything down without filtering. You might discover the team already follows implicit standards that were never written down.

Common items include:

- Code written and committed
- Peer code review completed
- Unit tests written and passing
- Integration tests passing
- Manual QA on staging environment
- Product owner acceptance
- Documentation updated
- Accessibility checks completed
- Security scan run
- Deployed to production or release branch

### Step 3: Distinguish Must-Haves from Nice-to-Haves

Not everything belongs in the DoD. Items that apply only to certain story types might be better as acceptance criteria or team working agreements. The DoD should be achievable for every increment, every sprint.

A useful test: if skipping an item would make the team uncomfortable calling work "done," it belongs in the DoD.

### Step 4: Write Clear, Verifiable Criteria

Each item should be specific enough to check. "Code is good" fails. "At least one peer has approved the pull request" passes.

**Weak:** Testing is done  
**Strong:** All automated tests pass in CI; manual smoke test completed on staging

**Weak:** Documentation updated  
**Strong:** README and API docs updated for any new endpoints or configuration changes

### Step 5: Get Explicit Agreement

Read the draft aloud. Ask each person: "Can you commit to this?" Document the agreed version where everyone can access it — your wiki, sprint board, or team handbook. Revisit it at the start of each sprint until it becomes habit.

## Example Definition of Done Templates

Your DoD should reflect your product, tech stack, and compliance requirements. These examples show common patterns at different maturity levels.

### Starter DoD (New Teams)

- Code committed to the main branch
- Acceptance criteria met and verified
- No known critical bugs
- Product owner has reviewed the work
- Deployed to a shared staging environment

### Standard DoD (Growing Teams)

- Code reviewed and approved by at least one teammate
- Unit tests written with meaningful coverage for new logic
- All CI checks passing
- Acceptance criteria verified by QA or the product owner
- No regressions in existing functionality
- Feature flags configured if needed
- Deployed to staging and smoke-tested

### Mature DoD (Established Products)

- All items from the standard DoD, plus:
- Integration and end-to-end tests passing
- Performance benchmarks met for affected areas
- Security review completed for authentication or data-handling changes
- Accessibility standards met (WCAG 2.1 AA)
- Monitoring and alerting configured for new services
- Runbook or operational documentation updated
- Product owner sign-off recorded

Start simple. A five-item DoD your team actually follows beats a twenty-item DoD everyone ignores.

## Definition of Done vs. Acceptance Criteria

Teams often conflate these two concepts. Keeping them separate prevents confusion during [sprint planning](https://sprintsplans.com/blog/sprint-planning-guide) and review.

**Acceptance criteria** define the behavior of a specific story. They are written by the product owner (with input from the team) and answer: "How do we know this story works?"

**Definition of Done** defines the quality bar for all work. It is owned by the team and answers: "How do we know this work is truly complete?"

A story can meet all its acceptance criteria and still fail the DoD if code review was skipped or tests were not written. Conversely, a story that passes the DoD but misses acceptance criteria is not done either. Both must be satisfied.

## Using the Definition of Done in Daily Work

A DoD only works if the team references it regularly. Here is how to embed it in your workflow.

### During Sprint Planning

When estimating stories, account for DoD activities. If every story requires code review and testing, those steps are part of the work — not overhead added at the end. Teams that forget this consistently overcommit.

### During Development

Developers should self-check against the DoD before moving a story to "ready for review." This catches gaps early instead of during sprint review.

### During Sprint Review

Present only work that meets the Definition of Done. If a story is close but missing a DoD item, be honest with stakeholders. Showing incomplete work as done undermines trust and blurs your quality standard.

### During Retrospectives

The DoD is a natural topic for [sprint retrospectives](https://sprintsplans.com/blog/sprint-retrospective-guide). Ask:

- Did we follow our DoD this sprint?
- Did any items feel unnecessary or outdated?
- Are we missing criteria based on what we learned?

When teams identify patterns — recurring bugs, skipped reviews, deployment issues — updating the DoD turns retrospective insights into lasting change. Tools like [SprintsPlans](https://sprintsplans.com) help teams capture retrospective feedback, vote on priorities anonymously, and [turn insights into action items](https://sprintsplans.com/blog/turn-retrospective-feedback-into-action-items) that can include DoD updates.

## Common Mistakes to Avoid

### Making the DoD Too Long

A Definition of Done with twenty items becomes a checkbox exercise. Teams rush through items or find workarounds. Keep it focused on what genuinely matters for your increment quality.

### Copying Another Team's DoD

What works for a platform team with mature CI/CD may overwhelm a startup building an MVP. Borrow ideas, but tailor the list to your reality.

### Never Updating It

Products evolve. Compliance requirements change. New tools arrive. Review your DoD quarterly or whenever retrospectives surface quality themes. A [continuous improvement system](https://sprintsplans.com/blog/continuous-improvement-system-for-teams) treats the DoD as a living document, not a one-time exercise.

### Enforcing Without Team Buy-In

A DoD imposed by management feels like bureaucracy. A DoD the team creates feels like a shared commitment. Facilitation matters. If adoption is slow, discuss why in a retrospective rather than escalating enforcement.

### Confusing Done with Released

Done means the increment meets your quality standard. Released means it is available to users. Some teams include deployment in their DoD; others treat release as a separate decision. Be explicit about which model you use.

## Evolving Your Definition of Done

As teams mature, their DoD typically expands. Early teams focus on basic quality gates. Later teams add operational readiness, observability, and compliance checks.

Signs it is time to update your DoD:

- The same quality issues appear in multiple sprints
- New regulations or security requirements apply to your product
- You adopted new tooling (CI/CD, automated testing) that enables stricter checks
- Team members consistently skip or debate certain items
- Stakeholders report quality problems that the DoD should have caught

When updating, remove items that no longer add value. A DoD that only grows eventually becomes unusable. Treat it like product backlog grooming — add, refine, and delete.

## Definition of Done for Remote and Distributed Teams

Remote teams face the same quality challenges with added communication overhead. A written, accessible DoD is even more critical when you cannot tap someone on the shoulder to ask "is this really done?"

Best practices for distributed teams:

- Store the DoD in a shared, always-available location
- Reference it in sprint planning video calls
- Use your project board to show DoD checklist items as subtasks when helpful
- Discuss DoD adherence in retrospectives, especially when [psychological safety](https://sprintsplans.com/blog/psychological-safety-remote-teams) affects whether people admit shortcuts

Online retrospective tools help remote teams surface quality concerns honestly. When team members can share feedback and vote anonymously, patterns around skipped reviews or rushed testing become visible without singling out individuals.

## Frequently Asked Questions

### Who owns the Definition of Done?

The development team owns it. In Scrum, the DoD is a formal team artifact. The product owner provides input on business-facing criteria, but the team decides what technical and quality standards apply.

### Can different teams have different Definitions of Done?

Yes. A mobile team and a backend API team will have different criteria. Even teams on the same product may differ based on tech stack and risk profile. Alignment across teams matters when they deliver a shared increment.

### How is Definition of Done different from Definition of Ready?

Definition of Ready describes when a backlog item is prepared to enter a sprint — clear requirements, estimated, dependencies resolved. Definition of Done describes when completed work meets quality standards. Ready is the entrance gate; Done is the exit gate.

### Should the DoD include deployment to production?

It depends on your release model. Teams practicing continuous deployment often include production deployment in their DoD. Teams with scheduled releases may consider staging deployment as done and treat production release separately. Choose explicitly and document the decision.

### How do we handle stories that cannot meet every DoD item?

If a DoD item genuinely does not apply to a specific story, document the exception and get team agreement. Frequent exceptions signal the DoD needs refinement, not that the team should ignore it.

### Can the Definition of Done include non-technical items?

Absolutely. Design review, copy approval, legal sign-off, and customer communication can all be DoD items when they are required for every increment.

## Building a Culture of Done

A Definition of Done is more than a checklist. It is a statement about how your team values quality, transparency, and mutual respect. When everyone agrees on what finished means, conversations shift from "I thought you were handling that" to "let us check the DoD together."

Start with a short list your team can commit to today. Use it in planning, development, and review. Refine it based on what you learn in retrospectives. Over time, your DoD becomes one of the most practical tools in your Agile practice — quiet, unglamorous, and essential.

If your team is also working on improving how you reflect and adapt, pair your DoD work with a strong retrospective practice. Understanding [what a retrospective is](https://sprintsplans.com/blog/what-is-a-retrospective) and how to [facilitate one effectively](https://sprintsplans.com/blog/facilitate-retrospective-60-minute-agenda) ensures that quality standards and team learning move forward together.
