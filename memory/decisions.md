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
