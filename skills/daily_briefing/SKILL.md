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
6. `memory/daily_briefing_log.md` — yesterday's recommended items (for review section)
7. `inbox/` — any uncaptured or unprocessed items

Use the current system date/time as the date reference. Never fabricate a date.

## Output Format

Produce a briefing in this exact structure:

```
## 📋 Yesterday's Review — [Previous Day]

**What did you accomplish?** Check off what you completed:

- [ ] [Yesterday's recommended task 1]
- [ ] [Yesterday's recommended task 2]
- [ ] [Yesterday's recommended task 3]

*(You decide which boxes to check. I'll remember your choices.)*

---

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

### Phase 1: Yesterday's Review (Completion Tracking)

1. Read `memory/daily_briefing_log.md` to get yesterday's recommended items (if it exists)
2. Present yesterday's 3 recommended tasks as a **checkbox list**
3. Ask Arnold to check off what he actually completed
4. **Capture his response** — only items he confirms are marked as done
5. Log the results in `memory/daily_briefing_log.md` with timestamp and completion status
6. Move uncompleted items to today's briefing (as follow-ups or rescheduled tasks)

---

### Phase 2: Today's Briefing (Generation)

7. Read all input context files listed above
8. Identify today's date from system time
9. Scan `inbox/` for any uncaptured items
10. Pull top 3 priorities from `context/projects.md` + `context/goals.md`
11. Identify any flags or blockers from project context
12. Generate the briefing in the format above (starting after the Yesterday's Review section)
13. Include the static reminder to run the Reddit Scanner in the `💬 Community Engagement` section
14. **Day-specific sections:**
    - **Monday:** Include `📧 Regubrief Maintenance` section. Otherwise omit.
    - **Wednesday:** Include `✍️ Blog — Shipped & Unfinished` section. Otherwise omit.
    - **Friday:** Include `📖 ChurchPromptDirectory Maintenance` section. Otherwise omit.
15. At the end of the briefing, present **today's 3 recommended tasks** as the actionable output
16. Store today's recommended tasks in `memory/daily_briefing_log.md` for tomorrow's review
17. Offer to drill into any section if Arnold asks

## Notes

- Keep the briefing scannable — max 1–2 lines per item
- If context files are sparse, acknowledge gaps and ask Arnold to fill them in
- Do not invent tasks or priorities that aren't grounded in the context files

## Memory Tracking

The daily briefing process maintains a log in `memory/daily_briefing_log.md`:

```markdown
# Daily Briefing Log

## [Date] — Completion Review
- ✅ Task 1 (completed)
- ❌ Task 2 (not completed — rescheduled to [date])
- ✅ Task 3 (completed)

**Notes:** [Any context Arnold adds]

---

## [Date] — Recommended for Today
- Task A
- Task B
- Task C
```

This creates a feedback loop:
1. **Yesterday:** Present what was recommended
2. **Today:** Record what was done
3. **Tomorrow:** Build on completed work and refocus

Arnold's completion data is logged to understand patterns, dependencies, and realistic capacity.
