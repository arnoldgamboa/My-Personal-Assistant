#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUN_DATE="$(TZ=Asia/Manila date +%F)"

"$ROOT_DIR/run" weekend_brief --date "$RUN_DATE" --non-interactive --format telegram
