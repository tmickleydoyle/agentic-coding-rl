# Inventory Purchase Orders app

Build a small multi-route purchase-orders app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding all cross-route state, and one API
route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `OrderStatus = 'open' | 'partial' | 'received' | 'cancelled'`
- `PurchaseOrder = { id: string; supplier: string; item: string; ordered: number; received: number; cancelled: boolean }`
- `StatusFilter = 'all' | OrderStatus`
- `Route = 'orders' | 'order-detail' | 'new' | 'suppliers'`
- `Theme = 'light' | 'dark'`

Status is **derived** (`orderStatus(o)`): `cancelled` if cancelled; else `received` if
`received >= ordered`; else `partial` if `received > 0`; else `open`. `outstanding(o)` is
`max(0, ordered - received)`.

## Shared state — `components/AppStateProvider.tsx`
A Context provider plus a `useOrdersState()` hook that throws outside the provider. Exposes:

- `orders: PurchaseOrder[]`, `theme`, `route`, `selectedId: string | null`, `statusFilter`
- `receive(id, qty)` — adds `qty` to `received` (clamped to `ordered`, ignores cancelled)
- `cancel(id)` — marks the order cancelled
- `addOrder({ supplier, item, ordered })` — appends a new order (`received: 0`,
  `cancelled: false`, fresh id `po4`…), selects it, and navigates to `order-detail`
- `selectOrder(id)` — selects and navigates to `order-detail`
- `setStatusFilter`, `setTheme`, `navigate(route)`

Seed data:

| id | supplier | item | ordered | received |
|---|---|---|---|---|
| `po1` | Acme   | Bolts   | 100 | 100 |
| `po2` | Acme   | Nuts    | 50  | 20  |
| `po3` | Globex | Washers | 200 | 0   |

## Derived helpers — `hooks/useOrders.ts`
`filtered` (orders after the status filter, by derived status), `suppliers`
(`{ supplier, orders, outstanding }[]` aggregated per supplier and sorted by name, where
`outstanding` sums outstanding of non-cancelled orders), and `selected` (or `null`).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `orders`.

## NavBar — `components/NavBar.tsx`
`nav-orders | nav-order-detail | nav-new | nav-suppliers` (Orders / Detail / New /
Suppliers). Active route's button has `aria-current="page"`; others must not.

## Pages
### `app/orders/page.tsx` — `data-testid="page-orders"`
A `<select data-testid="status-filter">` (all/open/partial/received/cancelled), then the
order list. Each order via `OrderRow` as `<li data-testid="order-<id>" data-status="<status>">`
with `order-<id>-supplier`, `order-<id>-item`, `order-<id>-progress` (`received/ordered`),
`order-<id>-outstanding`, and a `view-<id>` button (calls `selectOrder`). Empty filter →
`<p data-testid="empty-state">` and no list; otherwise wrap in `<ul data-testid="order-list">`.

### `app/order-detail/page.tsx` — `data-testid="page-order-detail"`
Detail for `selectedId`, else `<p data-testid="no-selection">`. Shows `detail-supplier`,
`detail-item`, `detail-ordered`, `detail-received`, `detail-outstanding`, `detail-status`.
A `receive-input` (default `1`), a `receive` button (adds that many), a `receive-all` button
(receives the full outstanding), and a `cancel` button. The `receive`/`receive-all`/`cancel`
buttons are disabled once the order is cancelled.

### `app/new/page.tsx` — `data-testid="page-new"`
Inputs `supplier-input`, `item-input`, `ordered-input` and a `create-order` button. On
invalid input (blank supplier/item or non-positive ordered) show `<p data-testid="form-error">`
and do not create. On success call `addOrder` (which navigates to the new order's detail).

### `app/suppliers/page.tsx` — `data-testid="page-suppliers"`
`current-theme` + `theme-toggle` (reflected on `app-root`). `<p data-testid="supplier-count">`
reads `"<n> suppliers"`. List each supplier as `<li data-testid="supplier-<name>">` with
`supplier-<name>-orders` and `supplier-<name>-outstanding`.

## Presentational components
- `components/OrderRow.tsx` — one order row (see Orders page).

## API — separate in-memory store
`lib/store.ts` holds its own seed data plus `__reset()`.

### `app/api/orders/route.ts`
Web `Request`/`Response`; re-export `__reset`. `content-type: application/json` on all.
- **GET** — `{ orders }`. Optional `?supplier=` filter.
- **POST** — body `{ supplier, item, ordered }`. 201 with the created order (ids `po4`…).
  Blank supplier → 400 `{ error: "supplier required" }`; blank item → 400
  `{ error: "item required" }`; non-positive ordered → 400 `{ error: "ordered invalid" }`.
- **PUT** — `?id=<id>`. `?action=cancel` cancels (200). Otherwise (`action=receive`, default)
  body `{ qty }` receives (clamped to ordered); non-positive qty → 400
  `{ error: "qty invalid" }`; receiving a cancelled order → 409 `{ error: "order cancelled" }`.
  Unknown id → 404 `{ error: "not found" }`.
