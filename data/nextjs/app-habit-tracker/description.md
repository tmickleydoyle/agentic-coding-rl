# Habit Tracker app

Build a small multi-route daily habit-tracking app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

A fixed `TODAY = '2026-05-28'` constant is used everywhere (no real clock).

## Types — `lib/types.ts`
- `Habit = { id: string; name: string; history: string[] }` where `history` is the list of
  ISO dates the habit was completed (most recent appended last).
- `Route = 'today' | 'habits' | 'add' | 'stats'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/HabitProvider.tsx`
Context provider + `useHabits()` hook that throws if used outside the provider. Exposes:
- `habits: Habit[]`, `theme`, `route`, `today: string`
- `toggleToday(id)` — if the habit's `history` includes `today`, remove it; otherwise append
  `today`.
- `addHabit(name)` — append a new habit with empty history (fresh id `h4`, `h5`, …). Blank
  name is ignored.
- `removeHabit(id)`, `setTheme`, `navigate`

Seed habits (`today` is `'2026-05-28'`):
- `h1` "Drink water" history `['2026-05-26','2026-05-27','2026-05-28']`
- `h2` "Exercise" history `['2026-05-27','2026-05-28']`
- `h3` "Read" history `['2026-05-25','2026-05-26']`
The first newly-created habit gets id `h4`.

## Helper — `hooks/useHabitStats.ts`
- `isDoneToday(habit, today)` — `history` includes `today`.
- `currentStreak(habit, today)` — consecutive days ending at `today` (or the day before if
  not done today) that the habit was completed. Counts back day-by-day from `today`: if
  `today` is in history it counts and we walk back from `today`; otherwise start from the day
  before `today`. Stop at the first missing day.
- `completionRate(habits, today)` — percent of habits done today, rounded, 0 if none.
- `useHabitStats()` returns `{ doneToday, totalHabits, completionRate, longestStreak }` where
  `longestStreak` is the max `currentStreak` across habits.

For the seed (today `2026-05-28`): `doneToday` 2 (h1, h2), `totalHabits` 3,
`completionRate` 67, `longestStreak` 3 (h1: 05-26,27,28).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<HabitProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-today | nav-habits | nav-add | nav-stats`.
Current route's button has `aria-current="page"`.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Shows `today-date`, `today-done` (count done today), `today-total`, `today-percent`.
A `habit-list` of `HabitRow`s; each has a `toggle-<id>` button. Empty habits →
`<p data-testid="empty-state">`.

### `app/habits/page.tsx` — `data-testid="page-habits"`
`habit-manage-list` listing each habit with its name (`manage-<id>-name`), its current streak
(`manage-<id>-streak`) and a `delete-<id>` button. Empty → `<p data-testid="empty-state">`.

### `app/add/page.tsx` — `data-testid="page-add"`
A `<form data-testid="add-form">` with `name-input` and `submit-habit`. Blank name →
`<p data-testid="form-error">` and stay; otherwise `addHabit(name)`, clear input, and
navigate to `habits`.

### `app/stats/page.tsx` — `data-testid="page-stats"`
StatCards `stat-done-value`, `stat-total-value`, `stat-rate-value`, `stat-streak-value`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/HabitRow.tsx` — `<li data-testid="habit-<id>" data-done="true|false">` with
  `habit-<id>-name` and a `toggle-<id>` button (text "Undo" when done, "Done" otherwise).

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/habits/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ habits }`.
- **POST** — body `{ name }`. 201 with the new habit (empty history, id `h4`, …). Blank name
  → 400 `{ error: "name required" }`.
- **PUT** — body `{ id, date }`. Toggle `date` in that habit's history. 200 with the habit.
  Unknown id → 404 `{ error: "not found" }`. Blank date → 400 `{ error: "date required" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
