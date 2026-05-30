# Inventory Stock app

Build a small multi-route inventory app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Product = { id: string; name: string; qty: number; reorderPoint: number }`
- `StockFilter = 'all' | 'low' | 'ok'`
- `Route = 'products' | 'product-detail' | 'adjust' | 'low-stock'`
- `Theme = 'light' | 'dark'`

A product is **low** when `qty <= reorderPoint` (export `isLow(product)`).

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useStock()` hook that throws if used outside the provider.
It exposes:

- `products: Product[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` (the product shown on detail/adjust pages)
- `stockFilter: StockFilter`
- `adjust(id, delta)` — changes a product's `qty` by `delta`, clamped so it never goes below 0
- `setReorderPoint(id, value)` — sets a product's reorder point (clamped at 0)
- `selectProduct(id)` — sets `selectedId` and navigates to `product-detail`
- `setStockFilter`, `setTheme`, `navigate(route)`

Seed data (3 products):

| id | name | qty | reorderPoint |
|---|---|---|---|
| `p1` | Widget   | 40 | 10 |
| `p2` | Gadget   | 5  | 8  |
| `p3` | Sprocket | 0  | 4  |

## Derived helpers — `hooks/useProducts.ts`
Selectors over shared state: `filtered` (products after the current stock filter), `stats`
(`{ total, low, ok, units }` where `units` is the sum of all quantities), `lowProducts`
(products that are low), and `selected` (the product whose id is `selectedId`, or `null`).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` showing
the active page. Starts on `products`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`nav-products | nav-product-detail | nav-adjust | nav-low-stock` (labels Products / Detail /
Adjust / Low Stock). The active route's button has `aria-current="page"`; others must not.

## Pages
### `app/products/page.tsx` — `data-testid="page-products"`
Three stat cards `stat-total`, `stat-low`, `stat-units` (each with a `-value` child). A
`<select data-testid="stock-filter">` (all/low/ok). Then the product list. Each product
renders via `ProductRow` as `<li data-testid="product-<id>" data-low="true|false">` with
`product-<id>-name`, `product-<id>-qty`, `product-<id>-reorder`, a `product-<id>-alert`
(text `LOW`, only when low), and a `view-<id>` button (calls `selectProduct`). When nothing
matches the filter render `<p data-testid="empty-state">` and no list; otherwise wrap rows in
`<ul data-testid="product-list">`.

### `app/product-detail/page.tsx` — `data-testid="page-product-detail"`
Detail for `selectedId`, else `<p data-testid="no-selection">`. Shows `detail-name`,
`detail-qty`, `detail-reorder`, `detail-status` (text `low` or `ok`) and a `go-adjust`
button (navigates to `adjust`).

### `app/adjust/page.tsx` — `data-testid="page-adjust"`
Adjust the selected product, else `<p data-testid="no-selection">`. Shows `adjust-name`,
`adjust-qty`, `adjust-reorder`, an `amount-input` (defaults to `1`), a `receive` button
(adds the absolute amount), a `ship` button (subtracts the absolute amount, clamped at 0),
and a `raise-reorder` button (reorder point + 1).

### `app/low-stock/page.tsx` — `data-testid="page-low-stock"`
`current-theme` shows the theme; `theme-toggle` flips light/dark (reflected on `app-root`).
`<p data-testid="low-count">` reads `"<n> products at or below reorder point"`. List the low
products as `<li data-testid="low-<id>">` with `low-<id>-name`, `low-<id>-short`
(`reorderPoint - qty`), and a `low-view-<id>` button (calls `selectProduct`). When none are
low render `<p data-testid="all-stocked">` instead of the list.

## Presentational components
- `components/ProductRow.tsx` — one product row (see Products page).
- `components/StatCard.tsx` — `<div data-testid={testid}>` with a `-label` and `-value` child.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()` that re-seeds.

### `app/api/products/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ products: Product[] }`. Optional `?low=true` keeps only low products.
- **POST** — body `{ name, qty, reorderPoint }`. 201 with the created product (ids continue
  `p4`…). Missing/blank `name` → 400 `{ error: "name required" }`. Non-numeric or negative
  `qty` → 400 `{ error: "qty invalid" }`. Non-numeric or negative `reorderPoint` → 400
  `{ error: "reorderPoint invalid" }`.
- **PUT** — `?id=<id>` body `{ delta }` adjusts qty (clamped at 0). Non-numeric `delta` →
  400 `{ error: "delta invalid" }`. Unknown id → 404 `{ error: "not found" }`.
