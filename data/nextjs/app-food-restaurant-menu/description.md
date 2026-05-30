# Restaurant Menu app

Build a small multi-route restaurant-ordering app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and one
API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Dish = { id: string; name: string; category: string; price: number; vegetarian: boolean }`
- `CartLine = { dishId: string; qty: number }`
- `CategoryFilter = 'all' | string`
- `Route = 'menu' | 'item-detail' | 'cart' | 'checkout'`
- `Theme = 'light' | 'dark'`

`TAX_RATE` is `0.1` (10%). Money is in whole-number cents-free dollars; round the tax with
`Math.round(subtotal * TAX_RATE * 100) / 100`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client state, plus a `useMenu()` hook that throws
if used outside the provider. It exposes:

- `dishes: Dish[]`, `cart: CartLine[]`, `theme: Theme`, `route: Route`,
  `selectedId: string | null`
- `categoryFilter: CategoryFilter`, `vegOnly: boolean`
- `addToCart(dishId)` — adds 1 (or increments an existing line)
- `setQty(dishId, qty)` — sets the line qty; qty ≤ 0 removes the line
- `removeFromCart(dishId)` — removes the line
- `clearCart()` — empties the cart
- `selectDish(id)` — sets `selectedId` and navigates to `item-detail`
- `setCategoryFilter`, `setVegOnly`, `setTheme`, `navigate(route)`

Seed dishes (5):

| dish | id | category | price | vegetarian |
|---|---|---|---|---|
| Bruschetta    | `d1` | Starter | 8  | true  |
| Caesar Salad  | `d2` | Starter | 10 | false |
| Margherita    | `d3` | Main    | 14 | true  |
| Ribeye Steak  | `d4` | Main    | 28 | false |
| Tiramisu      | `d5` | Dessert | 9  | true  |

## Optional helper — `hooks/useMenuViews.ts`
Derived selectors: `categories` (sorted unique category list), `filtered` (dishes matching
the current category filter AND, when `vegOnly`, only vegetarian), `cartCount` (total qty
across cart lines), `subtotal`, `tax`, `total`. Pure helpers `filterDishes` and
`cartTotals(dishes, cart)` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`menu`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-menu | nav-item-detail | nav-cart |
nav-checkout` (labels Menu / Item / Cart / Checkout). Clicking calls `navigate`. The current
route's button has `aria-current="page"`; others must not. Show a `data-testid="cart-badge"`
with the total cart quantity.

## Pages
### `app/menu/page.tsx` — `data-testid="page-menu"`
A `<Filters>` block (category select + a `veg-only` checkbox), then the dish grid. Each dish
renders `<li data-testid="dish-<id>" data-veg="true|false">` containing `dish-<id>-name`,
`dish-<id>-price`, a `view-<id>` button (calls `selectDish`), and an `add-<id>` button (calls
`addToCart`). When nothing matches, render `<p data-testid="menu-empty">` and **no**
`dish-list`; otherwise wrap rows in `<ul data-testid="dish-list">`.

### `app/item-detail/page.tsx` — `data-testid="page-item-detail"`
Shows the selected dish: `detail-name`, `detail-category`, `detail-price`, and a
`detail-add` button (adds to cart). If `selectedId` is null/unknown render
`<p data-testid="no-selection">`.

### `app/cart/page.tsx` — `data-testid="page-cart"`
Each cart line as `<li data-testid="line-<dishId>">` with the dish name, a
`line-<dishId>-qty`, an `inc-<dishId>` button (`setQty +1`), a `dec-<dishId>` button
(`setQty -1`), and a `remove-<dishId>` button. Show `cart-subtotal`, `cart-tax`, and
`cart-total`. When the cart is empty, render `<p data-testid="cart-empty">` and **no**
`cart-lines`. A `clear-cart` button calls `clearCart`.

### `app/checkout/page.tsx` — `data-testid="page-checkout"`
Shows the order summary (`checkout-total`) and a `place-order` button. Clicking it (only when
the cart is non-empty) clears the cart and shows `<p data-testid="order-confirmed">`. When the
cart is empty (including after ordering), render `<p data-testid="checkout-empty">` instead of
the place-order button.

## Presentational components
- `components/DishCard.tsx` — one dish row on the menu page.
- `components/Filters.tsx` — `category-filter` `<select>` (an `all` option plus one per
  category) and a `veg-only` checkbox.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same dishes/ids as above) plus a `__reset()` that
re-seeds. Independent of the client Context state.

### `app/api/menu/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ dishes: Dish[] }`. Optional `?category=<name>` and `?vegetarian=true|false`
  filters (combine with AND).
- **POST** — body `{ name, category?, price?, vegetarian? }`. 201 with the created dish.
  Missing/blank `name` → 400 `{ error: "name required" }`. New ids continue `d6`, `d7`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
