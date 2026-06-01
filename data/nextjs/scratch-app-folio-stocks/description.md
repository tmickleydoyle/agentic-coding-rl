> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Stock Portfolio app (simulated)

Build a small multi-route app for tracking a simulated stock portfolio: holdings
(shares × static price), portfolio value, gain/loss vs cost basis, and allocation %.
Routing is **in-app** (React state — no `next` imports). Four routes (one is a detail view
of the selected holding), a shared Context, and one API route handler backed by a separate
in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops. All prices are STATIC seed values (no real market data).

## Types — `lib/types.ts`
- `Holding = { id: string; symbol: string; name: string; shares: number; costBasis: number;
  price: number }` (`costBasis` and `price` are per-share)
- `Route = 'portfolio' | 'holding-detail' | 'add' | 'allocation'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/PortfolioProvider.tsx`
A React Context provider plus a `usePortfolio()` hook that throws if used outside the
provider. Exposes:

- `holdings: Holding[]`, `theme: Theme`, `route: Route`, `selectedHoldingId: string | null`
- `addHolding({ symbol, name, shares, costBasis, price })` — appends a new `Holding`
  (fresh id `h4`, `h5`, …)
- `removeHolding(id)` — drops the holding (and clears the selection if it was selected)
- `selectHolding(id)` — sets `selectedHoldingId` and navigates to `holding-detail`
- `setTheme`, `navigate(route)`

Seed data (3 holdings):

| symbol | id | name | shares | costBasis | price |
|---|---|---|---|---|---|
| AAPL | `h1` | Apple Inc. | 10 | 150 | 200 |
| MSFT | `h2` | Microsoft Corp. | 5 | 300 | 400 |
| TSLA | `h3` | Tesla Inc. | 8 | 250 | 200 |

The first added holding gets id `h4`.

## Derived helpers — `hooks/usePortfolio.ts`
- `marketValue(holding)` — `shares * price`.
- `costValue(holding)` — `shares * costBasis`.
- `gainLoss(holding)` — `marketValue - costValue`.
- `gainLossPercent(holding)` — `round(gainLoss/costValue*100)` (0 if cost ≤ 0).
- `isGain(holding)` — `gainLoss >= 0`.
- `totalValue(holdings)` — sum of `marketValue`.
- `allocationPercent(holding, holdings)` — `round(marketValue/totalValue*100)` (0 if total ≤ 0).
- `totalsOf(holdings)` → `{ totalValue, totalCost, totalGainLoss, totalGainLossPercent,
  holdingCount }`.
- `usePortfolioSummary()` returns `{ totals }` from context.

With the seed: totalValue 5600, totalCost 5000, totalGainLoss 600, totalGainLossPercent 12,
holdingCount 3. h1 value 2000 / gain 500 / +33% / alloc 36; h3 value 1600 / loss -400 / -20%
/ alloc 29.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<PortfolioProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`portfolio`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with buttons `nav-portfolio | nav-holding-detail | nav-add |
nav-allocation`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/portfolio/page.tsx` — `data-testid="page-portfolio"`
`StatCard`s with value testids `stat-value-value`, `stat-cost-value`, `stat-gainloss-value`,
`stat-gainloss-percent-value`, `stat-count-value`. A `current-theme` paragraph and a
`theme-toggle` button flipping light/dark (persists on `app-root`'s `data-theme`).
`<ul data-testid="holding-list">` of `HoldingCard`s (`<li data-testid="holding-<id>"
data-gain="true|false">` with `holding-<id>-symbol`, `-shares`, `-price`, `-value`,
`-gainloss` and a `select-<id>` button). `<p data-testid="empty-holdings">` when none.

### `app/holding-detail/page.tsx` — `data-testid="page-holding-detail"`
For the selected holding: `detail-symbol`, `detail-name`, `detail-shares`, `detail-price`,
`detail-cost-basis`, `detail-value`, `detail-cost`, `detail-gainloss`,
`detail-gainloss-percent`, `detail-allocation`, plus `detail-gain-marker` (in profit) or
`detail-loss-marker` (at a loss). A `remove-holding` button that removes the holding and
navigates to `portfolio`. When no holding is selected, render
`<p data-testid="no-holding-selected">`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="holding-form">` with `symbol-input`, `name-input`, `shares-input`,
`cost-input`, `price-input` and `submit-holding`. Validate: blank symbol, or empty/
non-positive shares, or empty/non-positive cost → `<p data-testid="form-error">` and stay.
Blank price defaults to the cost basis; blank name defaults to the symbol. Otherwise add the
holding and `navigate('portfolio')`.

### `app/allocation/page.tsx` — `data-testid="page-allocation"`
`<p data-testid="allocation-total">` (total value) and `<ul data-testid="allocation-list">`
of `<li data-testid="alloc-<id>">` with `alloc-<id>-symbol`, `-value`, `-percent`.
`<p data-testid="empty-allocation">` when none.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/HoldingCard.tsx` — one holding row (see Portfolio page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/holdings/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ holdings: Holding[] }`.
- **POST** — body `{ symbol, shares, costBasis, name?, price? }`. 201 with the created
  holding (`h4`, …). Blank symbol → 400 `{ error: "symbol required" }`; non-positive shares
  → 400 `{ error: "shares must be positive" }`; non-positive costBasis → 400
  `{ error: "costBasis must be positive" }`. Missing price defaults to costBasis.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
