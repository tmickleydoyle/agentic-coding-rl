> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Stock Watchlist app (simulated)

Build a small multi-route app for a stock watchlist: tickers with a target price, an
alert-hit flag, and add/remove. Routing is **in-app** (React state — no `next` imports).
Four routes (one is a detail view of the selected ticker), a shared Context, and one API
route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops. All prices are STATIC seed values (no real market data).

## Types — `lib/types.ts`
- `Direction = 'above' | 'below'`
- `Ticker = { id: string; symbol: string; name: string; price: number; targetPrice: number;
  direction: Direction }`
- `Route = 'watchlist' | 'ticker-detail' | 'add' | 'alerts'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/WatchlistProvider.tsx`
A React Context provider plus a `useWatchlist()` hook that throws if used outside the
provider. Exposes:

- `tickers: Ticker[]`, `theme: Theme`, `route: Route`, `selectedTickerId: string | null`
- `addTicker({ symbol, name, price, targetPrice, direction })` — appends a new `Ticker`
  (fresh id `t5`, `t6`, …)
- `removeTicker(id)` — drops the ticker (and clears the selection if it was selected)
- `selectTicker(id)` — sets `selectedTickerId` and navigates to `ticker-detail`
- `setTheme`, `navigate(route)`

Seed data (4 tickers):

| symbol | id | name | price | targetPrice | direction |
|---|---|---|---|---|---|
| AAPL | `t1` | Apple Inc. | 200 | 180 | above |
| MSFT | `t2` | Microsoft Corp. | 400 | 450 | above |
| GOOG | `t3` | Alphabet Inc. | 150 | 160 | below |
| NVDA | `t4` | Nvidia Corp. | 120 | 100 | below |

The first added ticker gets id `t5`.

## Derived helpers — `hooks/useWatchlist.ts`
- `alertHit(ticker)` — `above`: `price >= targetPrice`; `below`: `price <= targetPrice`.
- `distanceToTarget(ticker)` — `targetPrice - price` (signed).
- `alertsOf(tickers)` — the tickers whose alert is hit.
- `totalsOf(tickers)` → `{ tickerCount, alertCount }`.
- `useWatchlistSummary()` returns `{ totals }` from context.

With the seed: AAPL hit (200≥180), MSFT not (400<450), GOOG hit (150≤160), NVDA not
(120>100). tickerCount 4, alertCount 2.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<WatchlistProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`watchlist`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with buttons `nav-watchlist | nav-ticker-detail | nav-add |
nav-alerts`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/watchlist/page.tsx` — `data-testid="page-watchlist"`
`StatCard`s with value testids `stat-count-value`, `stat-alerts-value`. A `current-theme`
paragraph and a `theme-toggle` button flipping light/dark (persists on `app-root`'s
`data-theme`). A `<ul data-testid="ticker-list">` of `TickerCard`s (`<li
data-testid="ticker-<id>" data-alert="true|false">` with `ticker-<id>-symbol`, `-price`,
`-target`, `-direction`, a `ticker-<id>-hit` marker when hit, and `select-<id>` /
`remove-<id>` buttons). `<p data-testid="empty-watchlist">` when none.

### `app/ticker-detail/page.tsx` — `data-testid="page-ticker-detail"`
For the selected ticker: `detail-symbol`, `detail-name`, `detail-price`, `detail-target`,
`detail-direction`, `detail-distance`, plus `detail-alert-hit` or `detail-alert-pending`. A
`remove-ticker` button that removes the ticker and navigates to `watchlist`. When no ticker
is selected, render `<p data-testid="no-ticker-selected">`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="ticker-form">` with `symbol-input`, `name-input`, `price-input`,
`target-input`, a `direction-input` `<select>` (above/below) and `submit-ticker`. Validate:
blank symbol, or empty/non-positive price, or empty/non-positive target →
`<p data-testid="form-error">` and stay. Blank name defaults to the symbol. Otherwise add
the ticker and `navigate('watchlist')`.

### `app/alerts/page.tsx` — `data-testid="page-alerts"`
`<p data-testid="alert-count">` (number of hits) and `<ul data-testid="alert-list">` of
`<li data-testid="alert-<id>">` (only the hit tickers) with `alert-<id>-symbol`, `-price`,
`-target`, `-distance` and an `alert-select-<id>` button. `<p data-testid="empty-alerts">`
when none.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/TickerCard.tsx` — one ticker row (see Watchlist page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/watchlist/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ tickers: Ticker[] }`. Optional `?alerts=true` returns only hit tickers.
- **POST** — body `{ symbol, price, targetPrice, name?, direction? }`. 201 with the created
  ticker (`t5`, …). Blank symbol → 400 `{ error: "symbol required" }`; non-positive price →
  400 `{ error: "price must be positive" }`; non-positive targetPrice → 400
  `{ error: "targetPrice must be positive" }`. Missing direction defaults to `above`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
