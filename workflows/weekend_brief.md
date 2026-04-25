---
description: Weekend brief workflow — lighter, church-aware, and forward-looking for the week ahead
---

# Weekend Brief Workflow

Run this on Saturday or Sunday to get a lightweight view of the weekend and the week ahead.

## Deterministic Run Option

- Preferred non-interactive command:
  - `./run weekend_brief --date YYYY-MM-DD --non-interactive --format telegram`
- Output artifacts:
  - `memory/logs/runs/weekend_brief-YYYY-MM-DD.json`

## Rules

- Source of truth: Todoist for next-week priorities, church context for sermon status
- Keep it light — no heavy task lists or deep dives
- Focus on:
  1. Weekend focus (church, rest, 1-2 carryovers max)
  2. Sermon status if preaching this Sunday
  3. Top 3 priorities for the upcoming week
  4. Rest reminder
  5. Optional quick win if energy permits
