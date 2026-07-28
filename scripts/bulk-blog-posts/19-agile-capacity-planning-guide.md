---
title: "Capacity Planning in Agile Sprints: A Practical Guide"
slug: agile-capacity-planning-guide
excerpt: "Accurate sprint capacity planning prevents overcommitment and burnout. Learn how to calculate team capacity, account for time off, and commit realistically."
author: SprintsPlans
category: "Project Management"
coverImage: https://sprintsplans.com/images/blog/agile-capacity-planning-guide.jpg
tags: capacity planning, sprint capacity, agile planning, team availability, sprint commitment, resource planning
metaDescription: "Plan agile sprint capacity accurately with practical techniques for calculating team availability, accounting for time off, and committing to realistic sprint goals."
published: TRUE
---

# Capacity Planning in Agile Sprints: A Practical Guide

Every sprint planning session starts with the same question: how much can we commit to? Teams that guess get unpredictable sprints—half-finished work, rushed quality, and demoralized developers. Teams that calculate capacity commit realistically, deliver consistently, and build trust with stakeholders.

Capacity planning in agile is the process of determining how much work a team can take on in a sprint based on actual availability—not wishful thinking. It accounts for vacations, meetings, support duties, and the reality that developers do not spend eight hours a day writing code.

This guide provides practical formulas, templates, and techniques for calculating sprint capacity and using it to make better commitments.

## Why Capacity Planning Matters

Without capacity planning, teams default to one of two failure modes:

**Overcommitment.** The team takes on too much work. Items spill into the next sprint. Quality drops as developers rush to finish. The sprint retrospective becomes a post-mortem for another missed commitment.

**Undercommitment.** The team plays it safe, leaving capacity unused. Stakeholders lose confidence. The team loses opportunities to deliver value.

Both failure modes stem from the same root cause: the team does not know its actual capacity. Capacity planning replaces guessing with calculation.

