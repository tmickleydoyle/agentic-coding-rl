> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# CI Dashboard app

Build a small multi-route continuous-integration dashboard. Routing is **in-app** (React
state — no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `BuildStatus = 'passing' | 'failing' | 'running'`
- `Pipeline = { id: string; name: string; repo: string }`
- `Build = { id: string; pipelineId: string; number: number; status: BuildStatus; durationSec: number }`
- `StatusFilter = 'all' | BuildStatus`
- `Route = 'pipelines' | 'pipeline-detail' | 'builds' | 'stats'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `pipelines: Pipeline[]`, `builds: Build[]`, `theme: Theme`, `route: Route`
- `selectedPipelineId: string | null`, `statusFilter: StatusFilter`
- `retryBuild(id)` — sets the build's status to `'running'` (a re-run is queued)
- `setStatus(id, status)` — sets a build's status to the given value
- `selectPipeline(id)` — sets `selectedPipelineId` and navigates to `pipeline-detail`
- `setStatusFilter`, `setTheme`, `navigate(route)`

Seed data (3 pipelines, 5 builds):

| pipeline | id | repo |
|---|---|---|
| Web App | `pl1` | acme/web |
| API     | `pl2` | acme/api |
| Worker  | `pl3` | acme/worker |

| build | id | pipeline | number | status | durationSec |
|---|---|---|---|---|---|
| b1 | `b1` | `pl1` | 101 | passing | 120 |
| b2 | `b2` | `pl1` | 102 | failing | 95  |
| b3 | `b3` | `pl2` | 50  | passing | 60  |
| b4 | `b4` | `pl2` | 51  | running | 0   |
| b5 | `b5` | `pl3` | 12  | passing | 200 |

## Optional helper — `hooks/useBuilds.ts`
Derived selectors over the shared state: `counts` (`{ total, passing, failing, running,
byPipeline }`), `filtered` (builds after the current status filter), and `successRate`
(passing / (passing+failing) as a 0-100 integer percentage, 0 when no finished builds).
Pure helpers `countBuilds`, `filterBuilds`, and `successRate` are convenient but not
required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`pipelines`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-pipelines" | "nav-pipeline-detail" | "nav-builds" | "nav-stats"` (labels
Pipelines / Detail / Builds / Stats). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/pipelines/page.tsx` — `data-testid="page-pipelines"`
A `<ul data-testid="pipeline-list">` with one `<li data-testid="pipeline-<id>">` per
pipeline showing `pipeline-<id>-name`, `pipeline-<id>-repo`, and a `select-<id>` button
that calls `selectPipeline(id)` (navigating to the detail page).

### `app/pipeline-detail/page.tsx` — `data-testid="page-pipeline-detail"`
If `selectedPipelineId` is null, render `<p data-testid="no-selection">`. Otherwise show
`detail-name` (the pipeline name) and a `<ul data-testid="build-list">` of that pipeline's
builds. Each build renders `<li data-testid="build-<id>" data-status="<status>">` with
`build-<id>-number`, `build-<id>-status`, and a `retry-<id>` button that calls
`retryBuild(id)`.

### `app/builds/page.tsx` — `data-testid="page-builds"`
A status `<select data-testid="status-filter">` (options all/passing/failing/running) then
a `<ul data-testid="all-build-list">` of builds after the filter. Each row is
`<li data-testid="row-<id>" data-status="<status>">` with `row-<id>-number`. When no build
matches, render `<p data-testid="empty-state">` and **no** `all-build-list`.

### `app/stats/page.tsx` — `data-testid="page-stats"`
Summary stats. Render value testids `stat-total-value`, `stat-passing-value`,
`stat-failing-value`, `stat-running-value`, and `stat-success-rate-value` (the integer
percentage). Then a per-pipeline list: for each pipeline a `pipeline-builds-<id>-value`
with the number of builds belonging to it.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/BuildRow.tsx` — one build row used by the detail page (see above).
- `components/StatusBadge.tsx` — `{ status }` → `<span data-testid="badge" data-status>`.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/builds/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ builds: Build[] }`. Optional `?status=passing|failing|running` and
  `?pipelineId=<id>` filters (combine with AND).
- **POST** — body `{ pipelineId, durationSec? }`. 201 with the created build (`status`
  `'running'`, fresh id `b6`, `b7`, …, `number` = 1 + max number of that pipeline's builds
  or 1). If `pipelineId` is missing/blank → 400 `{ error: "pipelineId required" }`.
- **PUT** — `?id=<id>`. With body `{ status }` set it; with no `status` key, **retry**
  (set to `'running'`). Returns the updated build. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/pipelines/route.ts`
- **GET** — `{ pipelines: Pipeline[] }`.
- **POST** — body `{ name, repo? }`. 201 with the created pipeline (`pl4`, `pl5`, …). Blank
  name → 400 `{ error: "name required" }`.
