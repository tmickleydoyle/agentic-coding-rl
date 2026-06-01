> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Workout Log app

Build a small multi-route workout-logging app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `ExerciseSet = { reps: number; weight: number }`
- `LoggedExercise = { exerciseId: string; sets: ExerciseSet[] }`
- `Workout = { id: string; date: string; name: string; exercises: LoggedExercise[] }`
- `Exercise = { id: string; name: string; muscle: string }`
- `Route = 'log' | 'workout-detail' | 'exercises' | 'records'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/WorkoutProvider.tsx`
A React Context provider holding the whole client app state, plus a `useWorkout()` hook
that throws if used outside the provider. It exposes:

- `workouts: Workout[]`, `exercises: Exercise[]`, `theme: Theme`, `route: Route`,
  `selectedWorkoutId: string | null`
- `addWorkout({ name, date, exercises })` — appends a new `Workout` (fresh id like `w3`, `w4`)
- `removeWorkout(id)` — drops the workout (and clears selection if it was selected)
- `setTheme`, `navigate(route)`
- `openWorkout(id)` — selects the workout and navigates to `workout-detail`

Seed exercises (`e1` Bench Press/Chest, `e2` Squat/Legs, `e3` Deadlift/Back) and two
workouts: `w1` "Push Day" 2026-05-01 (e1: two sets 8×100); `w2` "Leg Day" 2026-05-03
(e2: sets 5×140, 5×150). The first added workout gets id `w3`.

## Helper — `hooks/useStats.ts`
`personalRecords(workouts)` → record (best single-set weight) per exercise id.
`computeStats(workouts)` → `{ totalWorkouts, totalSets, totalVolume }` where volume is
sum of reps×weight over all sets. `useStats()` returns `{ records, stats, exerciseById }`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<WorkoutProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` that
shows the active page based on `route`. Starts on `log`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-log | nav-workout-detail |
nav-exercises | nav-records`. The current route's button has `aria-current="page"`.

## Pages
### `app/log/page.tsx` — `data-testid="page-log"`
`<form data-testid="log-form">` with `name-input`, `date-input` (type date),
`exercise-select` (one option per exercise), `reps-input`, `weight-input`, and
`submit-workout`. On submit: blank name → `<p data-testid="form-error">` and stay.
Otherwise add a workout with one logged exercise (one set from reps/weight) and clear the
name. Below the form, the workout list: each row `<li data-testid="workout-<id>">` with
`workout-<id>-name`, `workout-<id>-date`, `workout-<id>-sets` (total set count),
`open-<id>` and `remove-<id>` buttons. Empty → `<p data-testid="empty-state">` and no list.

### `app/workout-detail/page.tsx` — `data-testid="page-workout-detail"`
Shows the selected workout. If none selected, `<p data-testid="no-selection">`. Otherwise
`detail-name`, `detail-date`, and `detail-exercises` list with per-exercise
`detail-exercise-<id>-name` and `detail-exercise-<id>-sets` (set count). A `back-to-log`
button navigates to `log`.

### `app/exercises/page.tsx` — `data-testid="page-exercises"`
`exercise-list` with each `exercise-<id>-name` and `exercise-<id>-muscle`.

### `app/records/page.tsx` — `data-testid="page-records"`
StatCards `stat-workouts-value`, `stat-sets-value`, `stat-volume-value`. Then
`record-list` with each `record-<id>-name` and `record-<id>-value` (personal record).

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/WorkoutRow.tsx` — one workout row (see Log page).

## API — separate in-memory store
`lib/store.ts` holds its own seed data plus `__reset()`.

### `app/api/workouts/route.ts`
Web `Request`/`Response`; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ workouts }`. `?id=<id>` → that workout or 404. `?record=<exerciseId>` →
  `{ exerciseId, record }` (best weight for that exercise).
- **POST** — body `{ name, date?, exercises? }`. 201 with the created workout. Blank name →
  400 `{ error: "name required" }`. New ids continue `w3`, `w4`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
