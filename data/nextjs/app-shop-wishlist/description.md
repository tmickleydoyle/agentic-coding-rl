# Shop Wishlist app

Build a small multi-route wishlist shop. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Product = { id: string; name: string; category: string; price: number }`
- `CartLine = { productId: string; qty: number }`
- `CategoryFilter = 'all' | string`
- `Route = 'browse' | 'wishlist' | 'cart' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useShop()` hook that throws if used outside the provider.
It exposes:

- `products: Product[]`, `wishlist: string[]` (product ids), `cart: CartLine[]`
- `theme: Theme`, `route: Route`
- `categoryFilter: CategoryFilter`, `maxPrice: number | null`
- `toggleWishlist(productId)` — adds the id if absent, removes it if present
- `removeFromWishlist(productId)` — drops the id
- `moveToCart(productId)` — adds 1 to the cart (increment if present) **and** removes the id
  from the wishlist
- `addToCart(productId)` — adds 1 to the cart (does not touch the wishlist)
- `removeFromCart(productId)` — drops the cart line
- `setCategoryFilter`, `setMaxPrice`, `setTheme`, `navigate(route)`

Seed data (5 products):

| product | id | category | price |
|---|---|---|---|
| Aero Mug      | `w1` | kitchen | 12 |
| Desk Lamp     | `w2` | office  | 30 |
| Notebook      | `w3` | office  | 6  |
| Chef Knife    | `w4` | kitchen | 45 |
| Yoga Mat      | `w5` | fitness | 25 |

The wishlist and cart start empty.

## Derived helpers — `hooks/useWishlist.ts`
Selectors over shared state: `wishlistProducts` (the products whose ids are in `wishlist`,
in product order), `wishlistCount` (length of the wishlist), `cartCount` (sum of cart qtys),
and `visible` (products after the category + max-price filters). Pure helpers
`filterProducts` and `isWishlisted` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`browse`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-browse" | "nav-wishlist" | "nav-cart" | "nav-settings"` (labels
Browse / Wishlist / Cart / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute. The
wishlist button shows a `<span data-testid="wishlist-badge">` with the current wishlist
count; the cart button shows a `<span data-testid="cart-badge">` with the cart item count.

## Pages
### `app/browse/page.tsx` — `data-testid="page-browse"`
A `<Filters>` block (category select + max-price input) then the product grid. Each product
renders via `ProductCard` as `<li data-testid="product-<id>">` containing the name, category,
a `price-<id>` value, a `wish-<id>` button (calls `toggleWishlist`; its text/`data-wished`
reflects whether the product is wishlisted) and an `add-<id>` button (calls `addToCart`).
The `<li>` has `data-wished="true|false"`. When no product matches the filters, render
`<p data-testid="empty-state">` and **no** `product-grid`. Otherwise wrap cards in
`<ul data-testid="product-grid">`.

### `app/wishlist/page.tsx` — `data-testid="page-wishlist"`
If the wishlist is empty render `<p data-testid="wishlist-empty">`. Otherwise an
`<ul data-testid="wishlist-items">` where each item is `<li data-testid="wish-item-<id>">`
with the product name, a `move-<id>` button (calls `moveToCart`) and a `wish-remove-<id>`
button (calls `removeFromWishlist`).

### `app/cart/page.tsx` — `data-testid="page-cart"`
If the cart is empty render `<p data-testid="cart-empty">`. Otherwise an
`<ul data-testid="cart-lines">` where each line is `<li data-testid="cart-line-<id>">` with
the product name, a `cart-qty-<id>` value (the qty), and a `cart-remove-<id>` button. Show a
`cart-total` value = sum of `price * qty`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` shows the current theme; `theme-toggle` flips light/dark
in context (reflected on `app-root`'s `data-theme`). Also a `<p data-testid="counts-summary">`
that reads `"<wishlistCount> wishlisted, <cartCount> in cart"`.

## Presentational components
- `components/ProductCard.tsx` — one product card (see Browse page).
- `components/Filters.tsx` — `category-filter` `<select>` (an `all` → "All categories" option
  plus one per distinct category) and a `max-price` number input.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. Independent of the client Context state.

### `app/api/products/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses set
`content-type: application/json`.
- **GET** — `{ products: Product[] }`. Optional `?category=<cat>` and `?maxPrice=<n>` filters
  (combine with AND; `maxPrice` keeps products with `price <= n`).
- **POST** — body `{ name, category, price }`. 201 with the created product (ids continue
  `w6`, `w7`, …). Missing/blank `name` → 400 `{ error: "name required" }`. Non-numeric or
  negative `price` → 400 `{ error: "price invalid" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
