---
name: Meeting Prep
description: Prepares a structured briefing package for any upcoming meeting — covering agenda, attendees, talking points, and questions to ask.
---

# Meeting Prep Skill

Generates a focused meeting prep brief so Arnold walks in prepared and productive.

## When to Use

- Arnold says "prep me for a meeting with...", "I have a call with... tomorrow"
- Run as part of `workflows/morning_routine.md` if a meeting is on the schedule

## Inputs

**Required:**
- **Meeting name/topic**
- **Attendees** — Names and roles

**Optional (gathered from context):**
- `context/people.md` — Notes on attendees
- `context/projects.md` — Relevant project context
- Meeting agenda or notes if provided by Arnold
- Previous meeting notes if stored in `memory/logs/`

## Output Format

```
## 📋 Meeting Prep — [Meeting Title]
**Date/Time:** [Date, if known]
**Attendees:** [Name (Role), Name (Role)]

---

### 🎯 Objective
[What this meeting should accomplish in 1–2 sentences]

### 📎 Context
[Brief background: project status, relationship history, last interaction]

### ✅ Agenda
1. [Topic]
2. [Topic]
3. [Topic]

### 💬 Talking Points
- [Key point to make]
- [Key point to make]

### ❓ Questions to Ask
- [Question]
- [Question]

### 🎯 Desired Outcome
[What Arnold wants to walk away with]

### ⚠️ Watch-Outs
[Anything to be careful about — sensitivities, open issues, etc.]
```

## Steps

1. Ask for meeting topic and attendees if not provided
2. Read `context/people.md` for notes on attendees
3. Read `context/projects.md` for relevant project context
4. Check `memory/logs/` for any previous notes on this meeting/contact
5. Generate the meeting prep brief
6. Offer to refine talking points or add custom agenda items

## Notes

- Keep talking points punchy — 1 line each
- Flag any known tension or sensitivities from `context/people.md` under Watch-Outs
- After the meeting, offer to capture notes and update `memory/logs/`
