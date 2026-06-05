> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Team Timesheet app

Build a small multi-route timesheet app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Project = { id: string; name: string }`
- `Entry = { id: string; projectId: string; day: Day; hours: number; submitted: boolean }`
- `Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'`
- `Route = 'week' | 'log-entry' | 'projects' | 'approvals'`
- `Theme = 'light' | 'dark'`

The fixed day order is `DAYS = ['mon', 'tue', 'wed', 'thu', 'fri']`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `projects: Project[]`, `entries: Entry[]`, `theme: Theme`, `route: Route`
- `logHours({ projectId, day, hours })` — appends an `Entry` (`submitted: false`, fresh id
  like `h4`, `h5`, …). `hours` is clamped to `>= 0`.
- `submitEntry(id)` — sets that entry's `submitted` to `true`
- `submitAll()` — sets every entry's `submitted` to `true`
- `setTheme`, `navigate(route)`

Seed data (3 projects, 3 entries):

| project | id |
|---|---|
| Alpha | `p1` |
| Bravo | `p2` |
| Carol | `p3` |

| entry | id | project | day | hours | submitted |
|---|---|---|---|---|---|
| h1 | `p1` | mon | 4 | false |
| h2 | `p1` | tue | 3 | false |
| h3 | `p2` | mon | 5 | true  |

So project `p1` has a weekly total of 7 hours, `p2` has 5, `p3` has 0. The grand weekly
total is 12. The first added entry gets id `h4`.

## Optional helper — `hooks/useTimesheet.ts`
Derived selectors: `totalsByProject(entries)` (`Record<string, number>` of summed hours per
project id), `weekTotal(entries)` (grand total hours), `entriesForDay(entries, day)`, and
`submittedCount(entries)`. Pure helpers; not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`week`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-week" | "nav-log-entry" | "nav-projects" | "nav-approvals"` (labels
Week / Log / Projects / Approvals). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/week/page.tsx` — `data-testid="page-week"`
A grid by day. For each day render `<div data-testid="day-<day>">` with a
`day-<day>-total` span (sum of hours logged that day) and a list of that day's entries as
`<li data-testid="entry-<id>" data-submitted="true|false">` showing the project name
(`entry-<id>-project`) and hours (`entry-<id>-hours`). A `week-total` span shows the grand
total of all hours.

### `app/log-entry/page.tsx` — `data-testid="page-log-entry"`
`<form data-testid="log-form">` with `project-select` (one option per project),
`day-select` (one option per day), `hours-input` (type number), and `submit-log`. On submit:
if `hours` is not a positive number (`<= 0` or non-numeric), render
`<p data-testid="form-error">` and stay. Otherwise `logHours(...)` and `navigate('week')`.

### `app/projects/page.tsx` — `data-testid="page-projects"`
A `<ul data-testid="project-list">`. Each project is `<li data-testid="project-<id>">` with
a `project-<id>-name` span and a `project-<id>-total` span (that project's summed weekly
hours).

### `app/approvals/page.tsx` — `data-testid="page-approvals"`
A `submitted-count` span (number of submitted entries) and a `pending-count` span (number of
not-yet-submitted entries). A `<ul data-testid="approvals-list">` of every entry as
`<li data-testid="approval-<id>" data-submitted="true|false">` showing the project name and
hours; unsubmitted entries also render a `submit-<id>` button calling `submitEntry(id)`. A
`submit-all` button calls `submitAll()`.

## Presentational component
- `components/EntryRow.tsx` — one week-grid entry row (project name + hours + submitted attr).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/entries/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ entries: Entry[], totalsByProject: Record<string, number>, weekTotal: number }`.
  Optional `?projectId=<id>` and `?day=<day>` filters apply to the returned `entries`
  (combine with AND); `totalsByProject` and `weekTotal` are always computed over ALL entries.
- **POST** — body `{ projectId, day, hours }`. 201 with the created entry
  (`submitted: false`). `hours` is clamped to `>= 0`. If `hours` is missing or not a number
  → 400 `{ error: "hours required" }`. New ids continue `h4`, `h5`, …
- **PUT** — `?id=<id>`. Marks the entry `submitted: true` (body optional). Returns the
  updated entry. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
