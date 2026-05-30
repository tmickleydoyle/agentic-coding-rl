# Conversion-funnel dashboard app

Build a small multi-route conversion-funnel dashboard. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Segment = 'all' | 'mobile' | 'desktop'`
- `Step = { id: string; name: string; order: number; counts: Record<Segment, number> }`
  - `counts` holds the number of users who reached this step, per segment.
- `Route = 'funnel' | 'steps' | 'segments' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `steps: Step[]` (always kept sorted by `order` ascending), `theme: Theme`, `route: Route`
- `segment: Segment` (default `'all'`)
- `selectedStepId: string | null`
- `setSegment(segment)` — sets the active segment
- `selectStep(id)` — sets `selectedStepId` and navigates to `steps`
- `setTheme`, `navigate(route)`

Seed data (4 steps, ordered):

| step | id | order | counts.all | counts.mobile | counts.desktop |
|---|---|---|---|---|---|
| Visit    | `st1` | 1 | 1000 | 600 | 400 |
| Signup   | `st2` | 2 | 500  | 250 | 250 |
| Activate | `st3` | 3 | 300  | 120 | 180 |
| Purchase | `st4` | 4 | 120  | 40  | 80  |

## Optional helper — `hooks/useFunnel.ts`
Derived selectors over the shared state. A pure `countFor(step, segment)` returns
`step.counts[segment]`. A pure `funnelRows(steps, segment)` returns, for the steps in
`order`, one row per step `{ id, name, count, dropOff, conversion }` where:
- `count` = `countFor(step, segment)`
- `dropOff` = for the first step `0`; otherwise `round((prevCount - count) / prevCount *
  100)` (0 when `prevCount` is 0)
- `conversion` = `round(count / firstCount * 100)` (0 when `firstCount` is 0; the first
  step is therefore 100)

`overallConversion(steps, segment)` returns the last step's `conversion` (0 when no steps).
`biggestDropStepId(steps, segment)` returns the id of the step with the largest `dropOff`
(first one wins on ties; `''` when no steps). The `useFunnel()` hook reads the shared state
and exposes `{ rows, overall, biggestDropId }` for the current segment.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`funnel`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-funnel" | "nav-steps" | "nav-segments" | "nav-settings"` (labels
Funnel / Steps / Segments / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/funnel/page.tsx` — `data-testid="page-funnel"`
A segment `<select data-testid="segment-filter">` (options all/mobile/desktop) bound to
`segment`. Then a `<ul data-testid="funnel-rows">` from `funnelRows`: one
`<li data-testid="frow-<id>">` per step with `frow-<id>-name`, `frow-<id>-count`,
`frow-<id>-dropoff`, and a `select-<id>` button calling `selectStep(id)`. Then a
`<span data-testid="overall-conversion">` showing the overall conversion percentage.

### `app/steps/page.tsx` — `data-testid="page-steps"`
A `<ul data-testid="step-list">` listing steps in order: each `<li data-testid="step-<id>">`
with `step-<id>-name` and `step-<id>-conversion` (for the current segment). Below, if
`selectedStepId` is set, a `<div data-testid="step-detail">` with `detail-name` and
`detail-count` (the selected step's count in the current segment).

### `app/segments/page.tsx` — `data-testid="page-segments"`
A static comparison table: a `<ul data-testid="segment-list">` with one
`<li data-testid="seg-<segment>">` for each of mobile and desktop (NOT `all`) showing
`seg-<segment>-conversion` = that segment's overall conversion (last step count / first step
count, rounded). Independent of the current `segment` filter.

### `app/settings/page.tsx` — `data-testid="page-settings"`
A theme toggle `<button data-testid="toggle-theme">` that flips `theme`, a
`<span data-testid="current-theme">`, and a `<select data-testid="default-segment">` bound
to `segment` (same options) so the segment can be changed here too.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>` wrapper
  with `stat-<testid>-label` and `stat-<testid>-value`.
- `components/FunnelRow.tsx` — one funnel row used by the funnel page (see above).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/funnel/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ steps: Step[] }` sorted by `order`. With `?segment=all|mobile|desktop` and
  `?rows=1`, instead return `{ rows: { id, name, count, dropOff, conversion }[] }` computed
  for that segment (default segment `all`).
- **POST** — body `{ name, all, mobile?, desktop? }`. 201 with the created step (fresh id
  `st5`, `st6`, …; `order` = 1 + current max order, or 1; `counts.all` = `all`, `mobile`/
  `desktop` default to 0). If `name` is missing/blank → 400 `{ error: "name required" }`. If
  `all` is not a number → 400 `{ error: "all count required" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
