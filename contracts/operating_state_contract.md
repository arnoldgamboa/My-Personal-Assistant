# Operating State Contract (v1)

This contract defines the canonical markdown-first operating state for the PA system.

## Canonical Sources

- `context/` and `memory/` are the only sources of truth.
- Workflow outputs are persisted under `memory/logs/runs/`.
- Current computed state is written to `memory/state/operating_state.json`.

## Required State Fields

### Daily (`morning_routine`)

- `active_priorities` (exactly 3)
- `carryovers` (incomplete tasks from prior completion reviews)
- `preaching_override` (`is_preaching`, `upcoming_sunday`)
- `due_payments` (today/tomorrow/3-day window plus high-stake reminders)

### Weekly (`weekly_review`)

- `wins`
- `misses`
- `next_week_priorities`
- `preaching_status`

## Log and Update Rules

- `memory/logs/` is append-oriented; each run writes a new artifact.
- `memory/daily_briefing_log.md` must contain only one `Recommended for Today` section per date.
- Context files are not bulk-rewritten by runners.
- Status artifacts are written to `memory/logs/status/` as:
  - `status` (`success` or `failed`)
  - `files_touched`
  - `blockers`

## Runner Interface

- `run <workflow_name> --date YYYY-MM-DD --non-interactive`
- Supported workflows:
  - `morning_routine`
  - `weekly_review`
  - `task_capture`
- Optional flags:
  - `--dry-run`
  - `--input` / `--input-file` (task capture only)