Accurate capacity feeds directly into [sprint planning](https://sprintsplans.com/blog/sprint-planning-guide). Planning without capacity data is like shopping without knowing your budget.

## Capacity vs. Velocity: Understanding the Difference

Teams often confuse capacity with velocity. They are related but distinct.

| Concept | What It Is | How It Is Measured |
|---------|-----------|-------------------|
| Capacity | Available working hours in the sprint | Calculated from team availability |
| Velocity | Amount of work completed in past sprints | Historical story points or items delivered |

**Capacity is forward-looking.** It tells you how many hours the team has available this sprint.

**Velocity is backward-looking.** It tells you how much work the team historically completes.

Use capacity to set an upper bound. Use velocity to calibrate how much of that capacity translates into completed work. Together, they produce realistic sprint commitments.

For a deeper look at how velocity fits into the broader measurement picture, see our guide on [agile metrics that matter](https://sprintsplans.com/blog/agile-metrics-that-matter).

## Step 1: Calculate Raw Team Capacity

Start with the number of working days in the sprint and the number of team members.

**Formula:**

```
Raw Capacity = Team Members × Working Days × Hours per Day
```

**Example:** 5 developers × 10 working days × 8 hours = 400 hours

This number is a ceiling, not a target. Nobody spends eight hours a day on sprint work.

## Step 2: Subtract Non-Sprint Time

Developers do not only work on sprint backlog items. Subtract time spent on activities that are not sprint deliverables.

### Common Non-Sprint Activities

| Activity | Typical Time per Sprint | Notes |
|----------|------------------------|-------|
| Daily standup | 5 min × working days × team size | Shared cost |
| Sprint planning | 2 hours × team size | Once per sprint |
| Sprint review | 1 hour × team size | Once per sprint |
| Sprint retrospective | 1 hour × team size | Once per sprint |
| Backlog refinement | 4–6 hours × team size | Spread across sprint |
| All-hands / town halls | 1–2 hours per person | Varies by organization |
| 1:1 meetings | 1 hour per person | Manager direct reports |
| Production support / on-call | 2–8 hours per person | Varies by rotation |
| Interview loops | 2–4 hours per interviewer | If team interviews candidates |

**Example adjustments for a 5-person team over 10 days:**

| Deduction | Hours |
|-----------|-------|
| Ceremonies (standup, planning, review, retro) | 50 hours |
| Backlog refinement | 25 hours |
| 1:1 meetings | 5 hours |
| On-call rotation (1 person) | 8 hours |
| **Total deductions** | **88 hours** |
| **Adjusted capacity** | **400 - 88 = 312 hours** |

## Step 3: Account for Individual Availability

Not every team member is available for every hour of the sprint.

### Time Off

Check the calendar for:

- Planned vacations
- Public holidays
- Conference attendance
- Training days
- Sick leave buffer (some teams reserve 5–10% for unexpected absence)

Subtract unavailable days per person.

**Example:** One developer takes 3 days off during a 10-day sprint.

```
3 days × 8 hours = 24 hours subtracted
Adjusted capacity: 312 - 24 = 288 hours
```

### Part-Time Team Members

If a team member works part-time or splits time across teams, count only their available hours.

**Example:** A designer available 50% of the sprint contributes 20 hours (50% of 40 hours), not 40.

### New Team Members

Developers in their first one to two sprints operate at reduced capacity—learning the codebase, setting up environments, and onboarding. A common rule: count new members at 50% capacity for sprint 1, 75% for sprint 2, and 100% thereafter.

## Step 4: Apply a Focus Factor

Even available hours are not fully productive. Developers context-switch, help colleagues, review pull requests, and stare at problems that take longer than expected.

The **focus factor** (also called an efficiency factor) accounts for this reality.

| Team Maturity | Typical Focus Factor |
|--------------|---------------------|
| New team (< 3 sprints together) | 0.6 – 0.7 |
| Established team | 0.7 – 0.8 |
| High-performing stable team | 0.8 – 0.85 |

**Formula:**

```
Effective Capacity = Adjusted Capacity × Focus Factor
```

**Example:** 288 hours × 0.75 = 216 effective hours

This is the number that matters. 216 hours is what the team can realistically dedicate to sprint backlog work.

## Step 5: Convert Hours to Story Points (Optional)

Teams that estimate in story points need to convert effective hours into a point budget.

**Method 1: Historical conversion rate**

```
Points per hour = Total story points delivered last 3 sprints ÷ Total effective hours worked
Sprint point budget = Effective capacity × Points per hour
```

**Example:** Team delivered 60 points over 3 sprints with 600 effective hours.

```
60 ÷ 600 = 0.1 points per hour
216 hours × 0.1 = ~22 points available this sprint
```

**Method 2: Capacity-based estimation**

Skip the conversion. During sprint planning, add items until the team agrees the total effort matches available capacity. Experienced teams often prefer this approach because it avoids the false precision of hour-to-point conversion.

Either way, the [backlog refinement](https://sprintsplans.com/blog/backlog-refinement-best-practices) process should have pre-estimated items ready so planning focuses on fitting work to capacity—not estimating from scratch.

## Capacity Planning Template

Use this template at the start of every sprint planning session:

| Team Member | Available Days | Hours/Day | Gross Hours | Time Off | Net Hours | Focus Factor | Effective Hours |
|-------------|---------------|-----------|-------------|----------|-----------|-------------|----------------|
| Developer A | 10 | 8 | 80 | 0 | 80 | 0.75 | 60 |
| Developer B | 10 | 8 | 80 | 3 | 56 | 0.75 | 42 |
| Developer C | 10 | 8 | 80 | 0 | 80 | 0.75 | 60 |
| Developer D | 10 | 8 | 80 | 0 | 80 | 0.75 | 60 |
| Developer E | 10 | 8 | 80 | 0 | 80 | 0.75 | 60 |
| **Team Total** | | | **400** | **3 days** | **376** | | **282** |

| Deduction | Hours |
|-----------|-------|
| Sprint ceremonies | 50 |
| Backlog refinement | 25 |
| On-call / support | 8 |
| **Total deductions** | **83** |
| **Final effective capacity** | **282 - 83 = 199 hours** |

Share this calculation with the team during sprint planning. Transparency builds trust in the commitment process.

## Common Capacity Planning Mistakes

### Ignoring Ceremonies

Teams that calculate capacity as "5 people × 10 days × 8 hours" without subtracting ceremony time overcommit by 15–20% every sprint.

### Forgetting On-Call and Support

Production support is real work that consumes sprint capacity. If one person is on-call, their sprint capacity drops. Account for it.

### Using Last Sprint's Velocity as This Sprint's Capacity

Last sprint had no vacations. This sprint has two people out for three days. Velocity from last sprint overstates this sprint's capacity.

### Not Adjusting for Team Changes

Adding or removing a team member changes capacity non-linearly. A new hire does not instantly replace a departed senior developer's output. Recalculate capacity when the team composition changes.

### Treating Capacity as a Target

Capacity is an upper bound, not a goal. Teams should not feel pressured to fill every available hour. Leave buffer for unexpected work, technical debt, and the reality that estimates are imperfect.

### Planning at 100% Capacity

Never commit to 100% of calculated capacity. Aim for 80–85%. The remaining 15–20% absorbs estimation errors, urgent bugs, and the unexpected items that appear in every sprint.

## Capacity Planning for Different Team Structures

### Cross-Functional Teams

Include all disciplines in capacity calculation—developers, QA, designers, and DevOps engineers all have limited hours. A sprint commitment that requires design work cannot exceed the designer's capacity even if developers have spare hours.

### Teams with Shared Resources

If a developer splits time across two teams, count only their allocated percentage. A developer at 50% on your team contributes 50% of their hours to your capacity—not 100%.

### Distributed Teams

Time zone differences do not change capacity math, but they affect when capacity is available. A team spanning continents may have fewer overlapping hours for collaborative work. Factor collaboration constraints into planning even when total hours look sufficient.

## Connecting Capacity to the Definition of Done

Capacity calculations assume that completed work meets the team's [Definition of Done](https://sprintsplans.com/blog/definition-of-done-guide). If the team routinely skips testing or documentation to hit capacity targets, effective capacity is lower than calculated—because "done" items require rework.

Review whether completed items actually meet Done criteria. If not, reduce the focus factor until quality stabilizes.

## Capacity Planning and Stakeholder Communication

Stakeholders who understand capacity make better prioritization decisions.

**Share capacity context during sprint reviews:**

- "We had 199 effective hours this sprint and delivered 22 points."
- "Next sprint capacity drops to 160 hours because two team members are at a conference."
- "We are committing to 18 points—85% of capacity—to leave room for production support."

This transparency replaces the adversarial dynamic where stakeholders see missed commitments without understanding reduced capacity.

## Improving Capacity Accuracy Over Time

Track these indicators to refine your capacity planning:

| Indicator | What It Tells You |
|-----------|------------------|
| Sprint commitment accuracy | Are you committing the right amount? |
| Spillover rate | How many items carry to the next sprint? |
| Focus factor trend | Is your efficiency assumption correct? |
| Unplanned work % | How much capacity goes to unplanned items? |

Review capacity accuracy in [sprint retrospectives](https://sprintsplans.com/blog/sprint-retrospective-guide). If the team consistently overcommits, lower the focus factor or increase the buffer. If the team consistently undercommits, raise the commitment target gradually.

Teams using [SprintsPlans](https://sprintsplans.com/) for retrospectives can track capacity-related action items—like adjusting focus factors or improving estimation—alongside other improvement goals.

## Capacity Planning for Longer Horizons

Sprint-level capacity planning is the foundation. Extend it for quarterly planning:

1. **Calculate capacity for each sprint in the quarter** accounting for known vacations and holidays
2. **Sum effective hours** across all sprints
3. **Compare against roadmap commitments** to identify quarters where capacity cannot support planned deliverables
4. **Adjust scope or timeline** before the quarter starts—not mid-quarter when it is too late

This forward view connects sprint-level planning to strategic [project management](https://sprintsplans.com/blog/agile-vs-waterfall-software-teams) decisions.

## Frequently Asked Questions

### Should part-time team members be included in capacity planning?

Yes, with their actual available hours. Excluding them from capacity planning while including their work in commitments guarantees overcommitment.

### How do we handle unpredictable production support?

Reserve a fixed percentage of capacity (typically 10–20%) for unplanned support work. Track actual support hours over several sprints and adjust the reserve based on trends.

### Is capacity planning the same as resource management?

No. Capacity planning is a team-level exercise for sprint commitment. Resource management is an organizational practice for allocating people across projects. Capacity planning respects team self-organization; resource management often undermines it.

### How does capacity planning work with Kanban?

Kanban teams do not have sprint commitments, but capacity still matters for forecasting delivery dates and managing WIP limits. The same availability calculations apply—only the commitment mechanism differs.

### What focus factor should a new team use?

Start at 0.6 and increase by 0.05 each sprint as the team stabilizes. New teams underestimate how much time ceremonies, communication overhead, and learning consume.

### Should we include the Product Owner in capacity calculations?

The Product Owner's capacity matters for activities like acceptance testing and refinement participation but not for development work. Include them only for shared activities, not for story point capacity.

## Plan Capacity Before You Plan Work

Capacity planning is not bureaucracy. It is the difference between a team that consistently delivers on its commitments and a team that apologizes every sprint review.

Calculate available hours. Subtract ceremonies, time off, and support duties. Apply a realistic focus factor. Commit to 80–85% of effective capacity. Share the math with stakeholders.

Your next sprint planning session should start with a number everyone trusts—not a guess everyone hopes will work out.
