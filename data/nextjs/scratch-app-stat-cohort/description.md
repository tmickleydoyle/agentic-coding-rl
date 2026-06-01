> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Cohort-retention dashboard app

Build a small multi-route cohort-retention dashboard. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Cohort = { id: string; month: string; size: number; retention: number[] }`
  - `retention` is a length-4 array of integer **percentages** for periods M0..M3
    (M0 is always 100).
- `SizeFilter = 'all' | 'large'` — `'large'` keeps cohorts with `size >= 100`.
- `Route = 'cohorts' | 'retention' | 'breakdown' | 'settings'`
- `Theme = 'light' | 'dark'`
- Export `PERIODS: string[] = ['M0', 'M1', 'M2', 'M3']`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `cohorts: Cohort[]`, `theme: Theme`, `route: Route`
- `sizeFilter: SizeFilter` (default `'all'`)
- `selectedCohortId: string | null`
- `setSizeFilter(filter)` — sets the active filter
- `selectCohort(id)` — sets `selectedCohortId` and navigates to `retention`
- `setTheme`, `navigate(route)`

Seed data (4 cohorts):

| cohort | id | month | size | retention (M0..M3) |
|---|---|---|---|---|
| Jan | `c1` | Jan | 200 | [100, 60, 40, 20] |
| Feb | `c2` | Feb | 150 | [100, 80, 50, 30] |
| Mar | `c3` | Mar | 100 | [100, 50, 30, 10] |
| Apr | `c4` | Apr | 50  | [100, 70, 60, 40] |

## Optional helper — `hooks/useCohorts.ts`
Derived selectors over the shared state. Pure helpers operate on a `Cohort[]` (already
filtered by the caller):
- `applyFilter(cohorts, filter)` → `cohorts` when `'all'`, else those with `size >= 100`.
- `averages(cohorts)` → length-4 array: the integer-rounded average of `retention[i]` across
  the cohorts for each period (all zeros when no cohorts).
- `retainedUsers(cohort, period)` → `round(size * retention[period] / 100)` (the actual
  retained-user count).
- `bestCohortId(cohorts, period)` → the id of the cohort with the highest `retention[period]`
  (first wins on ties; `''` when empty).

The `useCohorts()` hook applies the current `sizeFilter` to `cohorts` and exposes
`{ cohorts: filtered, averages, bestAtM3 }` where `bestAtM3 = bestCohortId(filtered, 3)`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`cohorts`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-cohorts" | "nav-retention" | "nav-breakdown" | "nav-settings"` (labels
Cohorts / Retention / Breakdown / Settings). Clicking one calls `navigate`. The button for
the current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/cohorts/page.tsx` — `data-testid="page-cohorts"`
A size `<select data-testid="size-filter">` (options all/large) bound to `sizeFilter`. Then
a `<ul data-testid="cohort-list">` of the filtered cohorts: each
`<li data-testid="cohort-<id>">` with `cohort-<id>-month`, `cohort-<id>-size`,
`cohort-<id>-m3` (the M3 retention percentage), and a `select-<id>` button calling
`selectCohort(id)`.

### `app/retention/page.tsx` — `data-testid="page-retention"`
If `selectedCohortId` is null, render `<p data-testid="no-selection">`. Otherwise a
`<div data-testid="retention-detail">` showing `detail-month`, and a
`<ul data-testid="period-list">` with one `<li data-testid="period-<period>">` per period
(M0..M3) showing `period-<period>-pct` (the retention percentage) and `period-<period>-users`
(the retained user count via `retainedUsers`).

### `app/breakdown/page.tsx` — `data-testid="page-breakdown"`
The averages row across the **filtered** cohorts: a `<ul data-testid="avg-list">` with one
`<li data-testid="avg-<period>">` per period showing `avg-<period>-value` (the rounded
average retention percentage). Also a `<span data-testid="cohort-count">` with the number of
filtered cohorts and a `<span data-testid="best-m3">` with the id of the best-M3 cohort.

### `app/settings/page.tsx` — `data-testid="page-settings"`
A theme toggle `<button data-testid="toggle-theme">` that flips `theme`, a
`<span data-testid="current-theme">`, and a `<select data-testid="default-filter">` bound to
`sizeFilter` (same options) so the filter can be changed here too.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>` wrapper
  with `stat-<testid>-label` and `stat-<testid>-value`.
- `components/CohortRow.tsx` — one cohort row used by the cohorts list (see above).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/cohorts/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ cohorts: Cohort[] }`. Optional `?minSize=<n>` keeps cohorts with
  `size >= n`. With `?averages=1` instead return `{ averages: number[] }` (length 4) over
  the (filtered) cohorts.
- **POST** — body `{ month, size, retention? }`. 201 with the created cohort (fresh id `c5`,
  `c6`, …). `retention` defaults to `[100, 0, 0, 0]`; if provided it must be an array of 4
  numbers, otherwise → 400 `{ error: "retention must have 4 values" }`. If `month` is
  missing/blank → 400 `{ error: "month required" }`. If `size` is not a number → 400
  `{ error: "size required" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
