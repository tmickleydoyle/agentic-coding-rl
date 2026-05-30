# Portfolio Rebalancer app (simulated)

Build a small multi-route app that compares target vs actual allocation and produces
rebalance buy/sell suggestions, with an applied-rebalance history. Routing is **in-app**
(React state — no `next` imports). Four routes, a shared Context, and one API route handler
backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops. All values are STATIC seed values (no real market data).

## Types — `lib/types.ts`
- `Holding = { id: string; symbol: string; name: string; value: number;
  targetPercent: number }`
- `RebalanceEntry = { id: string; symbol: string; date: string; action: 'BUY' | 'SELL';
  amount: number }`
- `Action = 'BUY' | 'SELL' | 'HOLD'`
- `Route = 'portfolio' | 'targets' | 'rebalance' | 'history'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/RebalanceProvider.tsx`
A React Context provider plus a `useRebalance()` hook that throws if used outside the
provider. Exposes:

- `holdings: Holding[]`, `history: RebalanceEntry[]`, `theme: Theme`, `route: Route`,
  `selectedHoldingId: string | null`
- `addHolding({ symbol, name, value, targetPercent })` — appends a new `Holding` (fresh id
  `h4`, `h5`, …)
- `removeHolding(id)` — drops the holding (and clears the selection if it was selected)
- `setTarget(id, targetPercent)` — sets a holding's target percent
- `selectHolding(id)` — sets `selectedHoldingId` and navigates to `targets`
- `logRebalance(entries)` — appends one `RebalanceEntry` per `{ symbol, action, amount }`
  (fresh ids `r3`, `r4`, …; date `'2026-05-29'`)
- `setTheme`, `navigate(route)`

Seed holdings (3):

| symbol | id | name | value | targetPercent |
|---|---|---|---|---|
| STOCKS | `h1` | Stock Fund | 6000 | 50 |
| BONDS | `h2` | Bond Fund | 3000 | 30 |
| CASH | `h3` | Cash Reserve | 1000 | 20 |

Seed history (2): `r1` STOCKS SELL 500 (2026-01-15), `r2` CASH BUY 500 (2026-01-15). The
first added holding gets id `h4`; the first logged rebalance `r3`.

## Derived helpers — `hooks/useRebalance.ts`
- `totalValue(holdings)` — sum of `value`.
- `actualPercent(holding, holdings)` — `round(value/totalValue*100)` (0 if total ≤ 0).
- `targetValue(holding, holdings)` — `round(totalValue*targetPercent/100)`.
- `driftAmount(holding, holdings)` — `targetValue - value` (positive => BUY, negative => SELL).
- `suggestedAction(holding, holdings)` — `BUY`/`SELL`/`HOLD` by the sign of the drift.
- `suggestionsOf(holdings)` — one `{ holding, action, amount }` per holding (`amount` =
  `abs(drift)`).
- `totalTargetPercent(holdings)` — sum of `targetPercent`.
- `isBalanced(holdings)` — every holding has zero drift.
- `totalsOf(holdings)` → `{ totalValue, totalTargetPercent, holdingCount, balanced }`.
- `useRebalanceSummary()` returns `{ totals }` from context.

With the seed: totalValue 10000. STOCKS actual 60 / target 50 / targetValue 5000 / drift
-1000 => SELL 1000. BONDS actual 30 / target 30 / drift 0 => HOLD. CASH actual 10 / target
20 / targetValue 2000 / drift +1000 => BUY 1000. totalTargetPercent 100, balanced false.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<RebalanceProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`portfolio`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with buttons `nav-portfolio | nav-targets | nav-rebalance |
nav-history`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/portfolio/page.tsx` — `data-testid="page-portfolio"`
`StatCard`s with value testids `stat-value-value`, `stat-target-total-value`,
`stat-count-value`, `stat-balanced-value` (`yes`/`no`). A `current-theme` paragraph and a
`theme-toggle` button (persists on `app-root`'s `data-theme`). A `<ul
data-testid="holding-list">` of `HoldingRow`s (`<li data-testid="holding-<id>"
data-drifted="true|false">` with `holding-<id>-symbol`, `-value`, `-actual`, `-target` and a
`select-<id>` button that navigates to targets). `<p data-testid="empty-holdings">` when
none.

### `app/targets/page.tsx` — `data-testid="page-targets"`
`<p data-testid="target-total">` (sum of target percents) plus `target-valid` (sums to 100)
or `target-invalid`. A `<ul data-testid="target-list">` of `<li data-testid="target-<id>">`
with `target-<id>-symbol`, `target-<id>-percent`, and `target-up-<id>` / `target-down-<id>`
buttons that adjust the target by ±5 (floored at 0). Plus a `<form data-testid="holding-form">`
(`symbol-input`, `name-input`, `value-input`, `target-input`, `submit-holding`) that adds a
holding; blank symbol / non-positive value / blank-or-negative target →
`<p data-testid="form-error">`.

### `app/rebalance/page.tsx` — `data-testid="page-rebalance"`
`<p data-testid="trade-count">` (number of non-HOLD suggestions) and an
`already-balanced` marker when balanced. A `<ul data-testid="suggestion-list">` of
`<li data-testid="suggestion-<id>" data-action="BUY|SELL|HOLD">` with
`suggestion-<id>-symbol`, `-action`, `-amount`. An `apply-rebalance` button (disabled when
no trades) that logs the trades via `logRebalance` and navigates to `history`.

### `app/history/page.tsx` — `data-testid="page-history"`
`<p data-testid="history-count">` and a `<ul data-testid="history-list">` of `<li
data-testid="history-<id>" data-action="BUY|SELL">` with `history-<id>-symbol`, `-action`,
`-amount`, `-date`. `<p data-testid="empty-history">` when none.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/HoldingRow.tsx` — one holding row (see Portfolio page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed holdings (same shape/ids) plus a `__reset()`.

### `app/api/holdings/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ holdings: Holding[] }`.
- **POST** — body `{ symbol, value, targetPercent, name? }`. 201 with the created holding
  (`h4`, …). Blank symbol → 400 `{ error: "symbol required" }`; non-positive value → 400
  `{ error: "value must be positive" }`; negative targetPercent → 400
  `{ error: "targetPercent must be non-negative" }`.
- **PUT** — `?id=<id>` body `{ targetPercent }`. 200 with the updated holding. Unknown id →
  404 `{ error: "not found" }`; negative targetPercent → 400.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
