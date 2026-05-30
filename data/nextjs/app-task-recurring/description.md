# Recurring Tasks app

Build a small multi-route recurring-task app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

Dates are ISO `YYYY-MM-DD` strings. "Today" is a fixed constant `TODAY = '2026-05-29'`
(no real clock) so behavior is deterministic.

## Types / date helpers — `lib/types.ts`
- `Schedule = 'daily' | 'weekly'`
- `Task = { id: string; title: string; schedule: Schedule; nextDue: string }`
- `HistoryEntry = { id: string; taskId: string; title: string; completedOn: string }`
- `Route = 'today' | 'all-tasks' | 'add' | 'history'`
- `Theme = 'light' | 'dark'`
- `TODAY = '2026-05-29'` — exported constant.
- `addDays(date: string, days: number): string` — pure helper that adds `days` to an ISO
  date and returns the new ISO date (UTC-based, no time component). e.g.
  `addDays('2026-05-29', 1) === '2026-05-30'`.
- `nextDueDate(from: string, schedule: Schedule): string` — `addDays(from, 1)` for daily,
  `addDays(from, 7)` for weekly.

## Shared state — `components/RecurringProvider.tsx`
A React Context provider holding the whole client app state, plus a `useRecurring()` hook
that throws if used outside the provider. It exposes:

- `tasks: Task[]`, `history: HistoryEntry[]`, `theme: Theme`, `route: Route`
- `today: string` (equal to `TODAY`)
- `addTask({ title, schedule })` — appends a `Task` with `nextDue = today` and a fresh
  string id like `t4`, `t5`, …. Whitespace-only titles are ignored (no task added).
- `completeTask(id)` — records a `HistoryEntry` (completed on `today`, with a fresh id like
  `h2`, `h3`, …) and advances that task's `nextDue` via `nextDueDate(today, schedule)`.
- `removeTask(id)` — drops the task (history is kept)
- `setTheme`, `navigate(route)`

A task is **due** when `nextDue <= today` (string compare works for ISO dates).

Seed data (3 tasks, 1 history entry):

| task | id | schedule | nextDue |
|---|---|---|---|
| Water plants  | `t1` | daily  | 2026-05-29 (due today) |
| Take meds      | `t2` | daily  | 2026-05-28 (overdue)   |
| Team sync      | `t3` | weekly | 2026-06-02 (not yet)   |

| history | id | taskId | title | completedOn |
|---|---|---|---|---|
| `h1` | `t1` | Water plants | 2026-05-28 |

The first added task gets id `t4`; the next history entry gets id `h2`.

## Optional helper — `hooks/useDue.ts`
Derived selectors over the shared state: `dueToday` (tasks with `nextDue <= today`, in
list order) and `counts` (`{ total, dueToday, scheduled }` where `scheduled = total -
dueToday`). A pure helper `filterDue(tasks, today)` is convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<RecurringProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-today" | "nav-all-tasks" | "nav-add" | "nav-history"` (labels
Today / All / Add / History). Clicking one calls `navigate`. The button for the current
route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Lists tasks due today (`nextDue <= today`). Each as
`<li data-testid="due-<id>">` with the title, the schedule, a `nextDue` value
`<span data-testid="due-<id>-date">`, and a `complete-<id>` button. When none are due,
render `<p data-testid="empty-today">` and **no** `due-list`. Otherwise wrap rows in
`<ul data-testid="due-list">`. A `<span data-testid="due-count">` shows how many are due.

### `app/all-tasks/page.tsx` — `data-testid="page-all-tasks"`
Lists every task as `<li data-testid="task-<id>" data-due="true|false">` (due = `nextDue <=
today`) with the title, schedule `<span data-testid="task-<id>-schedule">`, next-due
`<span data-testid="task-<id>-next">`, and a `remove-<id>` button. Wrap rows in
`<ul data-testid="all-list">`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-form">` with `title-input`, a `schedule-select` (options `daily`
and `weekly`), and `submit-task`. On submit: if the title is empty/whitespace, render
`<p data-testid="form-error">` and stay on the page. Otherwise add the task (nextDue =
today) and `navigate('all-tasks')`.

### `app/history/page.tsx` — `data-testid="page-history"`
Lists history entries as `<li data-testid="history-<id>">` showing the task title and
`completedOn` date `<span data-testid="history-<id>-date">`. When empty, render
`<p data-testid="empty-history">` and **no** `history-list`; otherwise wrap rows in
`<ul data-testid="history-list">`. A `<span data-testid="history-count">` shows the count.

## Presentational components
- `components/DueRow.tsx` — one row on the Today page (title, schedule, due date, complete).
- `components/TaskRow.tsx` — one row on the All-tasks page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state. Use `TODAY` as the
reference date.

### `app/api/tasks/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ tasks: Task[] }`. Optional `?due=true` returns only tasks with `nextDue <=
  TODAY`; `?schedule=daily|weekly` filters by schedule (combine with AND).
- **POST** — body `{ title, schedule? }` (`schedule` defaults to `daily`; an invalid
  schedule → 400 `{ error: "invalid schedule" }`). 201 with the created task (`nextDue =
  TODAY`). If `title` is missing/blank → 400 `{ error: "title required" }`. New ids continue
  `t4`, `t5`, …
- **PUT** — `?id=<id>` with body `{ complete: true }` advances `nextDue` by the schedule and
  returns the updated task. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
