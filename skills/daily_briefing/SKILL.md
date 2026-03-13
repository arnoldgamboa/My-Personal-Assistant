---
name: Daily Briefing
description: Generates a concise morning briefing for Arnold covering the day's priorities across all three roles (solopreneur, Bally's, church) — surfaced from memory, context files, and the inbox.
---

# Daily Briefing Skill

Generates a structured morning briefing to start the day with clarity and focus across Arnold's tri-vocational life.

## When to Use

- Arnold asks for a "daily briefing", "morning brief", or "what's on my plate today"
- Run as part of the `workflows/morning_routine.md` workflow

## Inputs

Before generating the briefing, read the following files:
1. `context/projects.md` — active solopreneur projects and their status
2. `context/goals.md` — current goals across all roles
3. `context/people.md` — key contacts and relationships
4. `context/ballys.md` — Bally's meetings, tasks, and priorities Arnold has shared
5. `context/lifecity_church.md` — preaching schedule, sermon series, prep status
6. `memory/decisions.md` — recent decisions for continuity
7. `memory/arwenhq_mvp_checklist.md` — ArwenHQ pre-launch checklist (surface 1–2 open items daily)
8. `memory/daily_briefing_log.md` — yesterday's recommended items (for review section)
9. `inbox/` — any uncaptured or unprocessed items

Use the current system date/time as the date reference. Never fabricate a date.

## Output Format

Produce a briefing in this exact structure:

```
## Yesterday's Review — [Previous Day, e.g. "Wednesday, March 12"]

**Before we get to today — what did you actually get done yesterday?**

Use the AskUserQuestion tool with multiSelect: true to present yesterday's recommended tasks as real interactive checkboxes. Pull the exact task names and project context from the most recent "Recommended for Today" entry in `memory/daily_briefing_log.md`.

Each option should include:
- label: The task name (exact text from the log)
- description: The role (Solopreneur/Bally's/Church) + project + why it mattered

Example question config:
  question: "Which of yesterday's recommended tasks did you complete?"
  header: "Yesterday"
  multiSelect: true
  options:
    - label: "Verify Brevo email end-to-end"
      description: "Solopreneur / ArwenHQ — foundational blocker for invites and notifications"
    - label: "Send status update to London team"
      description: "Bally's — weekly team visibility"
    - label: "Start exegesis for Sunday's passage"
      description: "Church — sermon prep, Romans 8:1-11"

After Arnold responds:
- Log ✅ for each selected item
- Log ❌ for each unselected item
- Append the completion review to `memory/daily_briefing_log.md`
- Carry uncompleted items forward as follow-ups in today's briefing

---

## Daily Briefing — [Day, Month Date, Year]

### Today's Schedule

| Time Block | Role | Focus |
|------------|------|-------|
| 8AM–1PM | Solopreneur | [Key tasks] |
| 1PM–8PM | Bally's | [Key tasks/meetings] |
| Evening | Church | [Sermon prep if applicable, or "—"] |

### Today's Top 3 Priorities
1. [Most important task — tag role: Solopreneur/Bally's/Church]
2. [Second priority — tag role]
3. [Third priority — tag role]

### Solopreneur Block (8AM–1PM)
- **[Project Name]:** [What to work on today]
- **[Project Name]:** [What to work on today]

### Bally's Block (1PM–8PM)
- [Meeting at X time] or "No meetings flagged — check Outlook"
- [Task reminder] or "No tasks flagged — steady day"
*(Only show items Arnold has explicitly shared. If nothing: "No Bally's items flagged. Anything to add?")*

### Church
- **Only show if Thursday–Sunday AND Arnold is preaching this week**
- Thursday: "Sermon prep begins — what passage/topic?" (if not started)
- Friday: "Continue sermon development — outline and illustrations"
- Saturday: "Finalize sermon draft"
- Sunday: "Deliver day — quick review if needed"
- **If not preaching this week or Mon–Wed:** Omit this section entirely

### Active Projects — Quick Status (Solopreneur)
- **[Project Name]:** [One-line status / what's next]

### Community Engagement
- Reminder: Run `skills/reddit_scanning/SKILL.md` to find 5 high-value posts to engage with today

### Inbox
- [N items pending capture/triage] or "(Inbox clear)"

### Flags & Blockers
- [Anything that needs attention or is at risk — across all roles]
- [Carried-over items from yesterday]

### Regubrief Maintenance
- **Only include this section on Mondays.**
- If today is Monday: "Regubrief day. Time to curate and send this week's GDPR enforcement actions."
- All other days: omit this section entirely.

### Blog — Shipped & Unfinished
- **Only include this section on Wednesdays.**
- If today is Wednesday: "Blog day. What did you build or decide this week that's worth writing about? Run `skills/blog_writing/SKILL.md` to draft a post."
- All other days: omit this section entirely.

### ChurchPromptDirectory Maintenance
- **Only include this section on Fridays.**
- If today is Friday: "ChurchPromptDirectory day. Write and publish a new article for church leaders."
- All other days: omit this section entirely.

### Thursday Sermon Prep Kickoff
- **Only include this section on Thursdays when Arnold is preaching.**
- If today is Thursday AND Arnold is preaching: "Sermon prep day. Run `skills/sermon_prep/SKILL.md` or `workflows/sermon_prep.md` to start. What passage are you preaching from?"
- All other days: omit this section entirely.

### Focus Suggestion
[One actionable suggestion based on goals, priorities, and which role needs the most attention today]

### ArwenHQ MVP — Daily Nudge
- Read `memory/arwenhq_mvp_checklist.md` and surface 1–2 checklist items that haven't been touched recently.
- Prompt: "What did you work on in ArwenHQ yesterday? Want to update the checklist?"
```

