> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Supplier directory app

Build a small multi-route supplier/inventory app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Supplier = { id: string; name: string; category: string; leadTimeDays: number; rating: number }`
- `Product = { id: string; name: string; supplierId: string; price: number }`
- `Route = 'suppliers' | 'supplier-detail' | 'products' | 'add'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws if used outside the provider. It exposes:

- `suppliers: Supplier[]`, `products: Product[]`, `theme: Theme`, `route: Route`,
  `categoryFilter: string` (default `'all'`), `selectedId: string | null`
- `addSupplier({ name, category, leadTimeDays, rating? })` — appends a `Supplier` with a
  fresh id like `s4`, `s5`, …
- `setCategoryFilter`, `setTheme`, `navigate(route)`
- `selectSupplier(id)` — sets `selectedId` and navigates to `supplier-detail`

Seed suppliers: `s1` Acme Parts (Hardware, 5d, 4.5), `s2` Global Foods (Food, 12d, 3.8),
`s3` TextilePro (Apparel, 7d, 4.2). Seed products: `pr1` M4 Bolt (s1, 0.1), `pr2` Steel
Hinge (s1, 2.5), `pr3` Olive Oil (s2, 9.0), `pr4` Cotton Roll (s3, 14.0).

## Helper — `hooks/useSuppliers.ts`
Pure helpers `filterByCategory`, `categories` (sorted unique), `productsBySupplier`,
`averageLeadTime` (rounded to 1 dp). The hook returns `filtered`, `cats`, `avgLeadTime`,
`products`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `suppliers`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-suppliers | nav-products | nav-add | nav-supplier-detail`.
Clicking calls `navigate`; the current route's button has `aria-current="page"`.

## Pages
### `app/suppliers/page.tsx` — `data-testid="page-suppliers"`
A `category-filter` select (`all` + one per category), `avg-lead-time` (of the filtered
set), `supplier-count`, and a `supplier-list` of `SupplierCard`s, or `empty-state`.

### `app/supplier-detail/page.tsx` — `data-testid="page-supplier-detail"`
When `selectedId` is null, render `no-selection`. Otherwise `detail-name`,
`detail-category`, `detail-lead`, `detail-rating`, `detail-product-count`, and
`detail-products` (one `detail-product-<id>` with name/price per supplied product), or
`detail-empty` when none.

### `app/products/page.tsx` — `data-testid="page-products"`
A `product-count` and `product-list` where each `product-<id>` shows name, supplier name,
price, and a `product-<id>-open-supplier` button (→ `selectSupplier`). Also a
`current-theme` + `theme-toggle` reflected on `app-root`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-form">` with `name-input`, `category-input`, `lead-input`,
`rating-input`, `submit-supplier`. Validate name (non-empty) and lead time (non-negative
number) → `form-error` and stay; else `addSupplier(...)` and `navigate('suppliers')`.

## Presentational components
- `components/SupplierCard.tsx` — `supplier-<id>` with `-name`/`-category`/`-lead`/`-rating`
  and `open-<id>`.

## API — separate in-memory store
`lib/store.ts` holds its own seed suppliers + products (same ids) + `__reset()`.

### `app/api/suppliers/route.ts`
Web `Request`/`Response`; re-export `__reset`; JSON `content-type: application/json`.
- **GET** — `{ suppliers: Supplier[] }`. Optional `?category=` filter.
- **POST** — body `{ name, leadTimeDays, category?, rating? }`. 201 with the created
  supplier (`s4`, `s5`, …). Blank `name` → 400 `{ error: "name required" }`. Missing/
  negative `leadTimeDays` → 400 `{ error: "leadTimeDays required" }`. Missing category
  defaults to `Uncategorized`.
