> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Shop Order Tracker app

Build a small multi-route order-tracking app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `OrderStatus = 'placed' | 'shipped' | 'delivered'`
- `Order = { id: string; item: string; total: number; status: OrderStatus }`
- `StatusFilter = 'all' | OrderStatus`
- `Route = 'orders' | 'order-detail' | 'track' | 'account'`
- `Theme = 'light' | 'dark'`

The status timeline order is always `['placed', 'shipped', 'delivered']`. An order has
"reached" a step if the step index is `<= ` the index of its current status.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useShop()` hook that throws if used outside the provider.
It exposes:

- `orders: Order[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` (the order shown on the detail/track pages)
- `statusFilter: StatusFilter`
- `reorder(id)` — appends a NEW order copying the item + total of the order with `id`, with
  `status: 'placed'` and a fresh id (`o4`, `o5`, …); does nothing if the id is unknown
- `advance(id)` — moves the order one step along the timeline (placed→shipped→delivered);
  a delivered order stays delivered
- `selectOrder(id)` — sets `selectedId` and navigates to `order-detail`
- `setStatusFilter`, `setTheme`, `navigate(route)`

Seed data (3 orders):

| order | id | item | total | status |
|---|---|---|---|---|
| `o1` | Aero Mug    | 12 | delivered |
| `o2` | Desk Lamp   | 30 | shipped   |
| `o3` | Chef Knife  | 45 | placed    |

The first reordered order gets id `o4`.

## Derived helpers — `hooks/useOrders.ts`
Selectors over shared state: `filtered` (orders after the current status filter), `counts`
(`{ total, placed, shipped, delivered }`), and `selected` (the order whose id is
`selectedId`, or `null`). A pure helper `statusIndex(status)` returning the timeline index
and `reached(order, status)` returning whether the order reached a step are convenient but
not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`orders`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-orders" | "nav-order-detail" | "nav-track" | "nav-account"` (labels
Orders / Detail / Track / Account). Clicking one calls `navigate`. The button for the current
route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/orders/page.tsx` — `data-testid="page-orders"`
A status filter `<select data-testid="status-filter">` (`all` → "All", plus placed/shipped/
delivered) then the orders list. Each order renders via `OrderRow` as
`<li data-testid="order-<id>" data-status="<status>">` with the item, a `order-<id>-total`
value, a `order-<id>-status` value, and a `view-<id>` button (calls `selectOrder`). When no
order matches the filter, render `<p data-testid="empty-state">` and **no** `order-list`.
Otherwise wrap rows in `<ul data-testid="order-list">`.

### `app/order-detail/page.tsx` — `data-testid="page-order-detail"`
Detail for `selectedId`. If none selected render `<p data-testid="no-selection">`. Otherwise
show `detail-item`, `detail-total`, `detail-status`, a `reorder` button (calls `reorder`
with the selected id) and a `go-track` button (navigates to `track`).

### `app/track/page.tsx` — `data-testid="page-track"`
Timeline for `selectedId`. If none selected render `<p data-testid="no-selection">`.
Otherwise render `<ol data-testid="timeline">` with one
`<li data-testid="step-<status>" data-reached="true|false">` per timeline step (placed/
shipped/delivered), where `data-reached` reflects whether the order reached that step. Also
an `advance` button that calls `advance(selectedId)`.

### `app/account/page.tsx` — `data-testid="page-account"`
`<p data-testid="current-theme">` shows the theme; `theme-toggle` flips light/dark
(reflected on `app-root`'s `data-theme`). Also a `<p data-testid="order-summary">` reading
`"<total> orders: <delivered> delivered, <shipped> shipped, <placed> placed"`.

## Presentational components
- `components/OrderRow.tsx` — one order row (see Orders page).
- `components/Timeline.tsx` — renders the `<ol data-testid="timeline">` of steps for an order.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. Independent of the client Context state.

### `app/api/orders/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses set
`content-type: application/json`.
- **GET** — `{ orders: Order[] }`. Optional `?status=placed|shipped|delivered` filter.
- **POST** — body `{ item, total }`. 201 with the created order (`status: 'placed'`, ids
  continue `o4`, `o5`, …). Missing/blank `item` → 400 `{ error: "item required" }`.
  Non-numeric or negative `total` → 400 `{ error: "total invalid" }`.
- **PUT** — `?id=<id>` with body `{ status }` to set an order's status. Invalid status →
  400 `{ error: "status invalid" }`. Unknown id → 404 `{ error: "not found" }`.
