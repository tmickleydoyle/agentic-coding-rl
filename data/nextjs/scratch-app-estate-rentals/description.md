> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Estate Rentals app

Build a small multi-route rental-management app. Units can be occupied or vacant, and
prospective tenants submit applications with a status. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and **two** API route handlers backed by a shared in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Unit = { id: string; label: string; rent: number; occupied: boolean }`
- `AppStatus = 'pending' | 'approved' | 'rejected'`
- `Application = { id: string; unitId: string; applicant: string; status: AppStatus }`
- `Route = 'units' | 'unit-detail' | 'applications' | 'occupancy'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `units: Unit[]`, `applications: Application[]`, `theme: Theme`, `route: Route`
- `currentUnitId: string | null` — selected unit for detail
- `addApplication({ unitId, applicant })` — appends a new `Application` (`status: 'pending'`,
  fresh string id like `a4`, `a5`, …)
- `setAppStatus(id, status)` — sets an application's status; when set to `approved`, the
  application's unit becomes `occupied: true`
- `toggleOccupied(id)` — flips a unit's `occupied`
- `selectUnit(id)` — sets `currentUnitId`
- `setTheme`, `navigate(route)`

Seed data (3 units, 3 applications):

| unit | id | label | rent | occupied |
|---|---|---|---|---|
| `u1` | A1 | 1200 | true  |
| `u2` | A2 | 1500 | false |
| `u3` | B1 | 1800 | false |

| application | id | unit | applicant | status |
|---|---|---|---|---|
| `a1` | `u2` | Ada  | pending  |
| `a2` | `u2` | Lee  | rejected |
| `a3` | `u3` | Sam  | pending  |

So occupancy at seed = 1 of 3 units occupied. The first added application gets id `a4`.

## Optional helper — `hooks/useRentals.ts`
Derived selectors over shared state. `occupancyRate` returns the share of occupied units as
a whole-number percent (`occupied/total * 100`, rounded; 0 when there are no units).
`applicationsFor(unitId)` returns that unit's applications. `pendingCount` returns the
number of `pending` applications across all units. Pure helpers `computeOccupancy` and
`countPending` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`units`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-units" | "nav-unit-detail" | "nav-applications" | "nav-occupancy"`
(labels Units / Detail / Applications / Occupancy). Clicking one calls `navigate`. The
button for the current route has `aria-current="page"`; the others must **not** have that
attribute.

## Pages
### `app/units/page.tsx` — `data-testid="page-units"`
A `<ul data-testid="unit-list">`; each unit renders via `UnitCard` as
`<li data-testid="unit-<id>" data-occupied="true|false">` showing the label in
`unit-<id>-label`, the rent in `unit-<id>-rent`, an `occupied-<id>` span reading `Occupied`
or `Vacant`, a `toggle-<id>` button calling `toggleOccupied(id)`, and an `open-<id>` button
that calls `selectUnit(id)` then `navigate('unit-detail')`.

### `app/unit-detail/page.tsx` — `data-testid="page-unit-detail"`
If no unit is selected, render `<p data-testid="no-unit">`. Otherwise show the label in
`<h1 data-testid="detail-label">`, the rent in `<p data-testid="detail-rent">`, the status
in `<p data-testid="detail-occupied">` (`Occupied`/`Vacant`), and a
`<ul data-testid="unit-app-list">` of that unit's applications (each
`<li data-testid="unit-app-<id>" data-status="<status>">` with the applicant). Below, a
`<form data-testid="apply-form">` with `applicant-input` and `submit-application`. On
submit: if the applicant is empty/whitespace, render `<p data-testid="form-error">` and
stay; otherwise add a pending application for the current unit and clear the input (stay on
the detail page).

### `app/applications/page.tsx` — `data-testid="page-applications"`
A `<ul data-testid="application-list">` of all applications; each
`<li data-testid="application-<id>" data-status="<status>">` shows the applicant in
`application-<id>-applicant`, the unit label in `application-<id>-unit`, the status in
`application-<id>-status`, and three buttons `approve-<id>` / `reject-<id>` /
`pending-<id>` each calling `setAppStatus(id, …)`.

### `app/occupancy/page.tsx` — `data-testid="page-occupancy"`
Shows `<p data-testid="occupancy-rate">` as a percent (e.g. `33%`),
`<p data-testid="occupied-count">` (number occupied), `<p data-testid="vacant-count">`
(number vacant), and `<p data-testid="pending-count">` (pending applications).

## Presentational components
- `components/NavBar.tsx`, `components/UnitCard.tsx` (see Units page).

## API — shared in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/units/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. JSON responses set
`content-type: application/json`.
- **GET** — `{ units: Unit[], occupancyRate: number }` where `occupancyRate` is the
  whole-number percent of occupied units. Optional `?occupied=true|false` filters units
  (the rate is always computed over **all** units).
- **PUT** — `?id=<id>`. With body `{ occupied: boolean }` set it; with no `occupied` key,
  toggle. Returns the updated unit. Unknown id → 404 `{ error: "not found" }`.

### `app/api/applications/route.ts`
- **GET** — `{ applications: Application[] }`. Optional `?unitId=<id>` and `?status=<s>`
  filters (combine with AND).
- **POST** — body `{ unitId, applicant }`. 201 with the created application
  (`status: 'pending'`). If `applicant` is missing/blank → 400
  `{ error: "applicant required" }`. If `unitId` is missing/unknown → 404
  `{ error: "unit not found" }`. New ids continue `a4`, `a5`, …
- **PUT** — `?id=<id>`, body `{ status }` (one of the three). Returns the updated
  application; approving it marks its unit `occupied`. Unknown id → 404
  `{ error: "not found" }`. Invalid status → 400 `{ error: "invalid status" }`.
