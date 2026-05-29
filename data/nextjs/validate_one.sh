#!/usr/bin/env bash
# Validate a SINGLE task: assemble its reference + tests + shared config into an
# isolated workdir and run vitest. Unlike validate.sh (one shared /tmp dir), this
# takes a per-invocation workdir so many tasks can be validated in parallel.
#
#   bash validate_one.sh <task> [workdir]
#
# Exit 0 iff the reference passes all of the task's tests.
set -uo pipefail
cd "$(dirname "$0")"
ROOT="$(pwd)"

task="${1:?usage: validate_one.sh <task> [workdir]}"
task="${task%/}"
WORK="${2:-/tmp/_acrl_one_$task}"

[ -d "$task/tests" ] && [ -d "$task/reference" ] || { echo "MISSING tests/ or reference/ for $task"; exit 2; }

rm -rf "$WORK"; mkdir -p "$WORK"
cp -r "$task/reference/." "$WORK/"
cp -r "$task/tests"        "$WORK/tests"
cp "$ROOT/vitest.config.ts" "$WORK/vitest.config.ts"
cp "$ROOT/vitest.setup.ts"  "$WORK/vitest.setup.ts"
cp "$ROOT/tsconfig.json"    "$WORK/tsconfig.json"
cp "$ROOT/package.json"     "$WORK/package.json"
ln -sf "$ROOT/node_modules" "$WORK/node_modules"

echo "=== $task (workdir $WORK) ==="
if (cd "$WORK" && npx vitest run 2>&1 | tail -25); then
    status=0
else
    status=1
fi
rm -rf "$WORK"
exit $status
