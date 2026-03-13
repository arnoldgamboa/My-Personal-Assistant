---
name: Sermon Prep
description: Guides Arnold through sermon preparation — from passage selection through final outline. Invokes the Sermon Agent for research and exegesis.
---

# Sermon Prep Skill

Supports Arnold's sermon preparation process from Thursday through Sunday.

## When to Use

- Arnold says he's preaching this Sunday and wants to start prep
- It's Thursday and the weekly plan shows Arnold is preaching
- Arnold asks for help with a specific sermon passage or topic
- Part of the `workflows/sermon_prep.md` workflow

## Prerequisites

- Read `context/lifecity_church.md` for Arnold's theology, methodology, and current sermon series
- Confirm with Arnold: **What passage or topic are you preaching on this Sunday?**
- Check if this is part of an ongoing series

## Inputs

1. `context/lifecity_church.md` — preaching methodology, current series, theology
2. Biblical passage or topic (from Arnold)
3. Any notes or direction Arnold has already started with

## Process

### Phase 1: Research & Exegesis (Thursday)

1. **Confirm the passage/topic** — Ask Arnold if not already clear
2. **Invoke Sermon Agent** — Read `agents/sermon_agent.md` and use it for:
   - Contextual study of the passage (historical, literary, theological)
   - Key themes and cross-references
   - Original language insights where helpful
3. **Present research summary** — Structured, scannable format
4. **Identify the Big Idea** — One core sentence the sermon is built around
5. **Ask Arnold:** "Does this big idea resonate, or do you want to adjust the angle?"

### Phase 2: Outline Development (Friday)

1. **Build an outline** based on Arnold's methodology (from `context/lifecity_church.md`)
2. **Suggest structure:**
   - Introduction / hook
   - Main points (typically 2–4)
   - Transitions between points
   - Application sections
   - Conclusion / call to action
3. **Source illustrations** — Stories, analogies, real-world examples
4. **Present the outline** — Ask Arnold for feedback and adjustments

### Phase 3: Refinement (Saturday)

1. **Finalize the outline** based on Arnold's feedback
2. **Strengthen weak sections** — Tighten illustrations, sharpen applications
3. **Review flow** — Does it move logically? Is the big idea clear throughout?
4. **Produce final sermon prep document**

### Phase 4: Delivery Prep (Sunday morning)

1. **Quick review** — If Arnold asks, provide a condensed version of key points
2. **Last-minute adjustments** — Minor tweaks only

## Output Format

```markdown
## Sermon Prep: [Title / Passage]
**Series:** [Series name if applicable]
**Date:** [Sunday date]
**Preacher:** Arnold Gamboa

### Big Idea
[One sentence]

### Outline

**Introduction**
- [Hook / opening]

**Point 1: [Title]**
- [Key thought]
- [Supporting scripture]
- [Illustration]

**Point 2: [Title]**
- [Key thought]
- [Supporting scripture]
- [Illustration]

**Point 3: [Title]**
- [Key thought]
- [Supporting scripture]
- [Illustration]

**Application**
- [Practical takeaway]

**Conclusion**
- [Closing thought / call to action]
```

## Notes

- Arnold's methodology and theology in `context/lifecity_church.md` are authoritative — always follow them
- If the methodology file is not yet populated, ask Arnold to share his approach before generating content
- Sermon prep is intermittent across Thursday–Sunday, not a single sitting
- Save sermon prep outputs to `resources/drafts/` with filename format: `sermon-YYYY-MM-DD-[short-title].md`
