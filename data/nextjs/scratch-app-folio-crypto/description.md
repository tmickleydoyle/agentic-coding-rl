> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Crypto Portfolio app (simulated)

Build a small multi-route app for tracking a simulated crypto portfolio: holdings
(amount × static price), total value, a static 24h change, and allocation %. Routing is
**in-app** (React state — no `next` imports). Four routes (one is a detail view of the
selected coin), a shared Context, and one API route handler backed by a separate in-memory
store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops. All prices and 24h changes are STATIC seed values (no real
market data).

## Types — `lib/types.ts`
- `Coin = { id: string; symbol: string; name: string; amount: number; price: number;
  change24h: number }` (`change24h` is a static percent, e.g. `5` = +5%)
- `Route = 'portfolio' | 'coin-detail' | 'add' | 'allocation'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/PortfolioProvider.tsx`
A React Context provider plus a `usePortfolio()` hook that throws if used outside the
provider. Exposes:

- `coins: Coin[]`, `theme: Theme`, `route: Route`, `selectedCoinId: string | null`
- `addCoin({ symbol, name, amount, price, change24h })` — appends a new `Coin` (fresh id
  `c4`, `c5`, …)
- `removeCoin(id)` — drops the coin (and clears the selection if it was selected)
- `selectCoin(id)` — sets `selectedCoinId` and navigates to `coin-detail`
- `setTheme`, `navigate(route)`

Seed data (3 coins):

| symbol | id | name | amount | price | change24h |
|---|---|---|---|---|---|
| BTC | `c1` | Bitcoin | 0.5 | 60000 | 5 |
| ETH | `c2` | Ethereum | 4 | 3000 | -2 |
| SOL | `c3` | Solana | 50 | 100 | 10 |

The first added coin gets id `c4`.

## Derived helpers — `hooks/usePortfolio.ts`
- `coinValue(coin)` — `amount * price`.
- `changeAmount(coin)` — `round(coinValue * change24h/100)` (static dollar 24h move).
- `isUp(coin)` — `change24h >= 0`.
- `totalValue(coins)` — sum of `coinValue`.
- `totalChange(coins)` — sum of `changeAmount`.
- `allocationPercent(coin, coins)` — `round(coinValue/totalValue*100)` (0 if total ≤ 0).
- `totalsOf(coins)` → `{ totalValue, totalChange, totalChangePercent, coinCount }`, where
  `totalChangePercent` = `round(totalChange/(totalValue-totalChange)*100)`.
- `usePortfolioSummary()` returns `{ totals }` from context.

With the seed: BTC value 30000 / change +1500 / alloc 64; ETH value 12000 / change -240 /
alloc 26; SOL value 5000 / change +500 / alloc 11. totalValue 47000, totalChange 1760,
totalChangePercent 4, coinCount 3.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<PortfolioProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`portfolio`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with buttons `nav-portfolio | nav-coin-detail | nav-add |
nav-allocation`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/portfolio/page.tsx` — `data-testid="page-portfolio"`
`StatCard`s with value testids `stat-value-value`, `stat-change-value`,
`stat-change-percent-value`, `stat-count-value`. A `current-theme` paragraph and a
`theme-toggle` button flipping light/dark (persists on `app-root`'s `data-theme`). A
`<ul data-testid="coin-list">` of `CoinCard`s (`<li data-testid="coin-<id>"
data-up="true|false">` with `coin-<id>-symbol`, `-amount`, `-price`, `-value`, `-change`,
`-change-amount` and a `select-<id>` button). `<p data-testid="empty-coins">` when none.

### `app/coin-detail/page.tsx` — `data-testid="page-coin-detail"`
For the selected coin: `detail-symbol`, `detail-name`, `detail-amount`, `detail-price`,
`detail-value`, `detail-change`, `detail-change-amount`, `detail-allocation`, plus
`detail-up-marker` or `detail-down-marker`. A `remove-coin` button that removes the coin and
navigates to `portfolio`. When no coin is selected, render
`<p data-testid="no-coin-selected">`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="coin-form">` with `symbol-input`, `name-input`, `amount-input`,
`price-input`, `change-input` and `submit-coin`. Validate: blank symbol, or empty/
non-positive amount, or empty/non-positive price → `<p data-testid="form-error">` and stay.
Blank change defaults to 0; blank name defaults to the symbol. Otherwise add the coin and
`navigate('portfolio')`.

### `app/allocation/page.tsx` — `data-testid="page-allocation"`
`<p data-testid="allocation-total">` (total value) and `<ul data-testid="allocation-list">`
of `<li data-testid="alloc-<id>">` with `alloc-<id>-symbol`, `-value`, `-percent`.
`<p data-testid="empty-allocation">` when none.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/CoinCard.tsx` — one coin row (see Portfolio page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/holdings/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ coins: Coin[] }`.
- **POST** — body `{ symbol, amount, price, name?, change24h? }`. 201 with the created coin
  (`c4`, …). Blank symbol → 400 `{ error: "symbol required" }`; non-positive amount → 400
  `{ error: "amount must be positive" }`; non-positive price → 400
  `{ error: "price must be positive" }`. Missing change24h defaults to 0.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
