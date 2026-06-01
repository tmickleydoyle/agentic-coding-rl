> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Sales dashboard app

Build a small multi-route sales dashboard. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Region = 'NA' | 'EU' | 'APAC'`
- `Order = { id: string; product: string; region: Region; revenue: number; units: number; month: string }`
  - `month` is one of `'Jan' | 'Feb' | 'Mar'`.
- `Route = 'overview' | 'products' | 'regions' | 'trends'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `orders: Order[]`, `theme: Theme`, `route: Route`
- `regionFilter: Region | 'all'` (default `'all'`)
- `selectedProduct: string | null`
- `setRegionFilter(filter)` — sets the active region filter
- `selectProduct(product)` — sets `selectedProduct` and navigates to `products`
- `setTheme`, `navigate(route)`

Seed data (6 orders):

| id | product | region | revenue | units | month |
|---|---|---|---|---|---|
| o1 | Widget  | NA   | 1000 | 10 | Jan |
| o2 | Widget  | EU   | 500  | 5  | Feb |
| o3 | Gadget  | NA   | 800  | 4  | Jan |
| o4 | Gadget  | APAC | 1200 | 6  | Mar |
| o5 | Gizmo   | EU   | 300  | 3  | Feb |
| o6 | Widget  | APAC | 700  | 7  | Mar |

## Optional helper — `hooks/useSales.ts`
Derived selectors over the shared state. Pure helpers operate on an `Order[]` (already
region-filtered by the caller):
- `byProduct(orders)` → array of `{ product, revenue, units }` summed per product, sorted by
  revenue descending (ties broken by product name ascending).
- `byRegion(orders)` → array of `{ region, revenue, units }` summed per region, in the fixed
  order `['NA','EU','APAC']`, including regions with zero.
- `byMonth(orders)` → array of `{ month, revenue }` summed per month in calendar order
  `['Jan','Feb','Mar']`, including months with zero.
- `totals(orders)` → `{ totalRevenue, totalUnits, orderCount }`.
- `topProduct(orders)` → the product name with the highest revenue, or `''` when empty.

The `useSales()` hook applies the current `regionFilter` to `orders` first (region `'all'`
keeps everything) and exposes `{ orders: filtered, byProduct, byRegion, byMonth, totals,
topProduct }` for that filtered set.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`overview`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-overview" | "nav-products" | "nav-regions" | "nav-trends"` (labels
Overview / Products / Regions / Trends). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/overview/page.tsx` — `data-testid="page-overview"`
A region `<select data-testid="region-filter">` (options all/NA/EU/APAC) bound to
`regionFilter`. Then summary `StatCard`s with value testids `stat-revenue-value`,
`stat-units-value`, `stat-orders-value` (from `totals`), and `stat-top-product-value` (the
`topProduct` name). All computed from the region-filtered orders.

### `app/products/page.tsx` — `data-testid="page-products"`
A `<ul data-testid="product-list">` from `byProduct`: one
`<li data-testid="product-<name>">` per product (use the product name verbatim as the key
suffix) showing `product-<name>-revenue`, `product-<name>-units`, and a `select-<name>`
button that calls `selectProduct(name)`. Below, if `selectedProduct` is set, a
`<div data-testid="product-detail">` with `detail-name` and `detail-revenue` (that
product's revenue within the current region filter).

### `app/regions/page.tsx` — `data-testid="page-regions"`
A `<ul data-testid="region-list">` from `byRegion`: one `<li data-testid="region-<region>">`
per region (always all three) showing `region-<region>-revenue` and `region-<region>-units`.

### `app/trends/page.tsx` — `data-testid="page-trends"`
A `<ul data-testid="month-list">` from `byMonth`: one `<li data-testid="month-<month>">`
per month (always Jan/Feb/Mar) showing `month-<month>-revenue`. Also a
`<span data-testid="trend-direction">` that is `'up'` if Mar revenue > Jan revenue, `'down'`
if Mar < Jan, else `'flat'` (computed on the region-filtered orders).

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>` wrapper
  with `stat-<testid>-label` and `stat-<testid>-value`.
- `components/ProductRow.tsx` — one product row used by the products list (see above).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/sales/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ orders: Order[] }`. Optional `?region=NA|EU|APAC` and `?product=<name>`
  filters (combine with AND). Also optional `?summary=region` returns instead
  `{ summary: { region, revenue, units }[] }` over the (filtered) orders in
  `['NA','EU','APAC']` order; `?summary=product` returns `{ summary: { product, revenue,
  units }[] }` sorted by revenue descending.
- **POST** — body `{ product, region, revenue?, units?, month? }`. 201 with the created
  order (fresh id `o7`, `o8`, …; defaults: `revenue` 0, `units` 0, `month` `'Jan'`). If
  `product` is missing/blank → 400 `{ error: "product required" }`. If `region` is not one
  of NA/EU/APAC → 400 `{ error: "valid region required" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
