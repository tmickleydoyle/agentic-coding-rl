# Shared Expense Splitter app

Build a small multi-route app that splits shared expenses equally across a group of people,
shows per-person balances, and suggests how to settle up. Routing is **in-app** (React state
— no `next` imports anywhere). Four routes, a shared Context, two API route handlers backed
by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Person = { id: string; name: string }`
- `Expense = { id: string; description: string; amount: number; paidBy: string }`
- `Route = 'dashboard' | 'expenses' | 'people' | 'balances'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/SplitProvider.tsx`
A React Context provider plus a `useSplit()` hook that throws if used outside the provider.
Exposes:

- `people: Person[]`, `expenses: Expense[]`, `theme: Theme`, `route: Route`
- `addExpense({ description, amount, paidBy })` — appends a new `Expense` (fresh id `e4`, …)
- `removeExpense(id)` — drops the expense
- `addPerson(name)` — appends a new `Person` (fresh id `u4`, `u5`, …)
- `setTheme`, `navigate(route)`

Seed data (3 people, 3 expenses):

| person | id |
|---|---|
| Alice | `u1` |
| Bob   | `u2` |
| Carol | `u3` |

| expense | id | amount | paidBy |
|---|---|---|---|
| Dinner | `e1` | 90 | `u1` |
| Taxi   | `e2` | 30 | `u2` |
| Hotel  | `e3` | 60 | `u1` |

The first added expense gets id `e4`; the first added person `u4`.

## Derived helpers — `hooks/useBalances.ts`
Every expense is split **equally** among all current people. For each person:
`paid` (sum of expenses they paid), `share` (total spend / number of people), `net`
(`paid - share`). `computeBalances(people, expenses)` → `Balance[]`. `settleUp(balances)` →
a minimal list of `Settlement` transfers (`{ fromId, fromName, toId, toName, amount }`) using
a greedy match of debtors (negative net) to creditors (positive net). `useBalances()` returns
`{ balances, settlements, total }` from context.

With the seed: total 180, share 60 each. Alice net +90, Bob net -30, Carol net -60.
Settlements: Carol → Alice 60, then Bob → Alice 30.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<SplitProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">` showing the
active page. Starts on `dashboard`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with buttons `nav-dashboard | nav-expenses | nav-people |
nav-balances`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/dashboard/page.tsx` — `data-testid="page-dashboard"`
`StatCard`s with value testids `stat-total-value`, `stat-people-value`,
`stat-expenses-value`, `stat-perhead-value`. Also `<p data-testid="current-theme">` and a
`theme-toggle` button flipping light/dark (theme persists on `app-root`'s `data-theme`).

### `app/expenses/page.tsx` — `data-testid="page-expenses"`
`<form data-testid="expense-form">` with `description-input`, `amount-input`, `payer-select`
(one option per person) and `submit-expense`. On submit validate: blank description or
empty/non-positive amount → `<p data-testid="form-error">` and stay. Otherwise add the
expense. Below, `<ul data-testid="expense-list">` of rows `<li
data-testid="expense-<id>">` with `expense-<id>-description`, `-amount`, `-payer` and a
`remove-<id>` button; `<p data-testid="empty-expenses">` when there are none.

### `app/people/page.tsx` — `data-testid="page-people"`
`<form data-testid="person-form">` with `name-input` and `submit-person` (blank name →
`form-error`). `<ul data-testid="people-list">` of `<li data-testid="person-<id>">` with
`person-<id>-name`.

### `app/balances/page.tsx` — `data-testid="page-balances"`
`<ul data-testid="balance-list">` of `<li data-testid="balance-<id>"
data-status="owed|owes|settled">` with `balance-<id>-name` and `balance-<id>-net`. Then the
settle-up plan: `<ul data-testid="settlement-list">` of `<li data-testid="settlement-<i>">`
with `settlement-<i>-from`, `-to`, `-amount`, or `<p data-testid="all-settled">` when no
transfers are needed.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/people/route.ts`
- **GET** — `{ people: Person[] }`.
- **POST** — body `{ name }`. 201 with the created person (`u4`, …). Blank name → 400
  `{ error: "name required" }`.

### `app/api/expenses/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ expenses: Expense[] }`. Optional `?paidBy=<id>` filter.
- **POST** — body `{ description, amount, paidBy }`. 201 with the created expense (`e4`, …).
  Blank description → 400 `{ error: "description required" }`; non-positive amount → 400
  `{ error: "amount must be positive" }`; unknown payer → 400 `{ error: "invalid payer" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
