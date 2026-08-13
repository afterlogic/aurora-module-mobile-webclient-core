#!/bin/bash
# Discover modules/*/vue-mobile/test/e2e and run mobile Playwright suite.
# Usage (from this directory or install root via path):
#   ./run-e2e.sh
#   ./run-e2e.sh -- --setup "* iPhone13"
#   ./run-e2e.sh -- --ui --setup "MailMobileWebclient iPhone13"

set -uo pipefail

E2E_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$E2E_DIR/../../.." && pwd)"
SKIP_NPM_INSTALL="${SKIP_NPM_INSTALL:-0}"

echo "Scanning modules for vue-mobile/test/e2e/*.spec.js ..."
echo ""

found=0
for module_dir in "$ROOT"/modules/*; do
    [ -d "$module_dir" ] || continue
    module_name="$(basename "$module_dir")"
    e2e_dir="$module_dir/vue-mobile/test/e2e"
    if [ ! -d "$e2e_dir" ]; then
        continue
    fi
    spec_count="$(find "$e2e_dir" -maxdepth 1 -name '*.spec.js' 2>/dev/null | wc -l | tr -d ' ')"
    if [ "$spec_count" = "0" ]; then
        continue
    fi
    echo "[found] $module_name ($spec_count specs)"
    found=$((found + 1))
done

echo ""
if [ "$found" -eq 0 ]; then
    echo "No modules with vue-mobile/test/e2e/*.spec.js — nothing to run."
    exit 1
fi

if [ "$SKIP_NPM_INSTALL" != "1" ] && [ ! -d "$E2E_DIR/node_modules" ]; then
    (cd "$E2E_DIR" && npm ci) || exit 1
fi

cd "$E2E_DIR"
if [ "${1:-}" = "--" ]; then
    shift
fi
npm run test:e2e -- "$@"
