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
6. `context/finances.md` — monthly bills and payment schedule
7. `memory/decisions.md` — recent decisions for continuity
8. `memory/arwenhq_mvp_checklist.md` — ArwenHQ pre-launch checklist (surface 1–2 open items daily)
9. `memory/daily_briefing_log.md` — yesterday's recommended items (for review section)
10. `inbox/` — any uncaptured or unprocessed items

Use the current system date/time as the date reference. Never fabricate a date.

---

## Steps

### Phase 1: Yesterday's Review (Completion Tracking)

**Before doing anything else, determine session type:**

1. Compute yesterday's date (e.g. if today is 2026-03-14, yesterday is 2026-03-13)
2. Read `memory/daily_briefing_log.md` and look for an entry with yesterday's date key: `## YYYY-MM-DD`
3. Apply this decision tree:

   **A. No entry for yesterday exists** → Skip Phase 1. Proceed to Phase 2.

   **B. Yesterday's entry exists, but has no `### Completion Review` block** → Run Phase 1:
      - Extract the tasks listed under yesterday's `### Recommended` block
      - Use `AskUserQuestion` with `multiSelect: true`:
        - `question`: "Which of yesterday's recommended tasks did you complete?"
        - `header`: "Yesterday"
        - Each `option.label` = exact task name from the log
        - Each `option.description` = role + project + one-line reason it mattered
      - Wait for Arnold's response
      - Add a `### Completion Review` block to yesterday's date entry in the log:
        - ✅ for each selected task
        - ❌ for each unselected task
      - Any ❌ tasks carry forward into today's `### Flags & Blockers` as "Carried over from [date]"

   **C. Yesterday's entry exists AND already has a `### Completion Review` block** → Skip Phase 1. Already done. Any ❌ tasks from that review still carry forward into today's Flags & Blockers.

---

### Phase 2: Today's Briefing (Generation)

4. Read all input context files listed in the Inputs section
5. Identify today's date and day of the week
6. Determine which day-specific sections apply (see Day-Specific Sections below)
7. Scan `inbox/` for any uncaptured items
8. Pull top 3 priorities — distribute across roles where possible:
   - At least 1 solopreneur task (always relevant)
   - 1 Bally's task if Arnold has flagged anything
   - 1 church task if it's a sermon prep day (Thu–Sun, preaching week)
   - If only solopreneur tasks exist, that's fine — don't force balance
9. Check `context/finances.md` — surface any payments due today, tomorrow, or within 3 days
10. Generate the briefing using the Output Format below

---

### Phase 3: Log Today's Recommended Tasks

**This step is critical. Run it immediately after generating the briefing.**

11. Look for an existing entry in `memory/daily_briefing_log.md` with today's date key: `## YYYY-MM-DD`
    - **If no entry for today exists** → Append a new date entry using the log format below
    - **If an entry for today already exists** → Update (replace) the `### Recommended` block within that entry with today's Top 3. Do not duplicate. Do not add a new date block.
12. The 3 tasks in `### Today's Top 3 Priorities` ARE the recommended tasks — copy them verbatim (with role tags)

---

## Output Format

