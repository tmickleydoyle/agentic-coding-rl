> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Step Tracker app

Build a small multi-route daily step-tracking app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

## Types — `lib/types.ts`
- `StepEntry = { id: string; date: string; steps: number }`
- `Route = 'today' | 'history' | 'goals' | 'stats'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/StepProvider.tsx`
Context provider + `useStep()` hook that throws if used outside the provider. Exposes:
- `entries: StepEntry[]`, `goal: number`, `theme`, `route`, `today: string`
- `logSteps({ date, steps })` — **upsert**: if an entry exists for `date`, replace its
  steps; otherwise append a new entry (fresh id `s4`, `s5`, …)
- `removeEntry(id)`, `setGoal(value)`, `setTheme`, `navigate`

Seed entries: `s1` 2026-05-25 12000, `s2` 2026-05-26 8000, `s3` 2026-05-27 11000.
`goal` is `10000`. `today` is `'2026-05-28'`. The first newly-created entry gets id `s4`.

## Helper — `hooks/useStepStats.ts`
- `sortedDesc(entries)` — most-recent-first by date.
- `computeStreak(entries, goal)` — consecutive most-recent days (by date order) that met
  the goal (`steps >= goal`), stopping at the first miss.
- `weeklyTotal` (sum of steps), `weeklyAverage` (rounded total/count, 0 if empty).
- `useStepStats()` returns `{ streak, total, average, daysMetGoal, sorted }`.

For the seed: streak `1` (05-27 met, 05-26 missed), total `31000`, average `10333`,
daysMetGoal `2`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<StepProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-today | nav-history | nav-goals | nav-stats`.
Current route's button has `aria-current="page"`.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Shows `today-date`, `today-steps` (steps logged for today, 0 if none), `today-goal`,
`today-percent` (min(100, round(steps/goal*100))), and `today-met` (`data-met`). A
`<form data-testid="log-form">` with `steps-input` and `submit-steps`: invalid/blank/
negative → `<p data-testid="form-error">` and stay; otherwise `logSteps({ date: today, … })`.

### `app/history/page.tsx` — `data-testid="page-history"`
`entry-list` of `EntryRow`s sorted most-recent-first; empty → `<p data-testid="empty-state">`.

### `app/goals/page.tsx` — `data-testid="page-goals"`
`current-goal` and a `<form data-testid="goal-form">` with `goal-input` and `submit-goal`.
Non-positive/invalid → `<p data-testid="form-error">`; otherwise `setGoal`.

### `app/stats/page.tsx` — `data-testid="page-stats"`
StatCards `stat-streak-value`, `stat-total-value`, `stat-average-value`, `stat-met-value`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/EntryRow.tsx` — `<li data-testid="entry-<id>" data-met="true|false">` with
  `entry-<id>-date`, `entry-<id>-steps`, and a `remove-<id>` button.

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/steps/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ entries, goal }`.
- **POST** — body `{ date, steps }`. Upsert by date. 201 with the entry. Blank date → 400
  `{ error: "date required" }`; bad steps → 400 `{ error: "steps invalid" }`. New ids `s4`, …
- **PUT** — body `{ goal }` → `{ goal }`. Non-positive/invalid → 400 `{ error: "goal invalid" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
