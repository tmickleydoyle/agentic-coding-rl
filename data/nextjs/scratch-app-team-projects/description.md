> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Team Projects app

Build a small multi-route team project-management app. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `TaskStatus = 'todo' | 'doing' | 'done'`
- `Member = { id: string; name: string }`
- `Project = { id: string; name: string }`
- `Task = { id: string; title: string; projectId: string; assigneeId: string | null; status: TaskStatus }`
- `Route = 'projects' | 'project-detail' | 'members' | 'board'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `members: Member[]`, `projects: Project[]`, `tasks: Task[]`, `theme: Theme`, `route: Route`
- `selectedProjectId: string | null`
- `addTask({ title, projectId, assigneeId? })` — appends a `Task` (`status: 'todo'`, fresh
  id like `k4`, `k5`, …)
- `reassignTask(taskId, assigneeId)` — sets the task's `assigneeId` (may be `null`)
- `setTaskStatus(taskId, status)` — sets the task's `status`
- `selectProject(projectId)` — sets `selectedProjectId` and navigates to `project-detail`
- `setTheme`, `navigate(route)`

Seed data (3 members, 3 projects, 3 tasks):

| member | id |
|---|---|
| Ada   | `m1` |
| Grace | `m2` |
| Linus | `m3` |

| project | id |
|---|---|
| Website   | `p1` |
| Mobile    | `p2` |
| Platform  | `p3` |

| task | id | project | assignee | status |
|---|---|---|---|---|
| Design home   | `k1` | `p1` | `m1` | `doing` |
| Ship login    | `k2` | `p1` | `m2` | `todo`  |
| API gateway   | `k3` | `p3` | `m1` | `done`  |

The first added task gets id `k4`.

## Optional helper — `hooks/useBoard.ts`
Derived selectors over the shared state: `workload` (`Record<string, number>` — count of
tasks assigned to each member id, including an `unassigned` bucket key) and helpers
`tasksForProject(projectId)` and `tasksByStatus(tasks)` (`{ todo, doing, done }`). Pure
helper `countWorkload(tasks, members)` is convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`projects`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-projects" | "nav-project-detail" | "nav-members" | "nav-board"` (labels
Projects / Detail / Members / Board). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/projects/page.tsx` — `data-testid="page-projects"`
A list of projects. Each project renders `<li data-testid="project-<id>">` with a
`project-<id>-name` span, a `project-<id>-count` span (number of tasks in the project), and
an `open-<id>` button that calls `selectProject(id)` (which navigates to the detail page).

### `app/project-detail/page.tsx` — `data-testid="page-project-detail"`
Shows the selected project. If `selectedProjectId` is null, render
`<p data-testid="no-project">`. Otherwise show `<h1 data-testid="detail-name">` with the
project name and a `<ul data-testid="detail-tasks">` of its tasks. Each task is
`<li data-testid="detail-task-<id>" data-status="<status>">` containing a
`detail-task-<id>-title` span, a `detail-task-<id>-assignee` span (the assignee's name or
`Unassigned`), and a `reassign-<id>` `<select>` whose value is the current assignee id (or
`unassigned`) with an option per member plus an `unassigned` → "Unassigned" option.
Changing it calls `reassignTask(taskId, value === 'unassigned' ? null : value)`.

### `app/members/page.tsx` — `data-testid="page-members"`
A `<ul data-testid="member-list">`. Each member is `<li data-testid="member-<id>">` with a
`member-<id>-name` span and a `member-<id>-load` span showing the member's workload (count
of tasks assigned to them).

### `app/board/page.tsx` — `data-testid="page-board"`
Three columns by status: `<div data-testid="column-todo|column-doing|column-done">`. Each
column has a `column-<status>-count` span and a list of its tasks as
`<li data-testid="board-task-<id>">` showing the title. Below each task, an
`advance-<id>` button moves the task forward in status (`todo → doing → done`); on a `done`
task the button is rendered but disabled.

## Presentational components
- `components/ProjectRow.tsx` — one project row on the projects page.
- `components/TaskCard.tsx` — one board task card with the advance button.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/tasks/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ tasks: Task[] }`. Optional `?projectId=<id>` and `?assigneeId=<id>` filters
  (combine with AND); `?assigneeId=unassigned` returns tasks with no assignee.
- **POST** — body `{ title, projectId, assigneeId? }`. 201 with the created task
  (`status: 'todo'`). If `title` is missing/blank → 400 `{ error: "title required" }`. New
  ids continue `k4`, `k5`, …
- **PUT** — `?id=<id>`. Body may include `{ assigneeId?: string | null, status?: TaskStatus }`.
  Applies whichever are present. Returns the updated task. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/projects/route.ts`
- **GET** — `{ projects: Project[] }`. Each project includes a `taskCount` field via the
  response shape `{ projects: Array<Project & { taskCount: number }> }`.
- **POST** — body `{ name }`. 201 with the created project (`p4`, `p5`, …). Blank name →
  400 `{ error: "name required" }`.
