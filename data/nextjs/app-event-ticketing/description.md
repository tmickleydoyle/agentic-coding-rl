# Event Ticketing app

Build a small multi-route event-ticketing app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Tier = { id: string; name: string; price: number; capacity: number; sold: number }`
- `EventItem = { id: string; name: string; date: string; venue: string; tiers: Tier[] }`
- `Order = { id: string; eventId: string; tierId: string; qty: number; buyer: string; total: number }`
- `Route = 'events' | 'event-detail' | 'checkout' | 'my-tickets'`
- `Theme = 'light' | 'dark'`

A tier's remaining capacity is `capacity - sold`; it is **sold out** when remaining `<= 0`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `events: EventItem[]`, `orders: Order[]`, `theme: Theme`, `route: Route`,
  `selectedEventId: string | null`
- `selectEvent(id)` — sets `selectedEventId` and navigates to `event-detail`.
- `remaining(eventId, tierId)` — `capacity - sold` for that tier (0 if unknown).
- `isSoldOut(eventId, tierId)` — true when remaining `<= 0`.
- `buy({ eventId, tierId, qty, buyer })` — appends an `Order` (id `o2`, `o3`, …) and
  increments the tier's `sold` by `qty`, **only if** `buyer` is non-blank, `qty` is a
  positive integer, and `qty <= remaining`. Returns `true` on success, `false` otherwise.
  `total` is `price * qty`.
- `setTheme`, `navigate(route)`

Seed data (2 events, 1 order):

| event | id | date | venue | tiers |
|---|---|---|---|---|
| Synth Fest | `e1` | 2026-07-01 | Hall A | GA `t1` $50 cap 100 sold 20; VIP `t2` $120 cap 10 sold 10 |
| Code Camp | `e2` | 2026-08-15 | Hall B | GA `t3` $30 cap 50 sold 0 |

| order | id | event | tier | qty | buyer | total |
|---|---|---|---|---|---|---|
| `o1` | `e1` | `t1` | 2 | Ada | 100 |

The first added order gets id `o2`. (VIP `t2` starts sold out: sold 10 of 10.)

## Optional helper — `hooks/useOrders.ts`
Derived selectors: `ordersForEvent(eventId)`, `ticketCount` (sum of `qty` across orders),
`revenue` (sum of `total`). Pure helpers `sumQty` and `sumTotal` over an order list.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` showing
the active page. Starts on `events`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-events" |
"nav-event-detail" | "nav-checkout" | "nav-my-tickets"` (labels Events / Event / Checkout /
My Tickets). Clicking calls `navigate`. The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/events/page.tsx` — `data-testid="page-events"`
Lists events as `<li data-testid="event-<id>">` with `event-<id>-name`, `event-<id>-date`,
`event-<id>-venue`, and a `view-<id>` button calling `selectEvent(id)`. Wrap rows in
`<ul data-testid="events-list">`.

### `app/event-detail/page.tsx` — `data-testid="page-event-detail"`
If `selectedEventId` is null or unknown, render `<p data-testid="no-event">`. Otherwise show
`event-name` and a list of tiers as `<li data-testid="tier-<id>">` with `tier-<id>-name`,
`tier-<id>-price`, `tier-<id>-remaining`. Sold-out tiers also render
`<span data-testid="tier-<id>-soldout">`; available tiers render a `buy-<id>` button that
navigates to `checkout` (stash the chosen tier via context — add a `selectedTierId` if you
like, or let checkout default to the first available tier).

### `app/checkout/page.tsx` — `data-testid="page-checkout"`
If no event is selected, render `<p data-testid="no-event">`. Otherwise a
`<form data-testid="checkout-form">` with `buyer-input`, `tier-select` (one option per tier,
showing the name), `qty-input` (number, default 1), and `submit-buy`. On submit: if buyer is
blank, render `<p data-testid="form-error">` and stay. Otherwise call `buy(...)`; on success
navigate to `my-tickets`; if it returns false render `<p data-testid="sold-out-error">`.

### `app/my-tickets/page.tsx` — `data-testid="page-my-tickets"`
Lists orders as `<li data-testid="order-<id>">` with `order-<id>-event`, `order-<id>-tier`,
`order-<id>-qty`, `order-<id>-buyer`, `order-<id>-total`. When there are no orders, render
`<p data-testid="empty-state">` and **no** `orders-list`; otherwise wrap rows in
`<ul data-testid="orders-list">`. Also show `<span data-testid="ticket-count">` (total
tickets) and `<span data-testid="revenue-total">` (total revenue).

## Presentational components
- `components/EventCard.tsx` — `{ event, onView }` → an `event-<id>` row.
- `components/OrderRow.tsx` — one order row for my-tickets.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus `__reset()`.
Independent of the client Context state.

### `app/api/events/route.ts`
Web `Request`/`Response`. re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ events: EventItem[] }`. Optional `?id=<id>` returns just that event in the
  array (empty array if unknown).

### `app/api/orders/route.ts`
re-export `__reset` from the same store.
- **GET** — `{ orders: Order[] }`. Optional `?eventId=<id>` filter.
- **POST** — body `{ eventId, tierId, qty, buyer }`. 201 with the created order. If
  `eventId`, `tierId`, or `buyer` is missing/blank, or `qty` is not a positive integer → 400
  `{ error: "invalid order" }`. If the event or tier is unknown → 404
  `{ error: "not found" }`. If `qty` exceeds the tier's remaining capacity → 409
  `{ error: "sold out" }`. On success increment the tier's `sold` and continue ids `o2`,
  `o3`, …; `total` is `price * qty`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }` (also decrements the tier's `sold`). Unknown
  id → 404 `{ error: "not found" }`.
