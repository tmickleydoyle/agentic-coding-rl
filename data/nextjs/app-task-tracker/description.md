# Task Tracker app

Build a small multi-route task-tracking app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Status = 'active' | 'done'`
- `Task = { id: string; title: string; projectId: string; done: boolean; dueDate: string | null }`
- `Project = { id: string; name: string }`
- `StatusFilter = 'all' | 'active' | 'done'`
- `ProjectFilter = 'all' | string`
- `Route = 'dashboard' | 'tasks' | 'new' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `tasks: Task[]`, `projects: Project[]`, `theme: Theme`, `route: Route`
- `statusFilter: StatusFilter`, `projectFilter: ProjectFilter`
- `addTask({ title, projectId, dueDate? })` — appends a new `Task` (`done: false`,
  fresh string id like `t4`, `t5`, …)
- `toggleTask(id)` — flips `done`
- `removeTask(id)` — drops the task
- `setStatusFilter`, `setProjectFilter`, `setTheme`, `navigate(route)`

Seed data (3 projects, 3 tasks):

| project | id |
|---|---|
| Inbox | `p1` |
| Work  | `p2` |
| Home  | `p3` |

| task | id | project | done | due |
|---|---|---|---|---|
| Write spec     | `t1` | `p2` (Work) | false | 2026-06-01 |
| Buy groceries  | `t2` | `p3` (Home) | true  | — |
| Triage inbox   | `t3` | `p1` (Inbox)| false | — |

The first added task gets id `t4`.

## Optional helper — `hooks/useTasks.ts`
Derived selectors over the shared state: `counts` (`{ total, completed, active,
byProject }`) and `filtered` (tasks after the current status + project filters). Pure
helpers `countTasks` and `filterTasks` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`dashboard`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-dashboard" | "nav-tasks" | "nav-new" | "nav-settings"` (labels
Dashboard / Tasks / New / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/dashboard/page.tsx` — `data-testid="page-dashboard"`
Summary stats from shared state. Render `StatCard`s with these value testids:
`stat-total-value`, `stat-completed-value`, `stat-active-value`. Then a per-project list:
for each project a `project-count-<id>-value` showing how many tasks belong to it.

### `app/tasks/page.tsx` — `data-testid="page-tasks"`
A `<Filters>` block (status + project selects) then the task list. Each task renders via
`TaskItem` as `<li data-testid="task-<id>" data-done="true|false">` containing the title,
project name, a `toggle-<id>` button, and a `remove-<id>` button. When no task matches the
filters, render `<p data-testid="empty-state">` and **no** `task-list`. Otherwise wrap rows
in `<ul data-testid="task-list">`.

### `app/new/page.tsx` — `data-testid="page-new"`
`<form data-testid="new-task-form">` with `title-input`, `project-select` (one option per
project), `due-input` (type date), and `submit-task`. On submit: if the title is empty/
whitespace, render `<p data-testid="form-error">` and stay on the page. Otherwise add the
task to shared state and `navigate('tasks')`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` shows the current theme; `theme-toggle` button flips
light/dark in context. Because theme lives in context, it persists across navigation and is
reflected on `app-root`'s `data-theme`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/TaskItem.tsx` — one task row (see Tasks page).
- `components/Filters.tsx` — `status-filter` and `project-filter` `<select>`s; the project
  select has an `all` → "All projects" option plus one per project (value = project id).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/tasks/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ tasks: Task[] }`. Optional `?status=active|done` and `?projectId=<id>`
  filters (combine with AND).
- **POST** — body `{ title, projectId?, dueDate? }`. 201 with the created task. If `title`
  is missing/blank → 400 `{ error: "title required" }`. New ids continue `t4`, `t5`, …
- **PUT** — `?id=<id>`. With body `{ done: boolean }` set it; with no `done` key, toggle.
  Returns the updated task. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/projects/route.ts`
- **GET** — `{ projects: Project[] }`.
- **POST** — body `{ name }`. 201 with the created project (`p4`, `p5`, …). Blank name →
  400 `{ error: "name required" }`.
