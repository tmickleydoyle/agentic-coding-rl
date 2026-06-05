> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Shop Coupon Checkout app

Build a small multi-route checkout app with coupon codes. Routing is **in-app** (React state
— no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Product = { id: string; name: string; price: number }`
- `CartLine = { productId: string; qty: number }`
- `Coupon = { code: string; kind: 'percent' | 'fixed'; amount: number; minSpend: number }`
  - `percent`: discount = `subtotal * amount / 100` (amount is a percentage, e.g. 10)
  - `fixed`: discount = `amount` (a flat currency amount)
  - `minSpend`: the coupon only applies when `subtotal >= minSpend` (0 means no minimum)
- `Route = 'cart' | 'coupons' | 'checkout' | 'confirmation'`
- `Theme = 'light' | 'dark'`

## Discount rules — `lib/coupons.ts`
A pure `applyCoupon(subtotal, coupon | null)` returning
`{ discount: number; total: number; valid: boolean; message: string }`:
- No coupon → `{ discount: 0, total: subtotal, valid: true, message: '' }`.
- `subtotal < coupon.minSpend` → `{ discount: 0, total: subtotal, valid: false,
  message: 'Spend at least <minSpend> to use this coupon' }`.
- Otherwise compute the raw discount (percent or fixed), **clamp it to at most `subtotal`**
  (never go negative), round to 2 decimals, and return
  `{ discount, total: subtotal - discount, valid: true, message: 'Coupon applied' }`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useShop()` hook that throws if used outside the provider.
It exposes:

- `products: Product[]`, `cart: CartLine[]`, `coupons: Coupon[]`
- `appliedCode: string | null` (the currently applied coupon code, uppercased)
- `theme: Theme`, `route: Route`
- `addToCart(productId)` — adds 1 (increment if present)
- `setQty(productId, qty)` — sets the line qty; `<= 0` removes the line
- `removeFromCart(productId)` — drops the line
- `applyCode(code)` — looks up the coupon by code (case-insensitive). If found, set
  `appliedCode` to its (uppercased) code; if not found, set `appliedCode` to null.
- `clearCoupon()` — set `appliedCode` to null
- `setTheme`, `navigate(route)`

Seed products (4):

| product | id | price |
|---|---|---|
| Aero Mug   | `c1` | 12 |
| Desk Lamp  | `c2` | 30 |
| Notebook   | `c3` | 6  |
| Chef Knife | `c4` | 45 |

Seed coupons (3):

| code | kind | amount | minSpend |
|---|---|---|---|
| `SAVE10`  | percent | 10 | 0  |
| `FLAT5`   | fixed   | 5  | 0  |
| `BIG20`   | percent | 20 | 50 |

The cart starts empty and no coupon is applied.

## Derived helpers — `hooks/useCheckout.ts`
Selectors over shared state: `lines` (each cart line joined to its product with `subtotal` =
`price * qty`), `count` (sum of qtys), `subtotal` (sum of line subtotals, rounded to 2),
`appliedCoupon` (the `Coupon` matching `appliedCode`, or null), and the result of
`applyCoupon(subtotal, appliedCoupon)` spread out as `discount`, `total`, `couponValid`, and
`couponMessage`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`cart`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-cart" | "nav-coupons" | "nav-checkout" | "nav-confirmation"` (labels
Cart / Coupons / Checkout / Confirmation). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute. The cart
button shows a `<span data-testid="cart-badge">` with the item count.

## Pages
### `app/cart/page.tsx` — `data-testid="page-cart"`
Two parts: an "add products" list and the cart. The add list is
`<ul data-testid="product-list">` with each product an `<li data-testid="product-<id>">`
containing the name, a `price-<id>` value, and an `add-<id>` button. The cart: if empty render
`<p data-testid="cart-empty">`; otherwise `<ul data-testid="cart-lines">` where each line is
`<li data-testid="cart-line-<id>">` with the product name, a `line-subtotal-<id>` value, a
`qty-input-<id>` (type number) and a `remove-<id>` button. Show a `cart-subtotal` value.

### `app/coupons/page.tsx` — `data-testid="page-coupons"`
Lists available coupons in `<ul data-testid="coupon-list">`, each
`<li data-testid="coupon-<code>">` showing the code and a human description. An input
`data-testid="code-input"` plus an `apply-code` button that calls `applyCode(input)`. Show the
current applied state: if `appliedCode` is set and the coupon is valid for the current
subtotal, render `<p data-testid="applied-ok">` containing the applied code; if a code is
applied but invalid (min-spend not met) render `<p data-testid="applied-warn">` with the
message; if the typed/applied code matched no coupon (appliedCode null after an apply attempt
with non-empty input) render `<p data-testid="applied-error">Unknown code</p>`. A
`clear-coupon` button calls `clearCoupon`.

(Implementation note: track whether the last apply attempt used a non-empty, unknown code in
local component state so the "Unknown code" error can show; a successful or cleared apply
hides it.)

### `app/checkout/page.tsx` — `data-testid="page-checkout"`
Read-only summary: `summary-subtotal`, `summary-discount`, `summary-total`, and—when a coupon
is applied—`summary-code`. A `place-order` button navigates to `confirmation` when the cart is
non-empty; when the cart is empty render `<p data-testid="checkout-empty">` and no
`place-order` button.

### `app/confirmation/page.tsx` — `data-testid="page-confirmation"`
`<p data-testid="confirmation-message">Thank you</p>` plus a `confirm-total` value echoing the
final total at the time the page renders, and a `confirm-code` (the applied code) when present.

## Presentational components
- `components/CartLineRow.tsx` — one cart line (see Cart page).
- `components/CouponCard.tsx` — one coupon (code + description).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed coupons (same codes/shape as above) plus a `__reset()`
that re-seeds. Independent of the client Context state.

### `app/api/coupons/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses set
`content-type: application/json`.
- **GET** — `{ coupons: Coupon[] }`. Optional `?kind=percent|fixed` filter.
- **GET with `?code=<code>&subtotal=<n>`** — validate a coupon against a subtotal and return
  `{ valid, discount, total, message }` (use the same logic as `applyCoupon`). Unknown code →
  404 `{ error: "not found" }`.
- **POST** — body `{ code, kind, amount, minSpend? }`. 201 with the created coupon (code
  uppercased). Missing/blank `code` → 400 `{ error: "code required" }`. `kind` not
  `percent`/`fixed` → 400 `{ error: "kind invalid" }`. Non-numeric/negative `amount` → 400
  `{ error: "amount invalid" }`. Duplicate code → 409 `{ error: "code exists" }`.
