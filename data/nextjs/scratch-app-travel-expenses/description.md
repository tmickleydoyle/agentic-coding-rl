> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Travel Expense Tracker

Build a small multi-route trip-expense app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Category = 'food' | 'lodging' | 'transport' | 'activities' | 'other'`
- `Expense = { id: string; tripId: string; day: number; category: Category; amount:
  number; note: string }`
- `Trip = { id: string; name: string; days: number }`
- `Route = 'trips' | 'expenses' | 'add' | 'summary'`
- `Theme = 'light' | 'dark'`
- `CATEGORIES: Category[]` — the five categories in the order above.

## Shared state — `components/ExpensesProvider.tsx`
A Context provider plus a `useExpenses()` hook that throws if used outside the provider.
Exposes:

- `trips: Trip[]`, `expenses: Expense[]`, `theme: Theme`, `route: Route`,
  `selectedTripId: string | null`
- `addExpense({ tripId, day, category, amount, note? })` — appends an `Expense` (fresh id
  `e5`, `e6`, …)
- `removeExpense(id)` — drops the expense
- `selectTrip(id)` — sets `selectedTripId` and navigates to `expenses`
- `setTheme`, `navigate(route)`

Seed data (2 trips, 4 expenses):

| trip | id | days |
|---|---|---|
| Paris | `tr1` | 3 |
| Lisbon | `tr2` | 2 |

| expense | id | trip | day | category | amount |
|---|---|---|---|---|---|
| Hotel | `e1` | `tr1` | 1 | lodging | 200 |
| Dinner | `e2` | `tr1` | 1 | food | 50 |
| Lunch | `e3` | `tr1` | 2 | food | 30 |
| Train | `e4` | `tr2` | 1 | transport | 80 |

The first added expense gets id `e5`.

## Helper — `hooks/useExpenseStats.ts`
Pure helpers `tripTotal(expenses, tripId)`, `byCategory(expenses, tripId)` returning `{
category, total }[]` for non-zero categories in `CATEGORIES` order, and `byDay(expenses,
tripId, days)` returning `{ day, expenses, total }[]` for days `1..days`. A
`useTripExpenses(tripId)` hook returns `{ trip, days, categories, total }`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<ExpensesProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>`
with `<NavBar/>` and `<main data-testid="page-content">`. Starts on `trips`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-trips | nav-expenses | nav-add |
nav-summary`. Current route's button has `aria-current="page"`; others must not.

## Pages
### `app/trips/page.tsx` — `data-testid="page-trips"`
List trips. Each row `trip-<id>` shows `trip-<id>-name`, `trip-<id>-total` (total spent),
and an `open-<id>` button → `selectTrip`. Empty list → `empty-state`.

### `app/expenses/page.tsx` — `data-testid="page-expenses"`
If no trip is selected → `no-trip` + `back-to-trips`. Otherwise `expenses-name`,
`expenses-total` (running total), then one block per day `1..days` as `day-<n>` with
`day-<n>-label`, `day-<n>-total`, and either a `day-<n>-list` `<ul>` of expenses or
`day-<n>-empty`. Each expense renders via `ExpenseRow` as `<li data-testid="expense-<id>">`
with `expense-<id>-note`, `expense-<id>-category`, `expense-<id>-amount`, and a
`remove-<id>` button. Also an `add-link` button → navigate to `add`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-form">` with `trip-select` (defaults to `selectedTripId` or first
trip), `day-input` (number), `category-select`, `amount-input` (number), `note-input`, and
`submit-expense`. On submit: amount missing or `<= 0` → `form-error`, stay on the page.
Otherwise add the expense and `navigate('expenses')`.

### `app/summary/page.tsx` — `data-testid="page-summary"`
StatCards `stat-trips-value`, `stat-count-value` (number of expenses),
`stat-grand-total-value` (sum of all amounts). A `trip-totals` list with `total-<id>-amount`
per trip. A `category-totals` list for the focus trip (`selectedTripId` or the first trip)
with `cat-<category>-amount` per non-zero category.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/ExpenseRow.tsx` — one expense row (see Expenses page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`.

### `app/api/expenses/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — no params → `{ trips }` where each trip includes a `total` field. With
  `?tripId=<id>` → `{ trip, expenses, total }`, or 404 for an unknown id. Optional
  `?category=` filters the expenses.
- **POST** — body `{ tripId, day?, category?, amount, note? }`. 404 if the trip is missing,
  400 `{ error: "amount required" }` if `amount` is not a number `> 0`, else 201 with the
  expense (ids `e5`, `e6`, …). An unknown category falls back to `other`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`, or 404 `{ error: "not found" }`.