## Steps

### Phase 1: Yesterday's Review (Completion Tracking)

1. Read `memory/daily_briefing_log.md` — find the most recent **"Recommended for Today"** entry
2. Extract each task's exact name, role tag, and associated project from the log
3. Use **`AskUserQuestion` with `multiSelect: true`** to present the tasks as real interactive checkboxes:
   - `question`: "Which of yesterday's recommended tasks did you complete?"
   - `header`: "Yesterday"
   - Each `option.label` = exact task name from the log
   - Each `option.description` = role + project name + one-line reason it mattered
4. Wait for Arnold's response — selected = done, unselected = not done
5. Append a **Completion Review** block to `memory/daily_briefing_log.md`:
   - ✅ for each selected task
   - ❌ for each unselected task (note: "carry forward")
6. Any ❌ tasks surface in today's briefing under **Flags & Blockers** as "Carried over from yesterday"

---

### Phase 2: Today's Briefing (Generation)

7. Read all input context files listed above
8. Identify today's date from system time
9. Determine today's day of the week — this affects:
   - Which day-specific sections appear
   - Whether sermon prep check is needed (Thu–Sun)
10. Scan `inbox/` for any uncaptured items
11. Pull top 3 priorities — **distribute across roles** where possible:
    - At least 1 solopreneur task (always relevant)
    - 1 Bally's task if Arnold has flagged anything
    - 1 church task if it's a sermon prep day
    - If only solopreneur tasks exist, that's fine — don't force balance
12. Identify any flags or blockers from project context
13. Generate the briefing in the format above (starting after the Yesterday's Review section)
14. Include the static reminder to run the Reddit Scanner in the Community Engagement section
15. **Day-specific sections:**
    - **Monday:** Include `Regubrief Maintenance`. Otherwise omit.
    - **Wednesday:** Include `Blog — Shipped & Unfinished`. Otherwise omit.
    - **Thursday (preaching week):** Include `Thursday Sermon Prep Kickoff`. Otherwise omit.
    - **Friday:** Include `ChurchPromptDirectory Maintenance`. Otherwise omit.
16. **CRITICAL — Log today's top 3 immediately after writing them:**
    - The 3 tasks in `### Today's Top 3 Priorities` ARE the recommended tasks
    - Copy them **verbatim** (with role tags) into `memory/daily_briefing_log.md` as `## [Date] — Recommended for Today`
    - Do this right after generating the briefing — never skip this step
    - Tomorrow's Yesterday's Review will pull exactly these 3 task names
17. Offer to drill into any section if Arnold asks

## Notes

- Keep the briefing scannable — max 1–2 lines per item
- If context files are sparse, acknowledge gaps and ask Arnold to fill them in
- Do not invent tasks or priorities that aren't grounded in the context files
- **Bally's items are opt-in only** — only show what Arnold has explicitly shared. Never assume or fabricate Bally's tasks.
- **Church section is conditional** — only appears Thu–Sun on preaching weeks

## Memory Tracking

The daily briefing process maintains a log in `memory/daily_briefing_log.md`:

```markdown
# Daily Briefing Log

## [Date] — Completion Review
- ✅ Task 1 [Solopreneur] (completed)
- ❌ Task 2 [Bally's] (not completed — carry forward)
- ✅ Task 3 [Church] (completed)

**Notes:** [Any context Arnold adds]

---

## [Date] — Recommended for Today
- [Solopreneur] Task A
- [Bally's] Task B
- [Church] Task C
```

This creates a feedback loop:
1. **Yesterday:** Present what was recommended (across all roles)
2. **Today:** Record what was done
3. **Tomorrow:** Build on completed work and refocus

Arnold's completion data is logged to understand patterns, dependencies, and realistic capacity across all three vocations.
