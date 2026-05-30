# Bank Savings dashboard app (simulated)

Build a small multi-route banking savings app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

The user has a pool of `unallocated` cash; funds are moved from that pool into savings
**pots**, each with a `goal`. Allocating cannot exceed the unallocated pool; withdrawing
cannot exceed a pot's balance.

## Types — `lib/types.ts`
- `Pot = { id: string; name: string; balance: number; goal: number }`
- `Route = 'pots' | 'pot-detail' | 'create' | 'settings'`
- `Theme = 'light' | 'dark'`
- `Currency = 'USD' | 'EUR' | 'GBP'`

## Shared state — `components/SavingsProvider.tsx`
A React Context provider holding the whole client app state, plus a `useSavings()` hook that
throws if used outside the provider. It exposes:

- `pots: Pot[]`, `unallocated: number`, `theme: Theme`, `currency: Currency`, `route: Route`,
  `selectedId: string | null`
- `allocate({ potId, amount })` — moves `amount` from `unallocated` into the pot. Returns
  `{ ok: true }` on success, or `{ ok: false; error: string }` when: amount ≤ 0
  (`'amount must be positive'`), unknown pot (`'unknown pot'`), or amount exceeds
  `unallocated` (`'insufficient funds'`).
- `withdraw({ potId, amount })` — moves `amount` from the pot back to `unallocated`. Returns
  the same result shape; errors: amount ≤ 0 (`'amount must be positive'`), unknown pot
  (`'unknown pot'`), or amount exceeds the pot balance (`'insufficient balance'`).
- `createPot({ name, goal })` — appends a new pot with `balance: 0` (fresh id `p4`, `p5`, …)
  and navigates to `pots`
- `select(id)` — sets `selectedId` and navigates to `pot-detail`
- `setTheme`, `setCurrency`, `navigate(route)`

Seed data (3 pots), with `unallocated = 1000`:

| pot | id | balance | goal |
|---|---|---|---|
| Emergency Fund | `p1` | 1500 | 3000 |
| New Laptop     | `p2` | 800  | 800  |
| Holiday        | `p3` | 200  | 1200 |

The first created pot gets id `p4`.

## Derived helpers — `hooks/useSavings.ts`
`potProgress(pot)` → integer percent `Math.round(balance / goal * 100)` (capped at 100; if
`goal` is 0, return 100). `potMet(pot)` → `balance >= goal`. `savingsTotals(pots, unallocated)`
→ `{ totalSaved, totalGoal, potCount, metCount, unallocated }` where `totalSaved` sums pot
balances and `totalGoal` sums goals. `useSavingsSummary()` returns `{ totals }` from context.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<SavingsProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` that
shows the active page based on `route`. Starts on `pots`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-pots" |
"nav-pot-detail" | "nav-create" | "nav-settings"`. Clicking one calls `navigate`. The button
for the current route has `aria-current="page"`; the others must **not**.

## Pages
### `app/pots/page.tsx` — `data-testid="page-pots"`
Shows the current currency in `<p data-testid="currency-label">` and the unallocated pool in
`<p data-testid="unallocated">`. Renders `StatCard`s with value testids `stat-saved-value`,
`stat-goal-value`, `stat-met-value`, `stat-count-value`. A `<ul data-testid="pot-list">` of
`PotRow`s, or `<p data-testid="empty-pots">` if there are none. Each row is `<li
data-testid="pot-<id>" data-met="true|false">` with `pot-<id>-name`, `pot-<id>-balance`,
`pot-<id>-goal`, `pot-<id>-progress` values and a `pot-<id>-open` button that calls
`select(id)`.

### `app/pot-detail/page.tsx` — `data-testid="page-pot-detail"`
If no pot is selected, render `<p data-testid="no-selection">`. Otherwise show `pot-name`,
`pot-balance`, `pot-goal`, `pot-progress`, and a `goal-state` showing `met` or `saving`.
Render the unallocated pool in `<p data-testid="pool">`. Provide an `amount-input`, an
`allocate-button`, and a `withdraw-button`. Allocate calls `allocate({ potId, amount })`;
withdraw calls `withdraw({ potId, amount })`. On failure render `<p data-testid="action-error">`
with the error; on success clear the amount and render `<p data-testid="action-success">`.

### `app/create/page.tsx` — `data-testid="page-create"`
`<form data-testid="pot-form">` with `name-input`, `goal-input`, and `submit-pot`. On submit:
if the name is blank or the goal is empty/non-numeric/< 0, render `<p
data-testid="form-error">` and stay. Otherwise `createPot(...)` (which navigates to `pots`).

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` and a `theme-toggle` button flipping light/dark, plus a
`currency-select` bound to `currency`. Theme persists across navigation on `app-root`'s
`data-theme`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/PotRow.tsx` — one pot list item (see Pots page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()` that re-seeds.

### `app/api/pots/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ pots: Pot[] }`.
- **POST** — body `{ name, goal? }`. 201 with the created pot (`p4`, …), `balance: 0`. Blank
  name → 400 `{ error: "name required" }`. Missing/negative goal defaults to 0.
- **PATCH** — `?id=<id>` with body `{ balance?: number; goal?: number }`. 200 with the
  updated pot (only non-negative numbers are applied). Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
