> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Pomodoro app

Build a small multi-route pomodoro / focus-timer app. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Task = { id: string; title: string; sessions: number; done: boolean }`
  (`sessions` = number of completed focus sessions for that task)
- `Route = 'tasks' | 'focus' | 'stats' | 'settings'`
- `Theme = 'light' | 'dark'`
- `SESSION_SECONDS = 1500` (25 minutes) — exported constant.

## Shared state — `components/PomodoroProvider.tsx`
A React Context provider holding the whole client app state, plus a `usePomodoro()` hook
that throws if used outside the provider. It exposes:

- `tasks: Task[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` — the task currently chosen for a focus session
- `addTask(title: string)` — appends a `Task` (`sessions: 0`, `done: false`, fresh string id
  like `t4`, `t5`, …). Whitespace-only titles are ignored (no task added).
- `removeTask(id)` — drops the task; if it was selected, selection clears to `null`
- `toggleDone(id)` — flips `done`
- `selectTask(id: string | null)` — sets the active task for focusing
- `completeSession(id)` — increments that task's `sessions` by 1
- `setTheme`, `navigate(route)`

Seed data (3 tasks):

| task | id | sessions | done |
|---|---|---|---|
| Write report  | `t1` | 2 | false |
| Review PR      | `t2` | 0 | false |
| Plan sprint    | `t3` | 1 | true  |

`selectedId` starts as `t1` (the first task). The first added task gets id `t4`.

## Timer hook — `hooks/useTimer.ts`
`useTimer(seconds: number, onDone: () => void)` returns `{ remaining, running, start,
pause, reset, tick }` where the timer counts **down** one second per real second using
`setInterval` (1000ms). When `remaining` reaches 0 it stops the interval, calls `onDone`
exactly once, and rolls `remaining` back to a full `seconds` (ready for the next session).
`start` begins counting (no-op if already 0), `pause` stops the interval without
resetting, `reset` stops and restores `remaining` to `seconds`. Use `useEffect` +
`setInterval`; tests drive it with `vi.useFakeTimers()` and advancing timers inside
`act(...)`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<PomodoroProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`tasks`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-tasks" | "nav-focus" | "nav-stats" | "nav-settings"` (labels
Tasks / Focus / Stats / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/tasks/page.tsx` — `data-testid="page-tasks"`
A `<form data-testid="add-task-form">` with `task-title-input` and `submit-task`
(empty/whitespace title → render `<p data-testid="form-error">`, add nothing). Then the
task list `<ul data-testid="task-list">` with each task as
`<li data-testid="task-<id>" data-done="true|false">` containing the title, a
`session-count-<id>` element showing that task's `sessions`, a `focus-<id>` button (selects
the task and navigates to `focus`), a `done-<id>` toggle button, and a `remove-<id>` button.

### `app/focus/page.tsx` — `data-testid="page-focus"`
Shows the currently selected task title in `<p data-testid="focus-task">` (or
`<p data-testid="no-task">` when nothing is selected). A `<span data-testid="remaining">`
shows the timer's remaining seconds (starts at `SESSION_SECONDS`). Buttons `start-timer`,
`pause-timer`, and `reset-timer` control the timer. When the countdown reaches 0, the timer calls
`completeSession(selectedId)` once (via the `useTimer` `onDone` callback) and the remaining
display rolls back to `SESSION_SECONDS` for the next session.

### `app/stats/page.tsx` — `data-testid="page-stats"`
`<span data-testid="total-sessions">` shows the sum of all tasks' `sessions`.
`<span data-testid="completed-tasks">` shows how many tasks are `done`. A per-task
breakdown lists `<li data-testid="stat-<id>">` with a `stat-<id>-sessions` value each.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` shows the current theme; `theme-toggle` button flips
light/dark in context. Theme persists across navigation and is reflected on `app-root`'s
`data-theme`.

## Presentational components
- `components/TaskRow.tsx` — one task row on the Tasks page (see Tasks page).
- `components/Timer.tsx` — remaining display + start/pause/reset buttons.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/tasks/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ tasks: Task[] }`. Optional `?done=true|false` filter.
- **POST** — body `{ title }`. 201 with the created task (`sessions: 0`, `done: false`). If
  `title` is missing/blank → 400 `{ error: "title required" }`. New ids continue `t4`, `t5`, …
- **PUT** — `?id=<id>`. Body `{ done }` sets done; body `{ session: true }` increments
  `sessions` by 1. With neither key, toggle `done`. Returns the updated task. Unknown id →
  404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
