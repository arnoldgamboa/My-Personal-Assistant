---
name: Brain Dump
description: Captures unstructured thoughts, ideas, meeting notes, and deferred decisions from Arnold's trigger phrases, processes them, and routes each item to the right place in the Obsidian vault.
---

# Brain Dump Skill

Clears Arnold's head and gets everything into the system — fast, zero friction.

## When to Use

Triggered automatically when Arnold uses any of these opening phrases:

| Trigger Phrase | Type | Description |
|---|---|---|
| `Brain dump: ...` | Raw Thoughts | Random, unfiltered thoughts |
| `Idea: ...` | Work Idea | A concept or project suggestion to explore |
| `Meeting notes: ...` | Meeting Notes | Capture what happened and any actions |
| `Decide later: ...` | Deferred Decision | Topics to revisit — not urgent but don't lose them |
| `Here's everything: ...` | Full Dump | Emotional/cognitive dump — extract and triage everything |

---

## Processing Rules

When any trigger phrase is detected:

1. **Identify the type** using the trigger phrase table above
2. **Parse** the content into individual atoms (one thought = one item)
3. **Classify** each atom:
   - `task` — Something actionable
   - `idea` — Concept to explore
   - `decision` — Something decided OR to decide later
   - `note` — Reference info (person, project, context)
   - `feeling/state` — Energy level, stress, emotional flags (e.g., "feeling swamped")
4. **Route** each item:
   - `task` → Add to Todoist via `node scripts/add_todoist.js` (preferred) OR flag for Arnold to add
   - `idea` → Append to [[memory/learnings]] in the Obsidian vault
   - `decision` → Append to [[memory/decisions]] in the Obsidian vault
   - `note (person)` → Check [[context/people]] — update if person exists, or flag for new page
   - `note (project)` → Update [[context/projects]] or relevant project page
   - `feeling/state` → Note in output only; do not write to vault unless Arnold asks
   - **Unclear items** → Park in [[inbox/brain-dump]] with date stamp

---

## Obsidian Vault Notes

- All file references use `[[WikiLink]]` format for vault interlinking
- New entries are appended, never overwritten
- Meeting notes may warrant their own page at `memory/logs/YYYY-MM-DD-meeting-[slug].md`
- Entries in `inbox/brain-dump.md` should be reviewed and triaged during the weekly review

---

## Output Format

After processing, always respond with this summary:

```
### 🧠 Brain Dump Captured — [Date]

**Type:** [Raw Thoughts / Work Idea / Meeting Notes / Deferred Decision / Full Dump]

**Processed [N] items:**

🔲 Tasks (→ Todoist or Projects)
- [ ] [task] [→ Project: X if known]

💡 Ideas (→ [[memory/learnings]])
- [idea]

🔷 Decisions / Decide Later (→ [[memory/decisions]])
- [decision or deferred topic]

📝 Notes (→ [[context/people]] / [[context/projects]])
- [note with context]

🗂️ Parked in [[inbox/brain-dump]]
- [items that need more context before routing]

⚡ State / Energy (noted, not filed)
- [any feelings or energy signals]
```

---

## Steps

1. Detect trigger phrase → identify dump type
2. Parse content into atoms
3. Classify each atom
4. Route to correct vault file:
   - Append to `memory/learnings.md` for ideas
   - Append to `memory/decisions.md` for decisions
   - Update `context/projects.md` or `context/people.md` for notes
   - Add to Todoist for tasks (via `add_todoist.js`)
   - Park in `inbox/brain-dump.md` for unclear items
5. Output the capture summary

---

## Notes

- Speed is the priority — capture everything first, perfect routing second
- Never discard. If unsure → park in [[inbox/brain-dump]]
- For `Meeting notes:` dumps — always extract action items as tasks and people mentioned as potential contacts
- For `Here's everything:` dumps — also acknowledge any stress/overwhelm signals before routing
- For `Decide later:` dumps — create a dated entry in [[memory/decisions]] marked as `⏳ PENDING`
