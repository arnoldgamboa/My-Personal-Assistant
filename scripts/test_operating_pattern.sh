#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/4] Daily run (weekday) dry-run"
OUT1="$(./run morning_routine --date 2026-03-16 --non-interactive --dry-run)"
echo "$OUT1" | rg -q '"workflow": "morning_routine"'
echo "$OUT1" | rg -q '"top_3": \['

echo "[2/4] Non-preaching week check (Friday in sermon window)"
OUT2="$(./run morning_routine --date 2026-03-13 --non-interactive --dry-run)"
echo "$OUT2" | rg -q '"is_preaching": false'
echo "$OUT2" | rg -q '"sermon_items_included": false'

echo "[3/4] Friday-specific sections + 14th sequence logic"
echo "$OUT2" | rg -q '"friday_items_expected": true'
echo "$OUT2" | rg -q '"sequence_note": "Deposit first, then pay UB/Citibank."'

echo "[4/4] Weekly review dry-run"
OUT3="$(./run weekly_review --date 2026-03-13 --non-interactive --dry-run)"
echo "$OUT3" | rg -q '"workflow": "weekly_review"'
echo "$OUT3" | rg -q '"preaching_status":'

echo "All operating pattern smoke tests passed."
