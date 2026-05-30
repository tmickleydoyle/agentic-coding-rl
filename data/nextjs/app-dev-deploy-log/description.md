# Deploy Log app

Build a small multi-route deployment-log app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `DeployStatus = 'queued' | 'building' | 'success' | 'failed' | 'rolled_back'`
- `Deployment = { id: string; env: string; service: string; status: DeployStatus; createdAt: number }`
- `EnvFilter = 'all' | string`
- `Route = 'deployments' | 'deploy-detail' | 'environments' | 'stats'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useDeployments()` hook
that throws if used outside the provider. It exposes:

- `deployments: Deployment[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` (the deployment whose detail page is shown)
- `envFilter: EnvFilter`
- `selectDeployment(id)` — sets `selectedId` and navigates to `deploy-detail`
- `addDeployment({ env, service })` — appends a `Deployment` (status `queued`, fresh id `d4`,
  `d5`, …, monotonically increasing `createdAt`)
- `setStatus(id, status)` — sets a deployment's status
- `rollback(id)` — sets that deployment's status to `rolled_back`
- `setEnvFilter`, `setTheme`, `navigate(route)`

Seed data (3 deployments across envs `dev`/`stage`/`prod`). `createdAt` increases with order.

| deploy | id | env | service | status | createdAt |
|---|---|---|---|---|---|
| —  | `d1` | prod  | api  | success | 1 |
| —  | `d2` | stage | api  | failed  | 2 |
| —  | `d3` | dev   | web  | success | 3 |

The first added deployment gets id `d4` and `createdAt` 4. Environments are derived from the
distinct `env` values of all deployments.

## Optional helper — `hooks/useDeployStats.ts`
Derived selectors. `byEnv(deployments)` returns `Record<env, number>` (deploy counts per
env). `successRate(deployments)` returns the fraction of deployments with status `success`
(0 if none). `statusCounts(deployments)` returns `Record<DeployStatus, number>`.
`filterByEnv(deployments, envFilter)` applies the env filter. `environments(deployments)`
returns the sorted distinct env names. A `useDeployStats()` hook returning `{ counts, rate,
byEnvCounts, filtered, envs }` is convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`deployments`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-deployments" | "nav-deploy-detail" | "nav-environments" | "nav-stats"`
(labels Deployments / Detail / Environments / Stats). Clicking one calls `navigate`. The
button for the current route has `aria-current="page"`; the others must **not** have it.

## Pages
### `app/deployments/page.tsx` — `data-testid="page-deployments"`
A `<Filters>` block (env select) then the deployment list. Each renders via `DeployRow` as
`<li data-testid="deploy-<id>" data-status="<status>">` containing the service, env, status,
a `view-<id>` button calling `selectDeployment(id)`, and a `rollback-<id>` button calling
`rollback(id)`. When none match the filter, render `<p data-testid="empty-state">` and **no**
`deploy-list`; otherwise wrap rows in `<ul data-testid="deploy-list">`. Also a `theme-toggle`
button and `<p data-testid="current-theme">` (theme reflects on `app-root`).

### `app/deploy-detail/page.tsx` — `data-testid="page-deploy-detail"`
Shows the selected deployment. If `selectedId` is null render `<p data-testid="no-selection">`.
Otherwise show `<h2 data-testid="detail-service">`, `<p data-testid="detail-env">`,
`<p data-testid="detail-status">`, and a status-timeline: a `<ul data-testid="timeline">`
listing the deployment lifecycle stages `queued`,`building`,`success` (each
`<li data-testid="stage-<stage>">` with a `data-reached="true|false"` attribute — a stage is
"reached" when the deployment's current status is at or beyond that stage in the order
`queued < building < success`; a `failed` or `rolled_back` deployment has reached `queued`
and `building` but not `success`). Also a `rollback-detail` button that rolls the deployment
back.

### `app/environments/page.tsx` — `data-testid="page-environments"`
A `<ul data-testid="env-list">` with one `<li data-testid="env-<name>">` per distinct env
(sorted) showing `env-<name>-name` and `env-<name>-count` (deployments in that env).

### `app/stats/page.tsx` — `data-testid="page-stats"`
Render `stat-total-value` (count), `stat-success-rate-value` (success rate as a percentage
integer, e.g. `67` for 2/3, computed via `Math.round(rate * 100)`), and per-status counts
`status-count-<status>-value` for each `DeployStatus`.

## Presentational components
- `components/DeployRow.tsx` — one deployment row (see Deployments page).
- `components/Filters.tsx` — an `env-filter` `<select>` with an `all` option plus one per env.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()` that re-seeds.
Independent of the client Context state.

### `app/api/deployments/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ deployments: Deployment[] }`. Optional `?env=<env>` and `?status=<status>`
  filters (AND).
- **POST** — body `{ env, service }`. 201 with the created deployment (status `queued`). If
  `service` is missing/blank → 400 `{ error: "service required" }`. New ids continue `d4`, …
- **PUT** — `?id=<id>`. With body `{ status }` set it; with no `status` key, set
  `rolled_back` (rollback). Returns the updated deployment. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/stats/route.ts`
- **GET** — `{ total: number; byStatus: Record<DeployStatus, number>; byEnv: Record<string,
  number>; successRate: number }` computed from the store.
