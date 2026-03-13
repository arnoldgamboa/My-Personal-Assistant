# Automation Setup (Hybrid, Markdown-First)

This folder contains schedule templates for recurring runs.

## Included Schedules

- Weekday morning run (`morning_routine`)
- Friday weekly run (`weekly_review`)

## Install (cron)

1. Open your crontab:
   - `crontab -e`
2. Copy entries from `automation/crontab.example`.
3. Save and verify:
   - `crontab -l`

## Output Artifacts

Each run writes:

- Run payload: `memory/logs/runs/<workflow>-<date>.json`
- Status payload: `memory/logs/status/status-<date>-<workflow>.json`

Status payload includes:

- `status`: success/failed
- `files_touched`
- `blockers`
