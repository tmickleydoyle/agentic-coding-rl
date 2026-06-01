> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Bank Budget dashboard app (simulated)

Build a small multi-route banking budget app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Category = { id: string; name: string; limit: number }`
- `Transaction = { id: string; categoryId: string; description: string; amount: number }`
  (`amount` is a positive spend)
- `Route = 'overview' | 'categories' | 'transactions' | 'budgets'`
- `Theme = 'light' | 'dark'`
- `Currency = 'USD' | 'EUR' | 'GBP'`

## Shared state — `components/BudgetProvider.tsx`
A React Context provider holding the whole client app state, plus a `useBudget()` hook that
throws if used outside the provider. It exposes:

- `categories: Category[]`, `transactions: Transaction[]`, `theme: Theme`,
  `currency: Currency`, `route: Route`
- `addTransaction({ categoryId, description?, amount })` — appends a new `Transaction`
  (fresh id `t6`, `t7`, …)
- `removeTransaction(id)` — drops the transaction
- `setLimit(categoryId, limit)` — updates that category's `limit`
- `setTheme`, `setCurrency`, `navigate(route)`

Seed data (3 categories, 5 transactions):

| category | id | limit |
|---|---|---|
| Dining    | `c1` | 300 |
| Shopping  | `c2` | 500 |
| Utilities | `c3` | 200 |

| txn | id | category | description | amount |
|---|---|---|---|---|
| Pizza night | `t1` | `c1` | Pizza night | 60 |
| Sushi       | `t2` | `c1` | Sushi       | 120 |
| New shoes   | `t3` | `c2` | New shoes   | 540 |
| Electricity | `t4` | `c3` | Electricity | 90 |
| Water       | `t5` | `c3` | Water       | 60 |

The first added transaction gets id `t6`.

## Derived helpers — `hooks/useBudget.ts`
`spentByCategory(transactions)` → `Record<string, number>` summing amounts per category.
`summarize(categories, transactions)` → per category a `CategorySummary` with `limit`,
`spent` (sum of its transactions), `remaining` (`limit - spent`), and `overLimit`
(`spent > limit`). `totalsOf(summaries)` → `{ totalLimit, totalSpent, totalRemaining,
overLimitCount }`. `useBudgetSummary()` returns `{ summaries, totals }` from context.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<BudgetProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` that
shows the active page based on `route`. Starts on `overview`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-overview" |
"nav-categories" | "nav-transactions" | "nav-budgets"`. Clicking one calls `navigate`. The
button for the current route has `aria-current="page"`; the others must **not**.

## Pages
### `app/overview/page.tsx` — `data-testid="page-overview"`
Shows the current currency in `<p data-testid="currency-label">`. Renders `StatCard`s with
value testids `stat-limit-value`, `stat-spent-value`, `stat-remaining-value`,
`stat-overlimit-value`. If any category is over its limit render `<p
data-testid="overall-alert">`, otherwise `<p data-testid="overall-ok">`.

### `app/categories/page.tsx` — `data-testid="page-categories"`
A `<ul data-testid="category-list">` of `CategoryRow`s, or `<p
data-testid="empty-categories">` if there are none. Each row is `<li
data-testid="category-<id>" data-over="true|false">` with `category-<id>-name`,
`-limit`, `-spent`, `-remaining` values and, when over limit, a `category-<id>-alert`.

### `app/transactions/page.tsx` — `data-testid="page-transactions"`
`<form data-testid="txn-form">` with `category-select` (one option per category),
`description-input`, `amount-input`, and `submit-txn`. On submit: if the amount is empty,
non-numeric, or ≤ 0, render `<p data-testid="form-error">` and stay. Otherwise add the
transaction. Below the form, a `<ul data-testid="txn-list">` of every transaction; each `<li
data-testid="txn-<id>">` has `txn-<id>-desc`, `txn-<id>-amount`, and a `txn-<id>-remove`
button that removes it. If there are none, render `<p data-testid="empty-txns">`.

### `app/budgets/page.tsx` — `data-testid="page-budgets"`
For each category a `<div data-testid="budget-<id>">` with a `budget-<id>-limit-input` bound
to its limit and a `budget-<id>-save` button that calls `setLimit(id, value)`. Saving
updates the category limit (reflected on the categories/overview pages).

There is no settings route. `theme`/`currency` still live in context (`data-theme` on
`app-root` reflects `theme`, default `light`; `currency` default `USD`).

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/CategoryRow.tsx` — one category summary row (see Categories page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()` that re-seeds.

### `app/api/transactions/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ transactions: Transaction[] }`. Optional `?categoryId=<id>` filter.
- **POST** — body `{ categoryId, description?, amount }`. 201 with the created transaction
  (`t6`, …). Unknown/blank category → 400 `{ error: "invalid category" }`. Non-positive
  amount → 400 `{ error: "amount must be positive" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
