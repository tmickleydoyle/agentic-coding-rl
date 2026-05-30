# Dividend Tracker app (simulated)

Build a small multi-route app for tracking dividend income by holding: annual income per
holding, a portfolio annual income total, and a per-month payout calendar. Routing is
**in-app** (React state — no `next` imports). Four routes (one is a detail view of the
selected holding), a shared Context, and one API route handler backed by a separate
in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops. All figures are STATIC seed values (no real market data).

## Types — `lib/types.ts`
- `Holding = { id: string; symbol: string; name: string; shares: number;
  dividendPerShare: number; payMonth: number }` (`dividendPerShare` is annual; `payMonth` is
  1-12)
- `Route = 'dashboard' | 'holding-detail' | 'add' | 'calendar'`
- `Theme = 'light' | 'dark'`
- `MONTH_NAMES` — `['Jan','Feb',…,'Dec']` (index 0 = Jan).

## Shared state — `components/DividendsProvider.tsx`
A React Context provider plus a `useDividends()` hook that throws if used outside the
provider. Exposes:

- `holdings: Holding[]`, `theme: Theme`, `route: Route`, `selectedHoldingId: string | null`
- `addHolding({ symbol, name, shares, dividendPerShare, payMonth })` — appends a new
  `Holding` (fresh id `h5`, `h6`, …)
- `removeHolding(id)` — drops the holding (and clears the selection if it was selected)
- `selectHolding(id)` — sets `selectedHoldingId` and navigates to `holding-detail`
- `setTheme`, `navigate(route)`

Seed data (4 holdings):

| symbol | id | name | shares | dividendPerShare | payMonth |
|---|---|---|---|---|---|
| KO | `h1` | Coca-Cola | 100 | 2 | 3 |
| JNJ | `h2` | Johnson & Johnson | 50 | 4 | 6 |
| PEP | `h3` | PepsiCo | 30 | 5 | 3 |
| VZ | `h4` | Verizon | 100 | 3 | 12 |

The first added holding gets id `h5`.

## Derived helpers — `hooks/useDividends.ts`
- `annualIncome(holding)` — `shares * dividendPerShare`.
- `monthName(month)` — `MONTH_NAMES[month-1]`.
- `totalAnnualIncome(holdings)` — sum of `annualIncome`.
- `monthlyAverage(holdings)` — `round(totalAnnualIncome/12)`.
- `calendarOf(holdings)` — one `{ month, name, income, holdings }` per paying month, ordered
  ascending by month; `income` is the summed annual income of that month's holdings.
- `totalsOf(holdings)` → `{ totalIncome, monthlyAverage, holdingCount, payingMonths }`.
- `useDividendsSummary()` returns `{ totals }` from context.

With the seed: KO income 200, JNJ 200, PEP 150, VZ 300. totalIncome 850, monthlyAverage 71,
holdingCount 4, payingMonths 3. Calendar: Mar 350 (KO+PEP, 2 holdings), Jun 200 (JNJ), Dec
300 (VZ).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<DividendsProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`dashboard`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with buttons `nav-dashboard | nav-holding-detail | nav-add |
nav-calendar`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/dashboard/page.tsx` — `data-testid="page-dashboard"`
`StatCard`s with value testids `stat-income-value`, `stat-monthly-value`, `stat-count-value`,
`stat-months-value`. A `current-theme` paragraph and a `theme-toggle` button flipping
light/dark (persists on `app-root`'s `data-theme`). A `<ul data-testid="holding-list">` of
`HoldingCard`s (`<li data-testid="holding-<id>">` with `holding-<id>-symbol`, `-shares`,
`-per-share`, `-income`, `-month` and a `select-<id>` button). `<p
data-testid="empty-holdings">` when none.

### `app/holding-detail/page.tsx` — `data-testid="page-holding-detail"`
For the selected holding: `detail-symbol`, `detail-name`, `detail-shares`,
`detail-per-share`, `detail-income`, `detail-month`. A `remove-holding` button that removes
the holding and navigates to `dashboard`. When no holding is selected, render `<p
data-testid="no-holding-selected">`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="holding-form">` with `symbol-input`, `name-input`, `shares-input`,
`per-share-input`, a `month-input` `<select>` (values `"1"`–`"12"`) and `submit-holding`.
Validate: blank symbol, or empty/non-positive shares, or empty/non-positive dividend per
share → `<p data-testid="form-error">` and stay. Blank name defaults to the symbol.
Otherwise add the holding and `navigate('dashboard')`.

### `app/calendar/page.tsx` — `data-testid="page-calendar"`
`<ul data-testid="calendar-list">` of `<li data-testid="month-<n>">` (one per paying month,
ascending) with `month-<n>-name`, `month-<n>-income`, `month-<n>-count`. `<p
data-testid="empty-calendar">` when none.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/HoldingCard.tsx` — one holding row (see Dashboard page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/holdings/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ holdings: Holding[] }`. Optional `?payMonth=<n>` filters by pay month.
- **POST** — body `{ symbol, shares, dividendPerShare, name?, payMonth? }`. 201 with the
  created holding (`h5`, …). Blank symbol → 400 `{ error: "symbol required" }`; non-positive
  shares → 400 `{ error: "shares must be positive" }`; non-positive dividendPerShare → 400
  `{ error: "dividendPerShare must be positive" }`. Missing/out-of-range payMonth defaults
  to 1.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
