> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Weight Log app

Build a small multi-route body-weight tracking app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

## Types — `lib/types.ts`
- `WeightEntry = { id: string; date: string; weight: number }`
- `Trend = 'up' | 'down' | 'same'`
- `Route = 'log' | 'history' | 'goal' | 'insights'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/WeightProvider.tsx`
Context provider + `useWeight()` hook that throws if used outside the provider. Exposes:
- `entries: WeightEntry[]` (kept in chronological order), `goal: number`, `theme`, `route`
- `addEntry({ date, weight })` — appends a `WeightEntry` (fresh id `g4`, `g5`, …)
- `removeEntry(id)`, `setGoal(value)`, `setTheme`, `navigate`

Seed entries (chronological): `g1` 2026-05-01 80, `g2` 2026-05-08 79.5, `g3` 2026-05-15 79.
`goal` is `75`. The first added entry gets id `g4`.

## Helper — `hooks/useInsights.ts`
- `trendOf(current, previous)` → `'up' | 'down' | 'same'` (`'same'` when previous is null).
- `withTrends(entries)` → each entry tagged with its trend vs the previous entry (first is
  `'same'`).
- `goalProgress(entries, goal)` → percent from the **first** entry's weight toward the goal:
  `round((start - current) / (start - goal) * 100)`, clamped 0..100.
- `useInsights()` returns `{ latest, latestTrend, changeFromStart, progress, reached, tagged }`
  where `changeFromStart = round((latest - start) * 10) / 10` and `reached = latest <= goal`.

For the seed: latestTrend `down`, changeFromStart `-1`, progress `20`, reached `false`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<WeightProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `log`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-log | nav-history | nav-goal | nav-insights`.
Current route's button has `aria-current="page"`.

## Pages
### `app/log/page.tsx` — `data-testid="page-log"`
`latest-weight` (latest entry's weight, or "none"). A `<form data-testid="log-form">` with
`date-input` (type date), `weight-input`, and `submit-weight`: invalid/non-positive weight
or blank date → `<p data-testid="form-error">` and stay; otherwise `addEntry`.

### `app/history/page.tsx` — `data-testid="page-history"`
`entry-list` of `EntryRow`s in chronological order; empty → `<p data-testid="empty-state">`.

### `app/goal/page.tsx` — `data-testid="page-goal"`
`current-goal`, `goal-progress` (percent), `goal-reached` (`data-reached`), and a
`<form data-testid="goal-form">` with `goal-input` and `submit-goal` (non-positive → error).

### `app/insights/page.tsx` — `data-testid="page-insights"`
StatCards `stat-latest-value`, `stat-trend-value`, `stat-change-value`, `stat-progress-value`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/EntryRow.tsx` — `<li data-testid="entry-<id>" data-trend="<trend>">` with
  `entry-<id>-date`, `entry-<id>-weight`, `entry-<id>-trend`, and a `remove-<id>` button.

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/entries/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ entries, goal }`. `?latest` → the latest entry, or 404 `{ error: "no entries" }`.
- **POST** — body `{ date, weight }`. 201 with the entry. Blank date → 400
  `{ error: "date required" }`; bad weight → 400 `{ error: "weight invalid" }`. Ids `g4`, …
- **PUT** — body `{ goal }` → `{ goal }`. Non-positive → 400 `{ error: "goal invalid" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
