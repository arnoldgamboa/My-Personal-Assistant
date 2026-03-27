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
   - `link` — A URL or resource to save
   - `decision` — Something decided OR to decide later
   - `note` — Reference info (person, project, context)
   - `feeling/state` — Energy level, stress, emotional flags
   - `long-form` — The entire raw text of a large dump
4. **Route** each item:
   - `task` → Add to Todoist via `node scripts/add_todoist.js`
   - `idea` → Create `inbox/ideas/YYYY-MM-DD-[slug].md` & append link to [[inbox/Ideas_Dashboard]]
   - `link` → Create `inbox/links/YYYY-MM-DD-[slug].md` & append link to [[inbox/Links_Dashboard]]
   - `long-form dump` → Create `inbox/dumps/YYYY-MM-DD-[slug].md` & append link to [[inbox/Brain_Dumps_Dashboard]]
   - `decision` → Append to [[memory/decisions]]
   - `note (person/project)` → Update [[context/people]] or [[context/projects]]
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

💡 Ideas (→ [[inbox/Ideas_Dashboard]])
- Created: [[inbox/ideas/[slug]\|[Title]]]

🔗 Links (→ [[inbox/Links_Dashboard]])
- Created: [[inbox/links/[slug]\|[Title]]]

🧠 Full Dumps (→ [[inbox/Brain_Dumps_Dashboard]])
- Created: [[inbox/dumps/[slug]\|[Title]]]

🔷 Decisions (→ [[memory/decisions]])
- [decision or deferred topic]

📝 Notes (→ [[context/people]] / [[context/projects]])
- [note with context]

🗂️ Parked (Unclear)
- [items in [[inbox/brain-dump]]]

⚡ State / Energy (noted, not filed)
- [any feelings or energy signals]
```

---

## Steps

1. Detect trigger phrase → identify dump type
2. Parse content into atoms
3. Classify each atom
4. Route to correct vault file:
   - **Ideas:** Create `inbox/ideas/YYYY-MM-DD-[slug].md` and update `Ideas_Dashboard.md`
   - **Links:** Create `inbox/links/YYYY-MM-DD-[slug].md` and update `Links_Dashboard.md`
   - **Long-form Dumps:** Create `inbox/dumps/YYYY-MM-DD-[slug].md` and update `Brain_Dumps_Dashboard.md`
   - **Decisions:** Append to `memory/decisions.md`
   - **Tasks:** Add to Todoist
   - **Unclear:** Park in `inbox/brain-dump.md`
5. Output the capture summary

---

## Notes

- Speed is the priority — capture everything first, perfect routing second
- Never discard. If unsure → park in [[inbox/brain-dump]]
- For `Meeting notes:` dumps — always extract action items as tasks and people mentioned as potential contacts
- For `Here's everything:` dumps — also acknowledge any stress/overwhelm signals before routing
- For `Decide later:` dumps — create a dated entry in [[memory/decisions]] marked as `⏳ PENDING`
