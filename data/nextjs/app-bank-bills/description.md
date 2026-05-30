# Bank Bills dashboard app (simulated)

Build a small multi-route banking bills app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

Due dates are represented as a `dueDay` integer (day of the month, 1–31). The app holds a
`today` integer (default `10`); a bill is **upcoming** when it is unpaid and its `dueDay` is
on or after `today`, and **overdue** when it is unpaid and its `dueDay` is before `today`.

## Types — `lib/types.ts`
- `Bill = { id: string; name: string; amount: number; dueDay: number; paid: boolean; autopay: boolean }`
- `Route = 'bills' | 'bill-detail' | 'add' | 'upcoming'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/BillsProvider.tsx`
A React Context provider holding the whole client app state, plus a `useBills()` hook that
throws if used outside the provider. It exposes:

- `bills: Bill[]`, `theme: Theme`, `route: Route`, `today: number`, `selectedId: string | null`
- `addBill({ name, amount, dueDay, autopay? })` — appends a new unpaid `Bill` (fresh id `b5`,
  `b6`, …). `autopay` defaults to `false`.
- `payBill(id)` — marks the bill `paid: true`
- `toggleAutopay(id)` — flips the bill's `autopay`
- `select(id)` — sets `selectedId` and navigates to `bill-detail`
- `setTheme`, `navigate(route)`

Seed data (4 bills), with `today = 10`:

| bill | id | amount | dueDay | paid | autopay |
|---|---|---|---|---|---|
| Rent      | `b1` | 1400 | 1  | false | false |
| Internet  | `b2` | 60   | 5  | true  | true  |
| Phone     | `b3` | 45   | 15 | false | true  |
| Gym       | `b4` | 30   | 20 | false | false |

The first added bill gets id `b5`.

## Derived helpers — `hooks/useBills.ts`
`upcomingBills(bills, today)` → unpaid bills with `dueDay >= today`, **sorted ascending by
`dueDay`**. `overdueBills(bills, today)` → unpaid bills with `dueDay < today`.
`billTotals(bills)` → `{ total, paidCount, unpaidCount, autopayCount }` where `total` sums all
amounts. `useBillsSummary()` returns `{ totals, upcomingCount, overdueCount }` from context
(using `today`).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<BillsProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` that
shows the active page based on `route`. Starts on `bills`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-bills" |
"nav-bill-detail" | "nav-add" | "nav-upcoming"`. Clicking one calls `navigate`. The button
for the current route has `aria-current="page"`; the others must **not**.

## Pages
### `app/bills/page.tsx` — `data-testid="page-bills"`
Renders `StatCard`s with value testids `stat-total-value`, `stat-paid-value`,
`stat-unpaid-value`, `stat-autopay-value`. A `<ul data-testid="bill-list">` of `BillRow`s, or
`<p data-testid="empty-bills">` if there are none. Each row is `<li data-testid="bill-<id>"
data-paid="true|false">` with `bill-<id>-name`, `bill-<id>-amount`, `bill-<id>-due` values, a
`bill-<id>-status` showing `paid` / `overdue` / `upcoming`, and a `bill-<id>-open` button
that calls `select(id)`.

### `app/bill-detail/page.tsx` — `data-testid="page-bill-detail"`
If no bill is selected, render `<p data-testid="no-selection">`. Otherwise show `bill-name`,
`bill-amount`, `bill-due`, and a `bill-status` (`paid`/`overdue`/`upcoming`). A `pay-button`
calls `payBill` — when the bill is already paid, render `<p data-testid="already-paid">` and
do not render the pay button. An `autopay-toggle` button flips autopay; show the current
state in `<p data-testid="autopay-state">` as `on` or `off`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="bill-form">` with `name-input`, `amount-input`, `dueday-input`, an
`autopay-checkbox`, and `submit-bill`. On submit: if the name is blank, or the amount is
empty/non-numeric/≤ 0, or the dueDay is not an integer 1–31, render `<p
data-testid="form-error">` and stay. Otherwise add the bill and `navigate('bills')`.

### `app/upcoming/page.tsx` — `data-testid="page-upcoming"`
A `<ul data-testid="upcoming-list">` of the upcoming bills (sorted by dueDay) — each `<li
data-testid="upcoming-<id>">` with `upcoming-<id>-name` and `upcoming-<id>-due`. If none,
`<p data-testid="empty-upcoming">`. Separately, an `<ul data-testid="overdue-list">` of
overdue bills with `overdue-<id>` items, or `<p data-testid="empty-overdue">`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/BillRow.tsx` — one bill list item (see Bills page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()` that re-seeds.

### `app/api/bills/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ bills: Bill[] }`. Optional `?unpaid=true` returns only unpaid bills.
- **POST** — body `{ name, amount, dueDay, autopay? }`. 201 with the created bill (`b5`, …),
  `paid: false`. Blank name → 400 `{ error: "name required" }`. Non-positive amount → 400
  `{ error: "amount must be positive" }`. dueDay not an integer 1–31 → 400
  `{ error: "invalid due day" }`.
- **PATCH** — `?id=<id>` with body `{ paid?: boolean; autopay?: boolean }`. 200 with the
  updated bill. Unknown id → 404 `{ error: "not found" }`.
