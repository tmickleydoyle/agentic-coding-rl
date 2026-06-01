> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Eisenhower Matrix app

Build a small multi-route Eisenhower-matrix task app. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types / quadrant helpers — `lib/types.ts`
- `Quadrant = 'do' | 'schedule' | 'delegate' | 'delete'`
- `Task = { id: string; title: string; urgent: boolean; important: boolean }`
- `Route = 'matrix' | 'add' | 'focus-list' | 'settings'`
- `Theme = 'light' | 'dark'`
- `QUADRANTS: Quadrant[] = ['do', 'schedule', 'delegate', 'delete']` — exported.
- `quadrantOf(task: { urgent: boolean; important: boolean }): Quadrant` — pure helper:
  - urgent **and** important → `'do'`
  - not urgent **and** important → `'schedule'`
  - urgent **and** not important → `'delegate'`
  - otherwise → `'delete'`
- `quadrantFlags(q: Quadrant): { urgent: boolean; important: boolean }` — inverse of
  `quadrantOf` (the canonical flags for a quadrant).
- `isQuadrant(value: unknown): value is Quadrant`.

## Shared state — `components/MatrixProvider.tsx`
A React Context provider holding the whole client app state, plus a `useMatrix()` hook
that throws if used outside the provider. It exposes:

- `tasks: Task[]`, `theme: Theme`, `route: Route`
- `addTask({ title, urgent, important })` — appends a `Task` with a fresh string id like
  `t5`, `t6`, …. Whitespace-only titles are ignored (no task added).
- `moveTo(id, quadrant)` — sets the task's `urgent`/`important` flags to the canonical
  flags of `quadrant` (i.e. moves it into that quadrant)
- `toggleUrgent(id)` / `toggleImportant(id)` — flip one flag
- `removeTask(id)` — drops the task
- `setTheme`, `navigate(route)`

Seed data (4 tasks, one per quadrant):

| task | id | urgent | important | quadrant |
|---|---|---|---|---|
| Fix outage      | `t1` | true  | true  | do       |
| Plan roadmap    | `t2` | false | true  | schedule |
| Answer emails   | `t3` | true  | false | delegate |
| Browse forums   | `t4` | false | false | delete   |

The first added task gets id `t5`.

## Optional helper — `hooks/useQuadrants.ts`
Derived selectors over the shared state: `byQuadrant` (a `Record<Quadrant, Task[]>` in list
order) and `counts` (`Record<Quadrant, number>`). A pure helper `groupByQuadrant(tasks)`
is convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<MatrixProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`matrix`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-matrix" | "nav-add" | "nav-focus-list" | "nav-settings"` (labels
Matrix / Add / Focus / Settings). Clicking one calls `navigate`. The button for the current
route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/matrix/page.tsx` — `data-testid="page-matrix"`
Renders four `QuadrantBox` sections in order do/schedule/delegate/delete. Each:
`<section data-testid="quadrant-<q>">` with a count `<span data-testid="count-<q>">` and a
list of its tasks. Each task renders as `<li data-testid="task-<id>" data-quadrant="<q>">`
with the title, a `do-<id>`, `schedule-<id>`, `delegate-<id>` button (each moves the task to
that quadrant — the button matching the task's own quadrant is **omitted**), and a
`delete-<id>` button (removes the task entirely).

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-form">` with `title-input`, an `urgent-checkbox`, an
`important-checkbox`, and `submit-task`. On submit: if the title is empty/whitespace, render
`<p data-testid="form-error">` and stay on the page. Otherwise add the task with the chosen
flags and `navigate('matrix')`.

### `app/focus-list/page.tsx` — `data-testid="page-focus-list"`
Lists only the `do` quadrant (urgent **and** important) tasks — the "do first" list — as
`<li data-testid="focus-<id>">` with the title. A `<span data-testid="focus-count">` shows
how many. When empty, render `<p data-testid="empty-focus">` and **no** `focus-list`;
otherwise wrap rows in `<ul data-testid="focus-list">`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` shows the current theme; `theme-toggle` button flips
light/dark in context. Theme persists across navigation and is reflected on `app-root`'s
`data-theme`.

## Presentational components
- `components/TaskCard.tsx` — one task row (see Matrix page).
- `components/QuadrantBox.tsx` — a single quadrant section (count + task list).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/tasks/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ tasks: Task[] }`. Optional `?quadrant=do|schedule|delegate|delete` returns
  only tasks in that quadrant (computed from their flags). Invalid quadrant value → 400
  `{ error: "invalid quadrant" }`.
- **POST** — body `{ title, urgent?, important? }` (flags default to `false`). 201 with the
  created task. If `title` is missing/blank → 400 `{ error: "title required" }`. New ids
  continue `t5`, `t6`, …
- **PUT** — `?id=<id>`. Body `{ quadrant }` moves it to that quadrant (sets flags); invalid
  quadrant → 400 `{ error: "invalid quadrant" }`. Body may instead include `{ urgent }`
  and/or `{ important }` booleans to set flags directly. Returns the updated task. Unknown id
  → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
