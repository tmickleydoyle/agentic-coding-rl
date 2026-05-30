# KPI dashboard app

Build a small multi-route KPI/analytics app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store. All data is static seed data.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Kpi = { id: string; name: string; unit: string; current: number; previous: number; target: number; higherIsBetter: boolean; history: number[] }`
- `Route = 'dashboard' | 'kpi-detail' | 'targets' | 'history'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws if used outside the provider. It exposes:

- `kpis: Kpi[]`, `theme: Theme`, `route: Route`, `selectedId: string | null`
- `setTarget(id, target)` — updates a KPI's `target`
- `setTheme`, `navigate(route)`
- `selectKpi(id)` — sets `selectedId` and navigates to `kpi-detail`

Seed KPIs:
- `k1` Revenue ($k) current 120, previous 100, target 110, higherIsBetter true,
  history [90,95,100,120] → on-track, trend up
- `k2` Churn (%) current 6, previous 5, target 5, higherIsBetter false,
  history [4,5,5,6] → off-track, trend up
- `k3` NPS (pts) current 42, previous 45, target 40, higherIsBetter true,
  history [38,44,45,42] → on-track, trend down
- `k4` Cost ($k) current 80, previous 90, target 85, higherIsBetter false,
  history [95,92,90,80] → on-track, trend down

## Helper — `hooks/useKpis.ts`
Pure helpers: `isOnTrack(kpi)` (current ≥ target if higherIsBetter, else current ≤ target),
`trendOf(kpi)` (`up`/`down`/`flat` vs previous), `changePct(kpi)` (rounded to 1 dp),
`countOnTrack(kpis)`. The hook returns `kpis`, `onTrack`, `offTrack`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `dashboard`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-dashboard | nav-targets | nav-history | nav-kpi-detail`.
Clicking calls `navigate`; the current route's button has `aria-current="page"`.

## Pages
### `app/dashboard/page.tsx` — `data-testid="page-dashboard"`
A `summary` with `summary-ontrack`, `summary-offtrack`, `summary-total`. A `kpi-list` of
`KpiCard`s.

### `app/kpi-detail/page.tsx` — `data-testid="page-kpi-detail"`
When `selectedId` is null, render `no-selection`. Otherwise `detail-name`,
`detail-current`, `detail-previous`, `detail-target`, `detail-unit`, `detail-status`
(on-track/off-track), `detail-trend`, `detail-change` (% change), and a `detail-history`
list (`detail-history-<i>`).

### `app/targets/page.tsx` — `data-testid="page-targets"`
A `target-list` where each `target-<id>` shows `target-<id>-name`, `target-<id>-value`
(current target), `data-ontrack`, a `target-<id>-input` and a `target-<id>-save` button
that updates the target in context (ignores blank/NaN).

### `app/history/page.tsx` — `data-testid="page-history"`
A `history-list` where each `history-<id>` shows a `history-<id>-open` button (→ selectKpi),
`history-<id>-points` (count), `history-<id>-max`, `history-<id>-latest`. Also a
`current-theme` + `theme-toggle` reflected on `app-root`.

## Presentational components
- `components/KpiCard.tsx` — `kpi-<id>` with `data-ontrack`/`data-trend` and
  `-name`/`-current`/`-target`/`-status`/`-trend` and `open-<id>`.

## API — separate in-memory store
`lib/store.ts` holds its own seed KPIs (same ids) + `__reset()`.

### `app/api/kpis/route.ts`
Web `Request`/`Response`; re-export `__reset`; JSON `content-type: application/json`.
- **GET** — without `?id`: `{ kpis: Kpi[] }`. With `?id=<id>`: the single KPI, or 404
  `{ error: "not found" }`.
- **PUT** — `?id=<id>` body `{ target }`. Updates and returns the KPI. Non-number `target`
  → 400 `{ error: "target required" }`. Unknown id → 404 `{ error: "not found" }`.
