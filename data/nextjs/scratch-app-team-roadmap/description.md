> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Team Roadmap app

Build a small multi-route product-roadmap app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Status = 'planned' | 'in-progress' | 'done'`
- `Quarter = { id: string; label: string }`
- `Initiative = { id: string; title: string; quarterId: string; status: Status }`
- `Route = 'roadmap' | 'initiative-detail' | 'add' | 'timeline'`
- `Theme = 'light' | 'dark'`

The fixed quarter order is `['q1', 'q2', 'q3', 'q4']` with labels `Q1`, `Q2`, `Q3`, `Q4`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `quarters: Quarter[]`, `initiatives: Initiative[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null`
- `addInitiative({ title, quarterId })` — appends an `Initiative` (`status: 'planned'`,
  fresh id like `i4`, `i5`, …)
- `moveInitiative(id, quarterId)` — sets the initiative's `quarterId`
- `setStatus(id, status)` — sets the initiative's `status`
- `selectInitiative(id)` — sets `selectedId` and navigates to `initiative-detail`
- `setTheme`, `navigate(route)`

Seed data (4 quarters, 3 initiatives):

| quarter | id | label |
|---|---|---|
| q1 | `q1` | Q1 |
| q2 | `q2` | Q2 |
| q3 | `q3` | Q3 |
| q4 | `q4` | Q4 |

| initiative | id | quarter | status |
|---|---|---|---|
| Launch beta   | `i1` | `q1` | in-progress |
| Mobile app    | `i2` | `q1` | planned     |
| SSO support   | `i3` | `q2` | done        |

The first added initiative gets id `i4`.

## Optional helper — `hooks/useRoadmap.ts`
Derived selectors over the shared state: `byQuarter(initiatives)` (`Record<string,
Initiative[]>` keyed by quarter id), `countByQuarter(initiatives)` (`Record<string,
number>`), and `statusTotals(initiatives)` (`{ planned, 'in-progress', done }`). Pure
helpers; not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`roadmap`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-roadmap" | "nav-initiative-detail" | "nav-add" | "nav-timeline"`
(labels Roadmap / Detail / Add / Timeline). Clicking one calls `navigate`. The button for
the current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/roadmap/page.tsx` — `data-testid="page-roadmap"`
A column per quarter: `<div data-testid="quarter-<id>">` with a `quarter-<id>-label` span,
a `quarter-<id>-count` span (number of initiatives in that quarter), and a list of its
initiatives as `<li data-testid="card-<id>" data-status="<status>">` containing a
`card-<id>-title` span and an `open-<id>` button calling `selectInitiative(id)`.

### `app/initiative-detail/page.tsx` — `data-testid="page-initiative-detail"`
Shows the selected initiative. If `selectedId` is null, render `<p data-testid="no-initiative">`.
Otherwise show `<h1 data-testid="detail-title">`, a `detail-status` span with the status, a
`<select data-testid="status-select">` (options planned/in-progress/done, bound to current
status) that calls `setStatus`, and a `<select data-testid="quarter-select">` (one option
per quarter, value = quarter id, bound to the current quarter) that calls `moveInitiative`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-form">` with `title-input`, `quarter-select` (one option per
quarter), and `submit-initiative`. On submit: if the title is empty/whitespace, render
`<p data-testid="form-error">` and stay. Otherwise `addInitiative(...)` and
`navigate('roadmap')`.

### `app/timeline/page.tsx` — `data-testid="page-timeline"`
Status rollup: three spans `timeline-planned-count`, `timeline-in-progress-count`,
`timeline-done-count`, each the total number of initiatives in that status across all
quarters. Then a `<ul data-testid="timeline-list">` listing every initiative in quarter
order (q1→q4) as `<li data-testid="timeline-<id>">` showing its title.

## Presentational component
- `components/InitiativeCard.tsx` — one roadmap card (`card-<id>` li with title + open button).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/initiatives/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ initiatives: Initiative[] }`. Optional `?quarterId=<id>` and `?status=<status>`
  filters (combine with AND).
- **POST** — body `{ title, quarterId }`. 201 with the created initiative
  (`status: 'planned'`). If `title` is missing/blank → 400 `{ error: "title required" }`.
  New ids continue `i4`, `i5`, …
- **PUT** — `?id=<id>`. Body may include `{ quarterId?, status? }`. Applies whichever are
  present (used to move between quarters and change status). Returns the updated initiative.
  Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
