> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Team OKR app

Build a small multi-route OKR (objectives & key results) app. Routing is **in-app** (React
state — no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `KeyResult = { id: string; title: string; progress: number }` — `progress` is an integer
  percent in `[0, 100]`.
- `Objective = { id: string; title: string; owner: string; keyResults: KeyResult[] }`
- `Route = 'objectives' | 'objective-detail' | 'add' | 'dashboard'`
- `Theme = 'light' | 'dark'`

## Progress rules — `lib/progress.ts`
- `clampProgress(n)` — clamp to an integer in `[0, 100]` (round, floor at 0, cap at 100).
- `objectiveProgress(obj)` — the average of its key results' `progress`, rounded to the
  nearest integer; `0` when the objective has no key results.
- `companyProgress(objectives)` — the average of each objective's `objectiveProgress`,
  rounded; `0` when there are no objectives.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `objectives: Objective[]`, `theme: Theme`, `route: Route`, `selectedId: string | null`
- `addObjective({ title, owner })` — appends an `Objective` with no key results and a fresh
  id like `o3`, `o4`, …
- `updateProgress(objectiveId, krId, progress)` — sets that key result's `progress`,
  clamped to `[0, 100]`
- `selectObjective(id)` — sets `selectedId` and navigates to `objective-detail`
- `setTheme`, `navigate(route)`

Seed data (2 objectives):

| objective | id | owner | key results (id: progress) |
|---|---|---|---|
| Grow revenue   | `o1` | Ada   | `kr1` Sign 10 deals: 40, `kr2` Cut churn: 80 |
| Improve quality| `o2` | Grace | `kr3` Reduce bugs: 100 |

So `objectiveProgress(o1) = 60`, `objectiveProgress(o2) = 100`, and `companyProgress = 80`.
The first added objective gets id `o3`.

## Optional helper — `hooks/useOkr.ts`
Derived selectors: `company` (the company rollup average) and a `progressOf(objective)`
helper. Pure helpers; not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`objectives`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-objectives" | "nav-objective-detail" | "nav-add" | "nav-dashboard"`
(labels Objectives / Detail / Add / Dashboard). Clicking one calls `navigate`. The button
for the current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/objectives/page.tsx` — `data-testid="page-objectives"`
A `<ul data-testid="objective-list">`. Each objective is `<li data-testid="objective-<id>">`
with an `objective-<id>-title` span, an `objective-<id>-owner` span, an
`objective-<id>-progress` span (the objective's rolled-up progress), and an `open-<id>`
button calling `selectObjective(id)`.

### `app/objective-detail/page.tsx` — `data-testid="page-objective-detail"`
Shows the selected objective. If `selectedId` is null, render `<p data-testid="no-objective">`.
Otherwise show `<h1 data-testid="detail-title">`, a `detail-progress` span (rolled-up
progress), and a `<ul data-testid="kr-list">` of key results. Each is
`<li data-testid="kr-<id>">` with a `kr-<id>-title` span, a `kr-<id>-progress` span, and a
`<input type="range" data-testid="kr-<id>-input" min="0" max="100">` bound to the key
result's progress whose `onChange` calls `updateProgress(objectiveId, krId, Number(value))`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-form">` with `title-input`, `owner-input`, and `submit-objective`.
On submit: if the title is empty/whitespace, render `<p data-testid="form-error">` and stay.
Otherwise `addObjective(...)` and `navigate('objectives')`.

### `app/dashboard/page.tsx` — `data-testid="page-dashboard"`
A `company-progress` span with the company rollup average, an `objective-count` span (number
of objectives), and a `<ul data-testid="dashboard-list">` repeating each objective's
rolled-up progress as `<li data-testid="dashboard-<id>">` showing `<id>-progress` style
content via a `dashboard-<id>-progress` span.

## Presentational component
- `components/ObjectiveRow.tsx` — one objectives-page row (title/owner/progress/open button).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/objectives/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ objectives: Array<Objective & { progress: number }>, company: number }`,
  where each objective includes its rolled-up `progress` and `company` is the rollup average.
- **POST** — body `{ title, owner? }`. 201 with the created objective (empty `keyResults`).
  If `title` is missing/blank → 400 `{ error: "title required" }`. New ids continue `o3`,
  `o4`, …
- **PUT** — `?id=<objectiveId>&kr=<krId>`. Body `{ progress: number }`. Clamps to `[0,100]`
  and sets that key result's progress; returns the updated objective (with rolled-up
  `progress`). Unknown objective or kr → 404 `{ error: "not found" }`.
