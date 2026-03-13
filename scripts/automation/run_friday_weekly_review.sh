#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUN_DATE="$(date +%F)"

"$ROOT_DIR/run" weekly_review --date "$RUN_DATE" --non-interactive
