> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Shop Storefront app

Build a small multi-route storefront. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Product = { id: string; name: string; category: string; price: number }`
- `CartLine = { productId: string; qty: number }`
- `CategoryFilter = 'all' | string`
- `Route = 'catalog' | 'product' | 'cart' | 'checkout'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useShop()` hook that
throws if used outside the provider. It exposes:

- `products: Product[]`, `cart: CartLine[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` (the product whose detail page is shown)
- `categoryFilter: CategoryFilter`, `maxPrice: number | null`
- `addToCart(productId)` — adds 1 (increments qty if already present)
- `setQty(productId, qty)` — sets the line qty; qty `<= 0` removes the line
- `removeFromCart(productId)` — drops the line
- `selectProduct(id)` — sets `selectedId` and navigates to `product`
- `setCategoryFilter`, `setMaxPrice`, `setTheme`, `navigate(route)`

Seed data (5 products):

| product | id | category | price |
|---|---|---|---|
| Aero Mug      | `s1` | kitchen | 12 |
| Desk Lamp     | `s2` | office  | 30 |
| Notebook      | `s3` | office  | 6  |
| Chef Knife    | `s4` | kitchen | 45 |
| Yoga Mat      | `s5` | fitness | 25 |

The cart starts empty.

## Derived helpers — `hooks/useCart.ts`
Selectors over shared state: `lines` (each cart line joined to its product with a `subtotal`
= `price * qty`), `count` (sum of all qtys), `subtotal` (sum of line subtotals), `tax`
(10% of subtotal, rounded to 2 decimals), and `total` (subtotal + tax). Pure helpers
`cartCount` and `cartSubtotal` are convenient but not required by name. Also a `visible`
selector that applies the category + max-price filters to `products` (a pure `filterProducts`
helper is convenient).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`catalog`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-catalog" | "nav-product" | "nav-cart" | "nav-checkout"` (labels
Catalog / Product / Cart / Checkout). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute. The
cart button also shows a `<span data-testid="cart-badge">` with the current item count.

## Pages
### `app/catalog/page.tsx` — `data-testid="page-catalog"`
A `<Filters>` block (category select + max-price input) then the product grid. Each product
renders via `ProductCard` as `<li data-testid="product-<id>">` containing the name, category,
a `price-<id>` showing the price, a `view-<id>` button (calls `selectProduct`) and an
`add-<id>` button (calls `addToCart`). When no product matches the filters, render
`<p data-testid="empty-state">` and **no** `product-grid`. Otherwise wrap cards in
`<ul data-testid="product-grid">`.

### `app/product/page.tsx` — `data-testid="page-product"`
Detail for `selectedId`. If none selected, render `<p data-testid="no-selection">`.
Otherwise show `product-name`, `product-category`, `product-price`, and an
`add-to-cart` button that adds the selected product to the cart.

### `app/cart/page.tsx` — `data-testid="page-cart"`
If the cart is empty render `<p data-testid="cart-empty">`. Otherwise an
`<ul data-testid="cart-lines">` where each line is `<li data-testid="cart-line-<id>">` with
the product name, a `line-subtotal-<id>` value, a `qty-input-<id>` (type number) bound to the
qty, and a `remove-<id>` button. Show `cart-subtotal`, `cart-tax`, and `cart-total` values.
A `go-checkout` button navigates to `checkout`.

### `app/checkout/page.tsx` — `data-testid="page-checkout"`
A read-only summary: `summary-count`, `summary-subtotal`, `summary-tax`, `summary-total`.
A `place-order` button that, when the cart is non-empty, clears the cart and shows
`<p data-testid="order-confirmed">`. If the cart is empty, render
`<p data-testid="checkout-empty">` and no `place-order` button.

## Presentational components
- `components/ProductCard.tsx` — one product card (see Catalog page).
- `components/Filters.tsx` — `category-filter` `<select>` (an `all` → "All categories"
  option plus one per distinct category) and a `max-price` number input.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/products/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ products: Product[] }`. Optional `?category=<cat>` and `?maxPrice=<n>`
  filters (combine with AND; `maxPrice` keeps products with `price <= n`).
- **POST** — body `{ name, category, price }`. 201 with the created product (ids continue
  `s6`, `s7`, …). Missing/blank `name` → 400 `{ error: "name required" }`. Non-numeric or
  negative `price` → 400 `{ error: "price invalid" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
