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
   - Original language insights (Hebrew/Greek) where they add clarity
3. **Present research summary** — Structured, scannable format
4. **Identify the Main Thought** — One core sentence the sermon is built around
5. **Draft the ME and WE sections** — Opening hook and shared human experience
6. **Ask Arnold:** "Does this main thought resonate, or do you want to adjust the angle?"

### Phase 2: Outline Development (Friday)

1. **Build the full ME-WE-GOD-YOU-US outline** based on Arnold's methodology (from `context/lifecity_church.md`)
2. **GOD section must include:**
   - Background Context (historical, literary, theological)
   - Main points (typically 2–4) drawn from the text
   - Memorable lines (italicized) for each point
   - Original language insights where helpful
3. **YOU section must include:**
   - Specific, practical application steps
   - **"Where is Jesus in this?"** — Connect the entire message back to Christ
4. **Source illustrations** — Stories, analogies, real-world examples. Fresh, culturally relevant, not clichéd.
5. **Draft memorable lines** throughout — quotable, sticky phrases
6. **Present the outline** — Ask Arnold for feedback and adjustments

### Phase 3: Refinement (Saturday)

1. **Finalize the outline** based on Arnold's feedback
2. **Ensure all required components are present:** Main Thought, Opening Hook, Memorable Lines, Background Context, Closing Challenge, "Where is Jesus in this?", Final Memorable Line, Memory Verse, 5 Discussion Questions
3. **Review flow** — Does it move logically through ME → WE → GOD → YOU → US?
4. **Tighten memorable lines** — Are they truly sticky and quotable?
5. **Produce final sermon outline document**

### Phase 4: Delivery Prep (Sunday morning)

1. **Quick review** — If Arnold asks, provide a condensed bullet-point version
2. **Last-minute adjustments** — Minor tweaks only

## Output Format

The final output must follow the **ME-WE-GOD-YOU-US** structure exactly:

```markdown
SERMON OUTLINE
Text: [Book Chapter:Verses]
Title: [Sermon Title]
Series: [Series name if applicable]
Date: [Sunday date]
Preacher: Arnold Gamboa

**Main Thought:** [One sentence — the core idea of the whole message]

---

ME (Opening Hook)
[Personal, relatable story or scenario that creates tension]
*Memorable Line: [Sticky, quotable phrase]*

WE (Shared Human Experience)
[Broaden to universal. "We all know what it's like to..."]
*Memorable Line: [Sticky phrase]*

GOD (The Text & Theology)

**Background Context**
[Historical, literary, theological context. Original language insights where helpful.]

**1. [Main Point 1] (vv. X–Y)**
[Key thought, supporting explanation]
*Memorable Line: [Sticky phrase]*

**2. [Main Point 2] (vv. X–Y)**
[Key thought, supporting explanation]
*Memorable Line: [Sticky phrase]*

**3. [Main Point 3] (vv. X–Y)**
[Key thought, supporting explanation]
*Memorable Line: [Sticky phrase]*

YOU (Closing Challenge & Application)
[Specific, practical next steps]

**Where is Jesus in this?**
[Connect the message to Christ — His person, work, character, or gospel]
*Memorable Line: [Final sticky takeaway]*

**Memory Verse**
[Book Chapter:Verse] — "[Full verse text]"

**Discussion Questions**
1. [Personal reflection]
2. [Vulnerability/honesty]
3. [Practical application]
4. [Cultural/worldview challenge]
5. [Specific next step for the week]
```

## Notes

- Arnold's methodology and theology in `context/lifecity_church.md` are authoritative — always follow them
- If the methodology file is not yet populated, ask Arnold to share his approach before generating content
- Sermon prep is intermittent across Thursday–Sunday, not a single sitting
- Save sermon prep outputs to `resources/drafts/` with filename format: `sermon-YYYY-MM-DD-[short-title].md`
