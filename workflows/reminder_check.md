---
description: Reminder check workflow — surfaces only near-due reminders without including them in the daily brief
---

# Reminder Check Workflow

Use this when you want private reminders to surface only as the due date approaches.

## Deterministic Run Option

- Preferred non-interactive command:
  - `./run reminder_check --date YYYY-MM-DD --non-interactive`
- Output artifacts:
  - `memory/logs/runs/reminder_check-YYYY-MM-DD.json`
  - `memory/logs/status/status-YYYY-MM-DD-reminder_check.json`

## Rules

- Source of truth: `memory/reminders.md`
- Include reminders that are due in 2 days or less
- Include overdue reminders as well
- Do not surface these items in the main daily brief unless explicitly requested later

## Current Use

- `ChatGPT Plus` renewal decision due `2026-04-09`
