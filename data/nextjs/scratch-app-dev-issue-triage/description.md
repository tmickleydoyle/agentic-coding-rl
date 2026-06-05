> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Issue Triage app

Build a small multi-route issue-triage app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Priority = 'low' | 'medium' | 'high'`
- `IssueStatus = 'open' | 'in-progress' | 'closed'`
- `Issue = { id: string; title: string; labels: string[]; priority: Priority; assignee: string | null; status: IssueStatus }`
- `LabelFilter = 'all' | string`
- `PriorityFilter = 'all' | Priority`
- `AssigneeFilter = 'all' | 'unassigned' | string`
- `Route = 'issues' | 'issue-detail' | 'triage' | 'board'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `issues: Issue[]`, `theme: Theme`, `route: Route`, `selectedIssueId: string | null`
- `labelFilter: LabelFilter`, `priorityFilter: PriorityFilter`, `assigneeFilter: AssigneeFilter`
- `assign(id, assignee)` — sets the issue's `assignee` (a name, or `null` to unassign)
- `setPriority(id, priority)` — sets the issue's priority
- `setStatus(id, status)` — sets the issue's status
- `selectIssue(id)` — sets `selectedIssueId` and navigates to `issue-detail`
- `setLabelFilter`, `setPriorityFilter`, `setAssigneeFilter`, `setTheme`, `navigate(route)`

Seed data (4 issues):

| issue | id | labels | priority | assignee | status |
|---|---|---|---|---|---|
| Login button broken   | `i1` | `['bug','ui']`    | high   | alice | open |
| Slow dashboard query  | `i2` | `['bug','perf']`  | medium | null  | in-progress |
| Add dark mode         | `i3` | `['feature','ui']`| low    | bob   | open |
| Typo in footer        | `i4` | `['ui']`          | low    | null  | closed |

## Optional helper — `hooks/useIssues.ts`
Derived selectors over the shared state: `counts` (`{ total, open, inProgress, closed,
byPriority, byLabel }`), `filtered` (issues after the label + priority + assignee filters),
and `labels` (the sorted set of all labels). Pure helpers `countIssues`, `filterIssues`, and
`allLabels` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`issues`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-issues" | "nav-issue-detail" | "nav-triage" | "nav-board"` (labels
Issues / Detail / Triage / Board). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/issues/page.tsx` — `data-testid="page-issues"`
A `<ul data-testid="issue-list">` with one `<li data-testid="issue-<id>" data-priority="<p>">`
per issue, each showing `issue-<id>-title`, `issue-<id>-assignee` (the assignee name, or the
text `Unassigned` when null), and an `open-<id>` button that calls `selectIssue(id)`.

### `app/issue-detail/page.tsx` — `data-testid="page-issue-detail"`
If `selectedIssueId` is null, render `<p data-testid="no-selection">`. Otherwise show
`detail-title`, a `<ul data-testid="detail-labels">` with one `label-<name>` per label, a
`detail-priority` text, a `detail-assignee` text (`Unassigned` when null), an
`assignee-input` text input plus an `assign-btn` button that calls `assign(id, value)` with
the trimmed input (empty input assigns `null`), and a `priority-select` (low/medium/high)
that calls `setPriority(id, value)`.

### `app/triage/page.tsx` — `data-testid="page-triage"`
Filter controls then the filtered list. A `label-filter` `<select>` (option `all` →
"All labels" plus one per known label), a `priority-filter` `<select>` (all/low/medium/high),
and an `assignee-filter` `<select>` (all / unassigned / one per distinct non-null assignee).
Then a `<ul data-testid="triage-list">` of matching issues as `<li data-testid="triage-<id>">`.
When nothing matches, render `<p data-testid="empty-state">` and **no** `triage-list`.

### `app/board/page.tsx` — `data-testid="page-board"`
Three status columns: `<div data-testid="col-open">`, `col-in-progress`, `col-closed`. Each
column header shows a count `col-<status>-count` and contains one
`<div data-testid="card-<id>">` per issue in that status with a `card-<id>-title`. Each card
has a `next-<id>` button that advances status `open → in-progress → closed` (and stays at
`closed`) via `setStatus`.

## Presentational components
- `components/IssueRow.tsx` — one issue row for the issues page (see above).
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/PriorityBadge.tsx` — `{ priority }` → `<span data-testid="badge" data-priority>`.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/issues/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ issues: Issue[] }`. Optional `?label=<name>`, `?priority=low|medium|high`,
  and `?assignee=<name>` filters (combine with AND). `?assignee=unassigned` matches issues
  with a null assignee.
- **POST** — body `{ title, labels?, priority?, assignee? }`. 201 with the created issue
  (`status` `'open'`, default `priority` `'medium'`, `labels` defaults to `[]`, `assignee`
  defaults to `null`, fresh id `i5`, `i6`, …). If `title` is missing/blank → 400
  `{ error: "title required" }`.
- **PUT** — `?id=<id>`. Body may include `assignee` (string or null), `priority`, `status`,
  or `labels`. Applies the provided fields and returns the updated issue. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
