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
## 📋 Yesterday's Review — [Previous Day, e.g. "Wednesday, March 12"]

**Before we get to today — what did you actually get done yesterday?**

Use the AskUserQuestion tool with multiSelect: true to present yesterday's recommended tasks as real interactive checkboxes. Pull the exact task names and project context from the most recent "Recommended for Today" entry in `memory/daily_briefing_log.md`.

Each option should include:
- label: The task name (exact text from the log)
- description: The project it belongs to and why it mattered

Example question config:
  question: "Which of yesterday's recommended tasks did you complete?"
  header: "Yesterday"
  multiSelect: true
  options:
    - label: "Verify Brevo email end-to-end"
      description: "ArwenHQ — foundational blocker for invites, activation, and notifications"
    - label: "Fix Team Chat ghost text bug"
      description: "ArwenHQ — ~30 min fix, clears UX debt before launch"
    - label: "Follow up with Colin on Rosebowl proposal"
      description: "Rosebowl — proposal sent 2026-03-11, no response yet"

After Arnold responds:
- Log ✅ for each selected item
- Log ❌ for each unselected item
- Append the completion review to `memory/daily_briefing_log.md`
- Carry uncompleted items forward as follow-ups in today's briefing

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

1. Read `memory/daily_briefing_log.md` — find the most recent **"Recommended for Today"** entry
2. Extract each task's exact name and its associated project from the log
3. Use **`AskUserQuestion` with `multiSelect: true`** to present the tasks as real interactive checkboxes:
   - `question`: "Which of yesterday's recommended tasks did you complete?"
   - `header`: "Yesterday"
   - Each `option.label` = exact task name from the log
   - Each `option.description` = project name + one-line reason it mattered
4. Wait for Arnold's response — selected = done, unselected = not done
5. Append a **Completion Review** block to `memory/daily_briefing_log.md`:
   - ✅ for each selected task
   - ❌ for each unselected task (note: "carry forward")
6. Any ❌ tasks surface in today's briefing under **⚠️ Flags & Blockers** as "Carried over from yesterday"

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
15. **CRITICAL — Log today's top 3 immediately after writing them:**
    - The 3 tasks in `### 🎯 Today's Top 3 Priorities` ARE the recommended tasks
    - Copy them **verbatim** into `memory/daily_briefing_log.md` as `## [Date] — Recommended for Today`
    - Do this right after generating the briefing — never skip this step
    - Tomorrow's Yesterday's Review will pull exactly these 3 task names
16. Offer to drill into any section if Arnold asks

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
