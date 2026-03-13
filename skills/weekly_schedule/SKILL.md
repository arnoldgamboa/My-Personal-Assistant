---
name: Weekly Schedule
description: Plans Arnold's week across all three roles — solopreneur, Bally's, and church — accounting for preaching weeks, key meetings, and deadlines.
---

# Weekly Schedule Skill

Plans the week ahead across Arnold's tri-vocational life.

## When to Use

- Start of the week (Monday morning, or Sunday evening)
- Arnold asks to plan his week
- Part of `workflows/weekly_planning.md`

## Inputs

1. `context/projects.md` — active solopreneur projects and next actions
2. `context/goals.md` — recurring commitments and quarterly goals
3. `context/ballys.md` — recurring meetings and current priorities
4. `context/lifecity_church.md` — preaching schedule, current sermon series
5. `memory/daily_briefing_log.md` — carryovers from last week
6. Arnold's input: **"Are you preaching this Sunday?"** (critical question)

## Process

### Step 1: Gather Context
- Read all input files
- Ask Arnold:
  1. "Are you preaching this Sunday?"
  2. "Any special Bally's meetings or deadlines this week?"
  3. "Anything else I should know about this week?"

### Step 2: Build the Week

Generate a weekly overview using this structure:

```markdown
## Weekly Plan: [Week of Month Day, Year]

### This Week's Key Facts
- **Preaching:** Yes / No (if yes: passage/topic)
- **Bally's highlights:** [Key meetings or deadlines]
- **Solopreneur focus:** [Top project or deliverable]

### Monday
**Solopreneur (8AM–1PM)**
- [ ] [Task 1]
- [ ] [Task 2]
**Bally's (1PM–8PM)**
- [ ] [Task / Meeting]

### Tuesday
**Solopreneur (8AM–1PM)**
- [ ] [Task 1]
**Bally's (1PM–8PM)**
- [ ] [Task / Meeting]

### Wednesday
**Solopreneur (8AM–1PM)**
- [ ] Blog day: Shipped & Unfinished
- [ ] [Other tasks]
**Bally's (1PM–8PM)**
- [ ] [Task / Meeting]

### Thursday
**Solopreneur (8AM–1PM)**
- [ ] [Task 1]
**Bally's (1PM–8PM)**
- [ ] [Task / Meeting]
**Church (Evening)**
- [ ] Begin sermon prep: [Passage/Topic] *(only if preaching)*

### Friday
**Solopreneur (8AM–1PM)**
- [ ] ChurchPromptDirectory article
- [ ] [Other tasks]
**Bally's (1PM–8PM)**
- [ ] [Task / Meeting]
**Church**
- [ ] Continue sermon prep *(only if preaching)*

### Saturday
**Church**
- [ ] Finalize sermon *(only if preaching)*
**Personal**
- [ ] Rest / personal time

### Sunday
**Church**
- [ ] Preach / Attend service
**Personal**
- [ ] Rest
```

### Step 3: Confirm & Adjust
- Present the plan to Arnold
- Ask: "Does this look right, or do you want to shift anything?"
- Adjust based on feedback

## Day-Specific Defaults

These recurring items are auto-placed unless Arnold says otherwise:

| Day | Default Task | Role |
|-----|-------------|------|
| Monday | ReguBrief newsletter | Solopreneur |
| Wednesday | Blog post (Shipped & Unfinished) | Solopreneur |
| Friday | ChurchPromptDirectory article | Solopreneur |
| Thursday | Sermon prep begins | Church (if preaching) |

## Notes

- If Arnold is **not preaching**, remove all sermon prep tasks from Thu–Sun
- Bally's tasks are only what Arnold explicitly tells us — never assume
- Keep the plan realistic — Arnold has 5 hours of solopreneur time and 7 hours of Bally's time per day
- Surface conflicts early: "You have 3 deadlines on Thursday — want to redistribute?"
