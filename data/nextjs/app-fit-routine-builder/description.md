# Routine Builder app

Build a small multi-route workout-routine builder. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

## Types — `lib/types.ts`
- `Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'`
- `LibraryExercise = { id: string; name: string; muscle: string }`
- `Routine = { id: string; name: string; exerciseIds: string[]; day: Weekday | null }`
- `Route = 'routines' | 'builder' | 'week-plan' | 'library'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/RoutineProvider.tsx`
Context provider + `useRoutine()` hook that throws if used outside the provider. Exposes:
- `routines: Routine[]`, `library: LibraryExercise[]`, `theme`, `route`, `today: Weekday`
- `addRoutine({ name, exerciseIds })` — appends a `Routine` (`day: null`, fresh id `r4`, `r5`)
- `removeRoutine(id)`, `assignDay(id, day)` (set the weekday or null), `setTheme`, `navigate`

Seed library: `x1` Push Up/Chest, `x2` Pull Up/Back, `x3` Air Squat/Legs, `x4` Plank/Core.
Seed routines: `r1` Upper Body [x1,x2] mon; `r2` Lower Body [x3] wed; `r3` Core Blast [x4]
day null. `today` is `'mon'`. The first added routine gets id `r4`.

## Helper — `hooks/useWeek.ts`
`WEEKDAYS` array. `planByDay(routines)` → `Record<Weekday, Routine[]>` (null-day excluded).
`useWeek()` returns `{ byDay, todaysRoutines, exerciseById, assignedCount }`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<RoutineProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>`
with `<NavBar/>` and `<main data-testid="page-content">`. Starts on `routines`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-routines | nav-builder | nav-week-plan |
nav-library`. Current route's button has `aria-current="page"`.

## Pages
### `app/routines/page.tsx` — `data-testid="page-routines"`
`routine-list` of `RoutineCard`s; empty → `<p data-testid="empty-state">` and no list.

### `app/builder/page.tsx` — `data-testid="page-builder"`
`<form data-testid="builder-form">` with `name-input`, a `pick-list` of library exercises
(each `pick-<id>` with `data-selected`, a `pick-<id>-name`, and a `toggle-<id>` button),
a `selected-count`, and `submit-routine`. On submit: blank name OR zero selected →
`<p data-testid="form-error">` and stay. Otherwise `addRoutine` and `navigate('routines')`.

### `app/week-plan/page.tsx` — `data-testid="page-week-plan"`
`today-session` (`data-today`) with `today-count` and `today-routines` list of
`today-routine-<id>`. Then `week-list` with `day-<d>` per weekday, each showing
`day-<d>-count` and a `day-<d>-routines` list of `day-<d>-routine-<id>`.

### `app/library/page.tsx` — `data-testid="page-library"`
`library-list` with `library-<id>-name` and `library-<id>-muscle`.

## Presentational components
- `components/RoutineCard.tsx` — `<li data-testid="routine-<id>" data-day="<day>|none">` with
  `routine-<id>-name`, `routine-<id>-count` (exercise count), `routine-<id>-day`
  (day or "unassigned"), an `assign-<id>` `<select>` (none + 7 weekdays), and `remove-<id>`.

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/routines/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ routines }`. `?id=<id>` → that routine or 404.
- **POST** — body `{ name, exerciseIds? }`. 201 with the created routine (`day: null`).
  Blank name → 400 `{ error: "name required" }`. New ids `r4`, `r5`, …
- **PUT** — `?id=<id>`, body `{ day }` (a weekday or null) → updated routine. Missing id → 404.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
