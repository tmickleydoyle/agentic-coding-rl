> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# HR Onboarding app

Build a small multi-route onboarding tracker. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Hire = { id: string; name: string; role: string; startDate: string }`
- `OnboardTask = { id: string; hireId: string; label: string; done: boolean }`
- `Route = 'hires' | 'hire-detail' | 'tasks' | 'progress'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `hires: Hire[]`, `tasks: OnboardTask[]`, `theme: Theme`, `route: Route`
- `selectedHireId: string | null`
- `toggleTask(taskId)` — flips a task's `done`
- `setTaskDone(taskId, done)` — sets a task's `done`
- `addTask({ hireId, label })` — appends a task (`done: false`, fresh id like `t7`, …)
- `selectHire(hireId)` — sets `selectedHireId` and navigates to `hire-detail`
- `setTheme`, `navigate(route)`

Seed data (3 hires, 6 tasks):

| hire | id | role | startDate |
|---|---|---|---|
| Ada   | `h1` | Engineer | 2026-06-01 |
| Grace | `h2` | Designer | 2026-06-15 |
| Linus | `h3` | Manager  | 2026-07-01 |

| task | id | hire | label | done |
|---|---|---|---|---|
| `t1` | `h1` | Sign contract | true |
| `t2` | `h1` | Setup laptop  | true |
| `t3` | `h1` | Meet team     | false |
| `t4` | `h1` | Read handbook | false |
| `t5` | `h2` | Sign contract | true |
| `t6` | `h2` | Setup laptop  | false |

The first added task gets id `t7`.

## Optional helper — `hooks/useOnboarding.ts`
Derived selectors: `tasksForHire(tasks, hireId)`, `doneCount(tasks, hireId)`, and
`percentComplete(tasks, hireId)` (rounded percent of the hire's done tasks; `0` when no
tasks). A `useOnboarding()` hook returns `{ progress }` where `progress` is
`[{ hire, total, done, percent }]`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`hires`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-hires | nav-hire-detail | nav-tasks |
nav-progress` (labels Hires / Detail / Tasks / Progress). The current route's button has
`aria-current="page"`; others must not.

## Pages
### `app/hires/page.tsx` — `data-testid="page-hires"`
A `<ul data-testid="hire-list">` of `HireRow`s. Each hire is `<li data-testid="hire-<id>">`
with `hire-<id>-name`, `hire-<id>-role`, `hire-<id>-percent` (completion percent) spans and
an `open-<id>` button that calls `selectHire(id)`.

### `app/hire-detail/page.tsx` — `data-testid="page-hire-detail"`
Shows the selected hire. If `selectedHireId` is null, render `<p data-testid="no-hire">`.
Otherwise `<h1 data-testid="detail-name">`, `detail-role`, `detail-percent` spans and a
`<ul data-testid="detail-tasks">` of `TaskItem`s. Each task is `<li data-testid="task-<id>"
data-done="true|false">` with a `task-<id>-label` span and a `toggle-<id>` button that calls
`toggleTask(id)`.

### `app/tasks/page.tsx` — `data-testid="page-tasks"`
A `tasks-total` span (all tasks) and a `tasks-done` span (done tasks). A
`<ul data-testid="task-list">` of `<li data-testid="row-task-<id>" data-done="true|false">`
each with `row-task-<id>-label`, `row-task-<id>-hire` (the hire name) spans and a
`row-toggle-<id>` button that toggles the task.

### `app/progress/page.tsx` — `data-testid="page-progress"`
An `overall-percent` span (rounded average of each hire's percent). A
`<ul data-testid="progress-list">` of `<li data-testid="progress-<id>">` each with
`progress-<id>-name`, `progress-<id>-done`, `progress-<id>-total`, `progress-<id>-percent`
spans.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus `__reset()`.
Independent of the client Context state.

### `app/api/hires/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — default `{ hires: Array<Hire & { total; done; percent }> }`. With `?tasks`
  present, returns `{ tasks: OnboardTask[] }` (optionally filtered by `?hireId=`).
- **POST** — body `{ hireId, label }` creates an onboarding task (404
  `{ error: "hire not found" }` if the hire is missing, 400 `{ error: "label required" }`
  if blank, ids `t7`, …). Otherwise body `{ name, role?, startDate? }` creates a hire
  (default role `New Hire`, ids `h4`, …; blank name → 400 `{ error: "name required" }`).
- **PUT** — `?id=<id>`. Sets a task's `done` from the body `{ done? }`; toggles when `done`
  is absent. Returns the updated task. Unknown id → 404 `{ error: "not found" }`.
