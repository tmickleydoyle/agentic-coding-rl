# Market Seller app

Build a small multi-route seller-dashboard app. Routing is **in-app** (React state — no
`next` imports). Four routes, a shared Context, two API resources backed by a separate
in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]` —
no `for...of` over Map/Set; use `.forEach`/`Array.from`/index loops.

## Types — `lib/types.ts`
- `Product = { id: string; name: string; price: number; stock: number }`
- `Order = { id: string; productId: string; qty: number; fulfilled: boolean }`
- `Route = 'products' | 'orders' | 'add' | 'revenue'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws outside the provider. It exposes:
- `products: Product[]`, `orders: Order[]`, `theme: Theme`, `route: Route`
- `addProduct({ name, price, stock })` — appends a `Product` with a fresh id (`p4`, `p5`, …)
- `fulfillOrder(id)` — sets that order's `fulfilled` to `true`
- `setTheme`, `navigate(route)`

Seed data (3 products `p1`–`p3`, 3 orders `o1`–`o3`):

| product | id | price | stock |
|---|---|---|---|
| Mug    | `p1` | 12 | 100 |
| T-shirt| `p2` | 25 | 40  |
| Sticker| `p3` | 3  | 500 |

| order | id | product | qty | fulfilled |
|---|---|---|---|---|
| `o1` | `p1` | 2 | true  |
| `o2` | `p2` | 1 | false |
| `o3` | `p1` | 3 | false |

The first added product gets id `p4`.

## Optional helper — `hooks/useSeller.ts`
Derived selectors: `revenue` (sum of `qty * product.price` over **fulfilled** orders),
`pending` (count of unfulfilled orders), and `revenueByProduct` (record of productId → its
fulfilled revenue). Pure helpers `computeRevenue`, `countPending`, `revenuePerProduct`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>`
with `<NavBar/>` and `<main data-testid="page-content">`. Starts on `products`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-products | nav-orders | nav-add | nav-revenue`
(labels Products / Orders / Add / Revenue). Active route's button has `aria-current="page"`.

## Pages
### `app/products/page.tsx` — `data-testid="page-products"`
`<ul data-testid="product-list">` of `ProductRow`s: `<li data-testid="product-<id>">` with
`product-<id>-name`, `product-<id>-price`, `product-<id>-stock`. When there are no products,
render `<p data-testid="no-products">` and no list.

### `app/orders/page.tsx` — `data-testid="page-orders"`
`<ul data-testid="order-list">` of `<li data-testid="order-<id>" data-fulfilled="true|false">`
each with the product name (`order-<id>-product`), `order-<id>-qty`, and — only when the
order is unfulfilled — a `fulfill-<id>` button that calls `fulfillOrder`. Already-fulfilled
orders render `<span data-testid="order-<id>-done">` instead of the button.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-form">` with `name-input`, `price-input` (number), `stock-input`
(number), `submit-product`. On submit: if name is empty/whitespace render
`<p data-testid="form-error">` and stay; otherwise `addProduct(...)` and navigate('products').

### `app/revenue/page.tsx` — `data-testid="page-revenue"`
A rollup view. Render `<span data-testid="total-revenue">` (sum over fulfilled orders),
`<span data-testid="pending-count">` (unfulfilled order count), and a per-product breakdown
`<ul data-testid="revenue-breakdown">` with `<li data-testid="rev-<productId>">` showing
`rev-<productId>-value` (that product's fulfilled revenue).

## Presentational components
- `components/ProductRow.tsx` — one product row (see Products page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`.

### `app/api/products/route.ts`
Web handlers; re-export `__reset`. JSON `content-type: application/json`.
- **GET** — `{ products: Product[] }`. Optional `?inStock=true` returns only products with
  `stock > 0`.
- **POST** — body `{ name, price?, stock? }`. 201 with the created product (`price`/`stock`
  default `0`; ids `p4`, `p5`, …). Blank `name` → 400 `{ error: "name required" }`.

### `app/api/orders/route.ts`
- **GET** — `{ orders: Order[] }`. Optional `?fulfilled=true|false` filter.
- **PUT** — `?id=<id>` marks an order fulfilled; returns the updated order. Unknown id →
  404 `{ error: "not found" }`.
