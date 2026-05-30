# Monthly Budget Planner app

Build a small multi-route budgeting app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Category = { id: string; name: string; planned: number }`
- `Expense = { id: string; categoryId: string; amount: number; note: string }`
- `Route = 'overview' | 'categories' | 'add-expense' | 'settings'`
- `Theme = 'light' | 'dark'`
- `Currency = 'USD' | 'EUR' | 'GBP'`

## Shared state — `components/BudgetProvider.tsx`
A React Context provider holding the whole client app state, plus a `useBudget()` hook that
throws if used outside the provider. It exposes:

- `categories: Category[]`, `expenses: Expense[]`, `theme: Theme`, `currency: Currency`,
  `route: Route`
- `addExpense({ categoryId, amount, note? })` — appends a new `Expense` (fresh id `e4`, `e5`, …)
- `removeExpense(id)` — drops the expense
- `addCategory({ name, planned })` — appends a new `Category` (fresh id `c4`, `c5`, …)
- `setTheme`, `setCurrency`, `navigate(route)`

Seed data (3 categories, 3 expenses):

| category | id | planned |
|---|---|---|
| Rent      | `c1` | 1200 |
| Groceries | `c2` | 400  |
| Transport | `c3` | 150  |

| expense | id | category | amount | note |
|---|---|---|---|---|
| May rent    | `e1` | `c1` | 1200 | May rent |
| Weekly shop | `e2` | `c2` | 320  | Weekly shop |
| Costco      | `e3` | `c2` | 140  | Costco |

The first added expense gets id `e4`; the first added category `c4`.

## Derived helpers — `hooks/useBudget.ts`
`summarize(categories, expenses)` → per category a `CategorySummary` with `planned`,
`actual` (sum of its expenses), `remaining` (`planned - actual`), and `overBudget`
(`actual > planned`). `totalsOf(summaries)` → `{ totalPlanned, totalActual, totalRemaining,
overBudgetCount }`. `useBudgetSummary()` returns `{ summaries, totals }` from context.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<BudgetProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` that
shows the active page based on `route`. Starts on `overview`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-overview" |
"nav-categories" | "nav-add-expense" | "nav-settings"`. Clicking one calls `navigate`. The
button for the current route has `aria-current="page"`; the others must **not**.

## Pages
### `app/overview/page.tsx` — `data-testid="page-overview"`
Shows the current currency in `<p data-testid="currency-label">`. Renders `StatCard`s with
value testids `stat-planned-value`, `stat-actual-value`, `stat-remaining-value`,
`stat-overbudget-value`. If any category is over budget render `<p
data-testid="overall-alert">`, otherwise `<p data-testid="overall-ok">`.

### `app/categories/page.tsx` — `data-testid="page-categories"`
A `<ul data-testid="category-list">` of `CategoryRow`s, or `<p
data-testid="empty-categories">` if there are none. Each row is `<li
data-testid="category-<id>" data-over="true|false">` with `category-<id>-name`,
`-planned`, `-actual`, `-remaining` values and, when over budget, a `category-<id>-alert`.

### `app/add-expense/page.tsx` — `data-testid="page-add-expense"`
`<form data-testid="expense-form">` with `category-select` (one option per category),
`amount-input`, `note-input`, and `submit-expense`. On submit: if the amount is empty,
non-numeric, or ≤ 0, render `<p data-testid="form-error">` and stay. Otherwise add the
expense and `navigate('overview')`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` and a `theme-toggle` button flipping light/dark, plus a
`currency-select` bound to `currency`. Theme persists across navigation on `app-root`'s
`data-theme`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/CategoryRow.tsx` — one category summary row (see Categories page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()` that re-seeds.

### `app/api/categories/route.ts`
- **GET** — `{ categories: Category[] }`.
- **POST** — body `{ name, planned? }`. 201 with the created category (`c4`, `c5`, …).
  Blank name → 400 `{ error: "name required" }`. Missing/negative planned defaults to 0.

### `app/api/expenses/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ expenses: Expense[] }`. Optional `?categoryId=<id>` filter.
- **POST** — body `{ categoryId, amount, note? }`. 201 with the created expense (`e4`, …).
  Unknown/blank category → 400 `{ error: "invalid category" }`. Non-positive amount → 400
  `{ error: "amount must be positive" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
