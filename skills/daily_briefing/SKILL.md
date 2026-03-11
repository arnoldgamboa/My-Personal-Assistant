---
name: Daily Briefing
description: Generates a concise morning briefing for Arnold covering the day's priorities, pending items, and context — surfaced from memory, context files, and the inbox.
---

# Daily Briefing Skill

Generates a structured morning briefing to start the day with clarity and focus.

## When to Use

- Arnold asks for a "daily briefing", "morning brief", or "what's on my plate today"
- Run as part of the `workflows/morning_routine.md` workflow

## Inputs

Before generating the briefing, read the following files:
1. `context/projects.md` — active projects and their status
2. `context/goals.md` — current quarterly and annual goals
3. `context/people.md` — key contacts and relationships
4. `memory/decisions.md` — recent decisions for continuity
5. `memory/arwenhq_mvp_checklist.md` — ArwenHQ pre-launch checklist (surface 1–2 open items daily)
6. `inbox/` — any uncaptured or unprocessed items

Use the current system date/time as the date reference. Never fabricate a date.

## Output Format

Produce a briefing in this exact structure:

```
## 🌅 Daily Briefing — [Day, Month Date, Year]

### 🎯 Today's Top 3 Priorities
1. [Most important task with brief context]
2. [Second priority]
3. [Third priority]

### 📅 Schedule
- [Time] — [Event or appointment if known]
- (No scheduled items) if none captured

### 📂 Active Projects — Quick Status
- **[Project Name]:** [One-line status / what's next]

### 💬 Community Engagement
- ⏳ **Reminder:** Remember to run `skills/reddit_scanning/SKILL.md` to find 5 high-value posts to engage with today!

### 📥 Inbox
- [N items pending capture/triage] or "(Inbox clear)"

### ⚠️ Flags & Blockers
- [Anything that needs attention or is at risk]

### 📧 Regubrief Maintenance
- **Only include this section on Mondays.**
- If today is Monday: "📧 Regubrief day. Time to curate and send this week's GDPR enforcement actions to subscribers. Check `context/projects.md` for details."
- All other days: omit this section entirely.

### ✍️ Blog — Shipped & Unfinished
- **Only include this section on Wednesdays.**
- If today is Wednesday: "📝 Blog day. What did you build or decide this week that's worth writing about? Run `skills/blog_writing/SKILL.md` to draft a post."
- All other days: omit this section entirely.

### 📖 ChurchPromptDirectory Maintenance
- **Only include this section on Fridays.**
- If today is Friday: "📖 ChurchPromptDirectory day. Write and publish a new article, prompt guide, or resource for church leaders. Focus on SEO and evergreen content."
- All other days: omit this section entirely.

### 💡 Focus Suggestion
[One actionable suggestion based on goals and priorities]

### 🔨 ArwenHQ MVP — Daily Nudge
- Read `memory/arwenhq_mvp_checklist.md` and surface 1–2 checklist items that haven't been touched recently.
- Prompt: "What did you work on in ArwenHQ yesterday? Want to update the checklist?"
```

## Steps

1. Read all input context files listed above
2. Identify today's date from system time
3. Scan `inbox/` for any uncaptured items
4. Pull top 3 priorities from `context/projects.md` + `context/goals.md`
5. Identify any flags or blockers from project context
6. Generate the briefing in the format above
7. Include the static reminder to run the Reddit Scanner in the `💬 Community Engagement` section
8. **Day-specific sections:**
   - **Monday:** Include `📧 Regubrief Maintenance` section. Otherwise omit.
   - **Wednesday:** Include `✍️ Blog — Shipped & Unfinished` section. Otherwise omit.
   - **Friday:** Include `📖 ChurchPromptDirectory Maintenance` section. Otherwise omit.
9. Offer to drill into any section if Arnold asks

## Notes

- Keep the briefing scannable — max 1–2 lines per item
- If context files are sparse, acknowledge gaps and ask Arnold to fill them in
- Do not invent tasks or priorities that aren't grounded in the context files
