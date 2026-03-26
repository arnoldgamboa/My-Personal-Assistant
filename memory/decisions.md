# Decisions Log

> This file captures important decisions made by Arnold — what was decided, why, and when.
> The PA reads this to maintain continuity across sessions.

---

## Format

```
### [Decision Title]
**Date:** [YYYY-MM-DD]
**Context:** [What situation led to this decision]
**Decision:** [What was decided]
**Rationale:** [Why this choice was made]
**Impact:** [What this affects]
```

---

## 2026

<!-- Append decisions chronologically -->

### Adopt Markdown-First Deterministic Runner
**Date:** 2026-03-13
**Context:** The PA needed predictable, non-interactive execution for morning routine, weekly review, and task capture while keeping markdown files as source of truth.
**Decision:** Implement `run <workflow_name> --date YYYY-MM-DD --non-interactive` with structured run artifacts, status files, and operating state contract.
**Rationale:** Improves reliability, enforces one daily top-3 section per date, and supports automation without requiring Todoist as the primary task system.
**Impact:** Daily and weekly operating loops are now scriptable, testable, and easier to automate.

### Designate PA Filesystem as Obsidian Vault
**Date:** 2026-03-26
**Context:** Needed a human-friendly interface to manage, view, and interlink the PA's markdown-based memory and context.
**Decision:** The PA root folder is officially designated and managed as an Obsidian Vault.
**Rationale:** Obsidian provides a rich graph view, quick navigation, and bidirectional linking over the existing markdown files without breaking any AI capabilities.
**Impact:** AI will now format and refer to this workspace as an Obsidian Vault, utilizing `[[WikiLinks]]` format where useful and treating new files as new network nodes.

### Ditch OpenClaw
**Date:** 2026-03-26
**Context:** Brain dump reflection on PA interface and tooling.
**Decision:** Ditch OpenClaw completely and stick with the raw Personal Assistant AI.
**Rationale:** Simpler to use the raw AI approach, especially with potential alternatives like a Telegram bot interface.
**Impact:** Discontinue use of OpenClaw; future interface efforts may pivot to Claude Code's Telegram implementation.
