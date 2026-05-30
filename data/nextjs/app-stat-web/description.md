# Web Analytics dashboard app

Build a small multi-route web-analytics dashboard. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all cross-route
state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `DateRange = '7d' | '30d' | 'all'`
- `PageStat = { id: string; path: string; views: number; sessions: number; bounceRate: number; range7d: number; range30d: number }`
  - `views`/`sessions`/`bounceRate` are the **all-time** numbers. `range7d`/`range30d` are
    the pageview counts within the last 7 / 30 days (both `<= views`).
- `Source = { id: string; name: string; sessions: number; conversions: number }`
- `Route = 'overview' | 'pages' | 'sources' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `pages: PageStat[]`, `sources: Source[]`, `theme: Theme`, `route: Route`
- `range: DateRange` (default `'all'`)
- `selectedPageId: string | null`
- `setRange(range)` — sets the active date range
- `selectPage(id)` — sets `selectedPageId` and navigates to `pages`
- `setTheme`, `navigate(route)`

Seed data (4 pages, 3 sources):

| page | id | path | views | sessions | bounceRate | range7d | range30d |
|---|---|---|---|---|---|---|---|
| home  | `pg1` | `/`        | 1000 | 800 | 40 | 200 | 600 |
| blog  | `pg2` | `/blog`    | 600  | 500 | 55 | 150 | 400 |
| about | `pg3` | `/about`   | 300  | 250 | 70 | 50  | 120 |
| pricing | `pg4` | `/pricing` | 400 | 380 | 35 | 120 | 300 |

| source | id | name | sessions | conversions |
|---|---|---|---|---|
| s1 | `s1` | Google   | 900 | 90 |
| s2 | `s2` | Direct   | 600 | 30 |
| s3 | `s3` | Referral | 230 | 46 |

## Optional helper — `hooks/useMetrics.ts`
Derived selectors over the shared state. A pure `viewsForRange(page, range)` returns
`page.range7d` for `'7d'`, `page.range30d` for `'30d'`, and `page.views` for `'all'`. A pure
`totals(pages, range)` returns `{ totalViews, totalSessions, avgBounceRate }` where
`totalViews` sums `viewsForRange` across pages, `totalSessions` sums `sessions`, and
`avgBounceRate` is the integer-rounded average of `bounceRate` across pages (0 when no
pages). A pure `topPages(pages, range, n)` returns the `n` pages with the highest
`viewsForRange`, descending (ties broken by original order). The `useMetrics()` hook reads
the shared state and exposes `{ totals, topPages, viewsFor }` for the current range, where
`viewsFor(page)` applies the current range.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`overview`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-overview" | "nav-pages" | "nav-sources" | "nav-settings"` (labels
Overview / Pages / Sources / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/overview/page.tsx` — `data-testid="page-overview"`
A date-range `<select data-testid="range-filter">` (options 7d/30d/all) bound to `range`.
Then summary `StatCard`s with value testids `stat-total-views-value`,
`stat-total-sessions-value`, and `stat-avg-bounce-value` (computed from `totals` for the
current range). Then a `<ul data-testid="top-pages">` listing the top 3 pages by
`viewsForRange` descending: each `<li data-testid="top-<id>">` with `top-<id>-path` and
`top-<id>-views` (the range-adjusted views).

### `app/pages/page.tsx` — `data-testid="page-pages"`
A `<ul data-testid="page-list">` with one `<li data-testid="page-<id>">` per page showing
`page-<id>-path`, `page-<id>-views` (range-adjusted), `page-<id>-bounce`, and a
`select-<id>` button that calls `selectPage(id)`. Below, if `selectedPageId` is set, a
`<div data-testid="page-detail">` showing `detail-path` and `detail-sessions` for the
selected page.

### `app/sources/page.tsx` — `data-testid="page-sources"`
A `<ul data-testid="source-list">` of sources, each `<li data-testid="source-<id>">` with
`source-<id>-name`, `source-<id>-sessions`, and `source-<id>-rate` = the conversion rate
`round(conversions / sessions * 100)` as an integer percentage (0 when sessions is 0).

### `app/settings/page.tsx` — `data-testid="page-settings"`
A theme toggle `<button data-testid="toggle-theme">` that flips `theme` between light/dark,
and a `<span data-testid="current-theme">` showing the current theme. Also a
`<select data-testid="default-range">` bound to `range` (same options) so the range can be
changed here too.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>` wrapper
  with `stat-<testid>-label` and `stat-<testid>-value`.
- `components/PageRow.tsx` — one page row used by the pages list (see above).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/metrics/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ pages: PageStat[] }`. Optional `?range=7d|30d|all`: when `7d`/`30d`, each
  page's `views` field is replaced by the corresponding range count (`range7d`/`range30d`);
  `all` (or absent) returns all-time. Also optional `?minViews=<n>` filters to pages whose
  **(range-adjusted)** views are `>= n`.
- **POST** — body `{ path, views?, sessions?, bounceRate? }`. 201 with the created page
  (fresh id `pg5`, `pg6`, …; defaults: `views` 0, `sessions` 0, `bounceRate` 0, `range7d` 0,
  `range30d` 0). If `path` is missing/blank → 400 `{ error: "path required" }`.
- **PUT** — `?id=<id>`. Body may include `views`, `sessions`, `bounceRate` (set provided
  numeric fields). Returns the updated page. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
