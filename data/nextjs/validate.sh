#!/usr/bin/env bash
# Validate the Next.js task dataset: for each task, assemble reference + tests + the
# shared vitest config/setup into a clean workdir and run vitest. A task is valid
# iff its reference passes all its tests.
#
# Prereqs (one-time): cd data/nextjs && npm install
set -uo pipefail
cd "$(dirname "$0")"

WORK=/tmp/_acrl_run
ROOT="$(pwd)"
results=()
total=0; passed=0

for task in */; do
    task="${task%/}"
    [ -d "$task/tests" ] && [ -d "$task/reference" ] || continue
    total=$((total+1))
    echo "=== $task ==="
    rm -rf "$WORK"
    mkdir -p "$WORK"
    cp -r "$task/reference/." "$WORK/"
    cp -r "$task/tests"        "$WORK/tests"
    # Make the shared vitest config + setup discoverable as if local to the workdir.
    cp "$ROOT/vitest.config.ts" "$WORK/vitest.config.ts"
    cp "$ROOT/vitest.setup.ts"  "$WORK/vitest.setup.ts"
    cp "$ROOT/tsconfig.json"    "$WORK/tsconfig.json"
    cp "$ROOT/package.json"     "$WORK/package.json"
    ln -sf "$ROOT/node_modules" "$WORK/node_modules"
    if (cd "$WORK" && npx vitest run --silent >/dev/null 2>&1); then
        echo "  PASS"
        passed=$((passed+1))
        results+=("PASS  $task")
    else
        echo "  FAIL — re-running with output:"
        (cd "$WORK" && npx vitest run 2>&1 | tail -15)
        results+=("FAIL  $task")
    fi
done
rm -rf "$WORK"

echo
echo "============================================"
printf '%s\n' "${results[@]}"
echo "============================================"
echo "Result: $passed / $total tasks valid (reference passes its own tests)"
[ "$passed" -eq "$total" ] || exit 1
