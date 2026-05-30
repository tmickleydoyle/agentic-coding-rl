# Habit Routine app

Build a small multi-route morning/evening routine tracker. Routing is **in-app** (React
state — no `next` imports anywhere). Four routes, a shared Context, and an API route handler
backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

A fixed `TODAY = '2026-05-28'` constant is used (no real clock).

## Types — `lib/types.ts`
- `Step = { id: string; label: string; done: boolean }`
- `RoutineKind = 'morning' | 'evening'`
- `Routine = { id: string; name: string; kind: RoutineKind; steps: Step[]; history: string[] }`
  where `history` is the dates the routine was fully completed.
- `Route = 'today' | 'routines' | 'builder' | 'stats'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/RoutineProvider.tsx`
Context provider + `useRoutine()` hook that throws if used outside the provider. Exposes:
- `routines: Routine[]`, `theme`, `route`, `today: string`
- `toggleStep(routineId, stepId)` — flip that step's `done`. After flipping, if **all** the
  routine's steps are now done, add `today` to its `history` (no duplicates); if not all done,
  remove `today` from its `history`.
- `addRoutine({ name, kind })` — append a routine (fresh id `r3`, `r4`, …) with NO steps and
  empty history. Blank name ignored.
- `addStep(routineId, label)` — append a step `{ id: '<routineId>-s<n>', label, done: false }`
  to that routine (n continues from the routine's current step count + 1). Blank label ignored.
- `removeRoutine(id)`, `setTheme`, `navigate`

Seed routines (`today` is `'2026-05-28'`):
- `r1` "Morning" kind `morning`, history `['2026-05-26','2026-05-27']`, steps:
  `r1-s1` "Stretch" done, `r1-s2` "Water" done, `r1-s3` "Plan day" not done.
- `r2` "Evening" kind `evening`, history `['2026-05-27']`, steps:
  `r2-s1` "Journal" done, `r2-s2` "Read" done.
The first newly-created routine gets id `r3`.

## Helper — `hooks/useRoutineStats.ts`
- `isComplete(routine)` — has steps AND all are done.
- `completedToday(routine, today)` — `history` includes `today`.
- `routineStreak(routine, today)` — consecutive days the routine was completed, ending at
  `today` (or the day before if not completed today). Stop at the first gap.
- `useRoutineStats()` returns `{ total, completedToday, longestStreak }` where
  `completedToday` counts routines whose history includes today, and `longestStreak` is the
  max `routineStreak` across routines.

For the seed: r1 is NOT complete (2/3 done) and not in today's history; r2 IS complete (2/2)
but its history is `['2026-05-27']` (today not added). So `completedToday` = 0,
`total` = 2. Streaks: r1 history 05-26,05-27 → not today, yesterday 05-27 present →
streak 2; r2 history 05-27 → yesterday present → streak 1. `longestStreak` = 2.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<RoutineProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-today | nav-routines | nav-builder | nav-stats`.
Current route's button has `aria-current="page"`.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Shows `today-date` and `today-completed` (count of routines completed today). A
`routine-board` listing each routine as `<div data-testid="routine-<id>"
data-complete="true|false">` with `routine-<id>-name`, a `step-list`, and each step as
`<li data-testid="step-<stepId>" data-done>` with a `toggle-<stepId>` button. Empty routines
→ `<p data-testid="empty-state">`.

### `app/routines/page.tsx` — `data-testid="page-routines"`
`routine-manage-list` of each routine with `manage-<id>-name`, `manage-<id>-kind`,
`manage-<id>-steps` (step count), `manage-<id>-streak`, and a `delete-<id>` button.
Empty → `<p data-testid="empty-state">`.

### `app/builder/page.tsx` — `data-testid="page-builder"`
A `<form data-testid="routine-form">` with `name-input`, a `kind-select` (`<select>` with
`morning`/`evening` options, default `morning`), and `submit-routine`: blank name →
`<p data-testid="form-error">` and stay; otherwise `addRoutine`, clear, and navigate to
`routines`.

### `app/stats/page.tsx` — `data-testid="page-stats"`
StatCards `stat-total-value`, `stat-completed-value`, `stat-streak-value`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/RoutineCard.tsx` — used on the today board: renders the routine container,
  name, and the step list with toggle buttons (props: `routine`, `complete`, `onToggle`).

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/routines/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON sets `content-type: application/json`.
- **GET** — `{ routines }`.
- **POST** — body `{ name, kind }`. 201 with the new routine (no steps, id `r3`, …, kind
  defaults to `morning` if not `'morning'`/`'evening'`). Blank name → 400
  `{ error: "name required" }`.
- **PUT** — body `{ routineId, stepId }`. Toggle that step; recompute today's completion in
  history (using TODAY). 200 with the routine. Unknown routine → 404
  `{ error: "routine not found" }`. Unknown step → 404 `{ error: "step not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
