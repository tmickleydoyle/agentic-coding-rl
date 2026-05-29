# Next.js agentic coding tasks (~5-task seed set)

Hand-authored tasks for SFT cold-start and rejection-sampling RL on real multi-file
coding work, beyond MBPP single-functions. Each task is a directory:

```
<task_id>/
  description.md   # natural-language instruction the agent sees
  meta.json        # task_id, framework, difficulty, entry_point hint
  starter/         # initial state (what the agent starts from)
  tests/           # Vitest test files — the verifier
  reference/       # known-good solution (used to VALIDATE the task is well-formed)
```

Tests are **independent** Vitest files so a task can yield fractional reward
(`passed / total`), matching the existing Python reward shape.

## Quick start (local validation, no Docker needed)

```bash
cd data/nextjs
npm install                  # one-time, ~30s
bash validate.sh             # runs each task's reference against its own tests
```

`validate.sh` assembles `<task>/reference/` + `<task>/tests/` into a clean workdir and
runs vitest. A task is "valid" iff all of its tests pass on the reference solution.

## Component testability

All examples use **client components** (`'use client'` where relevant) so they're
directly testable with React + Vitest + jsdom — no Next.js server runtime needed for
the test loop. API-route tests call the handler function directly.

## Difficulty mix (this seed set)

| Task | Difficulty | What it tests |
|---|---|---|
| `counter-button` | easy | click handler + state |
| `controlled-input` | easy | controlled form input + display |
| `todo-list` | medium-simple | add/remove items, list rendering |
| `form-validation` | medium-simple | input validation + conditional error UI |
| `tab-component` | medium | multi-tab state + content switching |

Add more directories of the same shape to grow the set. The
`acrl/tasks/_nextjs.py` loader picks up all directories under `data/nextjs/` that
contain `description.md`, `meta.json`, `starter/`, `tests/`, and `reference/`.

## Archetypes (97 tasks)

Beyond the from-scratch UI seed, the set now spans four archetypes so the RL signal
covers the common shapes of coding work (modeled on SWE-bench / HumanEval / LeetCode):

| Prefix | Count | Archetype | What it tests |
|---|---|---|---|
| _(none)_ | 59 | from-scratch React/Next UI | components, hooks, context, multi-file composition |
| `fix-*` | 13 | **bug-fix (SWE-bench style)** | `starter/` is a buggy-but-compiling impl; description is a bug report; fix it so the canonical tests pass |
| `util-*` | 13 | pure-TS algorithms/utils | debounce, LRU cache, event emitter, deepEqual, memoize, binary search… (no React; `lib/*.ts`) |
| `api-*` | 12 | API route handlers | `app/api/<name>/route.ts` GET/POST/PUT/DELETE using Web `Request`/`Response` (no `next` dep); tested by calling handlers directly |

The 13 `fix-*` tasks are the SWE-bench-shaped ones: the agent starts from a broken
implementation plus a failing test suite and must locate and repair the defect, rather
than build from an empty stub.

### Validating one task

`validate.sh` runs the whole set. To validate a single task in an isolated workdir
(safe to run in parallel), use `validate_one.sh`:

```bash
bash validate_one.sh fix-cart-total /tmp/my_check
```