```
## Daily Briefing — [Day, Month Date, Year]

### Today's Schedule

| Time Block | Role | Focus |
|------------|------|-------|
| 8AM–1PM | Solopreneur | [Key tasks] |
| 1PM–8PM | Bally's | [Key tasks/meetings] |
| Evening | Church/Personal | [Sermon prep if applicable, or "—"] |

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
*(Only show if Thursday–Sunday AND Arnold is preaching this week)*
- Thursday: "Sermon prep begins — what passage/topic?" (if not started)
- Friday: "Continue sermon development — outline and illustrations"
- Saturday: "Finalize sermon draft"
- Sunday: "Deliver day — quick review if needed"
*(If not preaching this week, or Mon–Wed: omit this section entirely)*

### Active Projects — Quick Status (Solopreneur)
- **[Project Name]:** [One-line status / what's next]

### Community Engagement
- Reminder: Run `skills/reddit_scanning/SKILL.md` to find 5 high-value posts to engage with today

### Inbox
- [N items pending capture/triage] or "(Inbox clear)"

### Flags & Blockers
- [Anything that needs attention or is at risk — across all roles]
- [Carried-over items from yesterday marked with ❌]

### 💳 Bills & Payments
*(Only include if something is due today, tomorrow, or within 3 days. Omit entirely otherwise.)*
- 🔴 **Due today:** [Payment name] — ₱[amount if known]
- ⚠️ **Due tomorrow:** [Payment name] — ₱[amount if known]
- 📅 **Due in [N] days:** [Payment name] — ₱[amount if known]

Rules:
- 14th of month: Show RCBC deposit + UB/Citibank as a linked sequence ("Deposit first, then pay"). Also flag: Submit Phone/Medicine Expense (Bally's)
- 10th of month: Flag Submit Liquidation Expense (Bally's)
- AXA and domain renewal: Flag 5 days in advance
- Weekend rule: If due date falls on Saturday/Sunday, flag it the Friday before as "Due [Monday] — process today if needed"

### [Day-Specific Sections — see below]

### Focus Suggestion
[One actionable suggestion based on goals, priorities, and which role needs the most attention today]

### ArwenHQ MVP — Daily Nudge
- Surface 1–2 open checklist items from `memory/arwenhq_mvp_checklist.md` that haven't been touched recently
- Prompt: "What did you work on in ArwenHQ yesterday? Want to update the checklist?"
```

---

## Day-Specific Sections

Include only the section(s) that match today's day. Omit all others entirely.

| Day | Section | Content |
|-----|---------|---------|
| Monday | **Regubrief Maintenance** | "Regubrief day. Time to curate and send this week's GDPR enforcement actions." |
| Monday | **LifeCity — Monday Tasks** | "Send Manny GCash — ₱700 (LifeCity)" |
| Tuesday | **LifeCity — Tuesday Task** | "Send Song List to Music Team for this Sunday's worship set." |
| Wednesday | **Blog — Shipped & Unfinished** | "Blog day. What did you build or decide this week that's worth writing about? Run `skills/blog_writing/SKILL.md` to draft a post." |
| Thursday (preaching week only) | **Sermon Prep Kickoff** | "Sermon prep day. Run `skills/sermon_prep/SKILL.md` or `workflows/sermon_prep.md` to start. What passage are you preaching from?" |
| Friday | **ChurchPromptDirectory Maintenance** | "ChurchPromptDirectory day. Write and publish a new article for church leaders." |
| Friday | **Bally's — Friday Evening** | "Work on Tempo tonight (Bally's)." |

---

## Memory: Log Format

The log file `memory/daily_briefing_log.md` uses one entry per date. This is strictly enforced — never create two entries for the same date.

```markdown
## YYYY-MM-DD (Weekday)

### Recommended
1. [Role] Task name
2. [Role] Task name
3. [Role] Task name

### Completion Review
- ✅ Task name [Role]
- ❌ Task name [Role] — carry forward
```

**Rules:**
- One `## YYYY-MM-DD` block per date — never duplicate
- `### Recommended` is written at the end of Phase 3 and may be updated (replaced) if the brief is re-run the same day
- `### Completion Review` is written once during Phase 1 of the next day's brief — never rewritten
- If Phase 1 is skipped (no yesterday entry, or review already done), no new `### Completion Review` block is created
- Append new date entries at the bottom of the file

---

## Notes

- Keep the briefing scannable — max 1–2 lines per item
- If context files are sparse, acknowledge gaps and ask Arnold to fill them in
- Do not invent tasks or priorities that aren't grounded in the context files
- **Bally's items are opt-in only** — only show what Arnold has explicitly shared. Never assume or fabricate Bally's tasks.
- **Church section is conditional** — only appears Thu–Sun on preaching weeks
- **Same-day re-runs:** If the brief is run again on the same day, skip Phase 1 entirely (completion review can only happen once per day, the next morning). Update the `### Recommended` block in today's log entry with the latest Top 3.
