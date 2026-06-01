> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Bank Accounts dashboard app (simulated)

Build a small multi-route banking app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Account = { id: string; name: string; kind: 'checking' | 'savings'; balance: number }`
- `Transaction = { id: string; accountId: string; description: string; amount: number }`
  (positive `amount` = deposit, negative = withdrawal)
- `Route = 'accounts' | 'account-detail' | 'transfer' | 'settings'`
- `Theme = 'light' | 'dark'`
- `Currency = 'USD' | 'EUR' | 'GBP'`

## Shared state — `components/AccountsProvider.tsx`
A React Context provider holding the whole client app state, plus a `useAccounts()` hook that
throws if used outside the provider. It exposes:

- `accounts: Account[]`, `transactions: Transaction[]`, `theme: Theme`, `currency: Currency`,
  `route: Route`, `selectedId: string | null`
- `transfer({ fromId, toId, amount })` — moves `amount` from one account to another. Returns
  `{ ok: true }` on success, or `{ ok: false; error: string }` when: same account
  (`'same account'`), amount ≤ 0 (`'amount must be positive'`), unknown account
  (`'unknown account'`), or insufficient funds (`'insufficient funds'`). On success it
  decrements the source balance, increments the destination balance, and appends two
  transactions (a withdrawal `tN` on the source, then a deposit `tN+1` on the destination),
  ids continuing from `t7`.
- `select(id)` — sets `selectedId` and navigates to `account-detail`
- `setTheme`, `setCurrency`, `navigate(route)`

Seed data (3 accounts, 6 transactions):

| account | id | kind | balance |
|---|---|---|---|
| Everyday Checking | `a1` | checking | 2500 |
| Rainy Day Savings | `a2` | savings  | 8000 |
| Travel Fund       | `a3` | savings  | 1200 |

| txn | id | account | description | amount |
|---|---|---|---|---|
| Paycheck    | `t1` | `a1` | Paycheck    | 3200 |
| Rent        | `t2` | `a1` | Rent        | -1400 |
| Groceries   | `t3` | `a1` | Groceries   | -260 |
| Interest    | `t4` | `a2` | Interest    | 40 |
| Deposit     | `t5` | `a2` | Deposit     | 500 |
| Flights     | `t6` | `a3` | Flights     | -300 |

The first added transaction gets id `t7`.

## Derived helpers — `hooks/useAccounts.ts`
`totalBalance(accounts)` → sum of all balances. `transactionsFor(transactions, accountId)` →
that account's transactions in order. `accountStats(transactions, accountId)` →
`{ deposits, withdrawals, count }` where `deposits` sums positive amounts, `withdrawals` sums
the **absolute value** of negative amounts, `count` is the number of that account's
transactions. `useAccountsSummary()` returns `{ total, accountCount }` from context.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AccountsProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` that
shows the active page based on `route`. Starts on `accounts`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-accounts" |
"nav-account-detail" | "nav-transfer" | "nav-settings"`. Clicking one calls `navigate`. The
button for the current route has `aria-current="page"`; the others must **not**.

## Pages
### `app/accounts/page.tsx` — `data-testid="page-accounts"`
Shows the current currency in `<p data-testid="currency-label">` and the total balance in
`<p data-testid="total-balance">`. A `<ul data-testid="account-list">` of `AccountCard`s, or
`<p data-testid="empty-accounts">` if there are none. Each card is `<li
data-testid="account-<id>">` with `account-<id>-name`, `-kind`, `-balance` values and a
`account-<id>-open` button that calls `select(id)`.

### `app/account-detail/page.tsx` — `data-testid="page-account-detail"`
If no account is selected, render `<p data-testid="no-selection">`. Otherwise show
`account-name`, `account-balance`, and stats `stat-deposits-value`, `stat-withdrawals-value`,
`stat-count-value`. List the account's transactions in `<ul data-testid="txn-list">`, each
`<li data-testid="txn-<id>" data-kind="deposit|withdrawal">` with `txn-<id>-desc` and
`txn-<id>-amount`. If the account has no transactions, render `<p data-testid="no-txns">`.

### `app/transfer/page.tsx` — `data-testid="page-transfer"`
`<form data-testid="transfer-form">` with `from-select`, `to-select` (one option per
account), `amount-input`, and `submit-transfer`. On submit, call `transfer(...)`. If it
fails, render `<p data-testid="transfer-error">` with the error and stay. On success, render
`<p data-testid="transfer-success">` and clear the amount.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` and a `theme-toggle` button flipping light/dark, plus a
`currency-select` bound to `currency`. Theme persists across navigation on `app-root`'s
`data-theme`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/AccountCard.tsx` — one account list item (see Accounts page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()` that re-seeds.

### `app/api/accounts/route.ts`
- **GET** — `{ accounts: Account[] }`.
- **POST** — body `{ name, kind?, balance? }`. 201 with the created account (`a4`, `a5`, …).
  Blank name → 400 `{ error: "name required" }`. `kind` defaults to `'checking'`; an invalid
  kind → 400 `{ error: "invalid kind" }`. Missing/negative balance defaults to 0.

### `app/api/transactions/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ transactions: Transaction[] }`. Optional `?accountId=<id>` filter.
- **POST** — body `{ accountId, description?, amount }`. 201 with the created transaction
  (`t7`, …) and the account's balance is adjusted by `amount`. Unknown/blank account → 400
  `{ error: "invalid account" }`. Non-numeric/zero amount → 400 `{ error: "amount required" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }` and reverses the amount on the account's
  balance. Unknown id → 404 `{ error: "not found" }`.
