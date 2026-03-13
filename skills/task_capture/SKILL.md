---
name: Task Capture
description: Quickly captures tasks, ideas, decisions, and action items — triages them and routes them to the right place in the system.
---

# Task Capture Skill

Captures free-form input (tasks, ideas, action items) and triages them into the right place.

## When to Use

- Arnold rattles off a list of things to do ("capture these...", "add to my list...")
- At the end of a meeting or conversation ("capture action items")
- During a brain dump or idea session

## Inputs

- Raw text, bullet points, or voice-style dumps from Arnold
- Optional: context tag (project name, date, priority)

## Processing Rules

1. **Parse** — Extract individual items from the raw input
2. **Classify** each item as:
   - `task` — Something to be done
   - `idea` — A concept to explore later
   - `decision` — A decision that was made
   - `note` — A reference item or piece of information
   - `reminder` — Time-sensitive item
3. **Route** — Place in the appropriate location:
   - `task` → Add to `context/projects.md` under the relevant project, or flag as standalone
   - `idea` → Append to `memory/learnings.md`
   - `decision` → Append to `memory/decisions.md`
   - `note` → Append to relevant context file or `inbox/`
   - `reminder` → Note with date/time and flag for Arnold to schedule

## Output Format

After capturing, report back:

```
### ✅ Captured [N] items

**Tasks (→ Projects or Standalone)**
- [ ] [Task description] [→ Project: X if applicable]

**Ideas (→ memory/learnings.md)**
- 💡 [Idea]

**Decisions (→ memory/decisions.md)**
- 🔷 [Decision with context]

**Reminders**
- ⏰ [Reminder] (Due: [date/time if mentioned])

**Notes**
- 📝 [Note]
```

## Steps

1. Receive the raw input from Arnold
2. Parse and classify each item
3. Write tasks to `context/projects.md` or the relevant file
4. Append decisions to `memory/decisions.md`
5. Append ideas/learnings to `memory/learnings.md`
6. Park unroutable items in `inbox/`
7. Report back the capture summary

### Deterministic Run Option

- Preferred non-interactive command:
  - `./run task_capture --date YYYY-MM-DD --non-interactive --input "<multiline items>"`
- Alternative:
  - `./run task_capture --date YYYY-MM-DD --non-interactive --input-file <path>`

## Notes

- Never silently discard items — if unsure where to route, park in `inbox/` and flag
- If Arnold provides a project name, route tasks there; else ask if it's not clear
- For batches of 5+ items, confirm before writing to avoid overload
