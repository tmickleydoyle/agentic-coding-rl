# HR Leave app

Build a small multi-route leave-management app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `LeaveStatus = 'pending' | 'approved' | 'rejected'`
- `STATUSES: LeaveStatus[]` in that order
- `Employee = { id: string; name: string; allowance: number }`
- `LeaveRequest = { id: string; employeeId: string; day: string; days: number; reason: string; status: LeaveStatus }`
- `Route = 'requests' | 'request-detail' | 'balances' | 'calendar'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `employees: Employee[]`, `requests: LeaveRequest[]`, `theme: Theme`, `route: Route`
- `selectedRequestId: string | null`
- `approveRequest(requestId)` — sets the request's status to `approved`
- `rejectRequest(requestId)` — sets the request's status to `rejected`
- `selectRequest(requestId)` — sets `selectedRequestId` and navigates to `request-detail`
- `setTheme`, `navigate(route)`

Seed data (3 employees, 4 requests):

| employee | id | allowance |
|---|---|---|
| Ada   | `e1` | 20 |
| Grace | `e2` | 25 |
| Linus | `e3` | 15 |

| request | id | employee | day | days | reason | status |
|---|---|---|---|---|---|---|
| `r1` | `e1` | 2026-06-01 | 3 | Vacation | approved |
| `r2` | `e1` | 2026-06-10 | 2 | Family | pending |
| `r3` | `e2` | 2026-06-05 | 5 | Trip | pending |
| `r4` | `e3` | 2026-06-08 | 1 | Appointment | rejected |

The first added request gets id `r5`.

## Optional helper — `hooks/useLeave.ts`
Derived selectors: `requestsForEmployee(requests, employeeId)`,
`usedDays(requests, employeeId)` (sum of **approved** request days),
`remainingDays(employee, requests)` (allowance minus used), `countByStatus(requests)`, and
`sortedByDay(requests)`. A `useLeave()` hook returns `{ counts, balances }` where `balances`
is `[{ employee, used, remaining }]`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`requests`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-requests | nav-request-detail |
nav-balances | nav-calendar` (labels Requests / Detail / Balances / Calendar). The current
route's button has `aria-current="page"`; others must not.

## Pages
### `app/requests/page.tsx` — `data-testid="page-requests"`
A `<ul data-testid="request-list">` of `RequestRow`s. Each request is
`<li data-testid="request-<id>" data-status="<status>">` with `request-<id>-employee` (the
employee name), `request-<id>-day`, `request-<id>-days`, `request-<id>-status` spans and
`approve-<id>` / `reject-<id>` buttons (both **disabled** once the request is no longer
pending) plus an `open-<id>` button that calls `selectRequest(id)`.

### `app/request-detail/page.tsx` — `data-testid="page-request-detail"`
Shows the selected request. If `selectedRequestId` is null, render
`<p data-testid="no-request">`. Otherwise `<h1 data-testid="detail-employee">` plus
`detail-day`, `detail-days`, `detail-reason`, `detail-status` spans and
`detail-approve` / `detail-reject` buttons (disabled once decided).

### `app/balances/page.tsx` — `data-testid="page-balances"`
A `<ul data-testid="balance-list">`. Each employee is `<li data-testid="balance-<id>">` with
`balance-<id>-name`, `balance-<id>-allowance`, `balance-<id>-used` (approved days), and
`balance-<id>-remaining` (allowance minus used) spans.

### `app/calendar/page.tsx` — `data-testid="page-calendar"`
Lists only **approved** requests, sorted ascending by `day`. A `calendar-count` span shows
the total. A `<ul data-testid="calendar-list">` of `<li data-testid="calendar-entry-<id>">`
each with `calendar-entry-<id>-day`, `calendar-entry-<id>-employee`, `calendar-entry-<id>-days`
spans.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus `__reset()`.
Independent of the client Context state.

### `app/api/requests/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ requests: LeaveRequest[] }`. Optional `?employeeId=` and `?status=` filters (AND).
- **POST** — body `{ employeeId, day, days?, reason? }`. 201 with the created request
  (`status: 'pending'`, default `days: 1`, ids `r5`, `r6`, …). Missing employeeId → 400
  `{ error: "employeeId required" }`; missing day → 400 `{ error: "day required" }`.
- **PUT** — `?id=<id>`. Body `{ status? }` (invalid status ignored). Returns the updated
  request. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
