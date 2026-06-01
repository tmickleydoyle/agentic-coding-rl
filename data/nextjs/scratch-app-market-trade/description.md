> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Market Trade app

Build a small multi-route barter/trade app. Routing is **in-app** (React state — no `next`
imports). Four routes, a shared Context, one API resource backed by a separate in-memory
store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]` —
no `for...of` over Map/Set; use `.forEach`/`Array.from`/index loops.

## Types — `lib/types.ts`
- `Status = 'pending' | 'accepted' | 'declined'`
- `Item = { id: string; name: string; owner: string }`
- `Offer = { id: string; itemId: string; offeredBy: string; give: string; status: Status }`
- `StatusFilter = 'all' | Status`
- `Route = 'items' | 'detail' | 'offers' | 'mytrades'`
- `Theme = 'light' | 'dark'`
- The current user is the constant `ME = 'me'`.

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws outside the provider. It exposes:
- `items: Item[]`, `offers: Offer[]`, `theme: Theme`, `route: Route`
- `statusFilter: StatusFilter`, `selectedId: string | null`
- `select(id)` — sets `selectedId` and navigates to `detail`
- `propose(itemId, give)` — appends a pending `Offer` (fresh id `of{N}`, `offeredBy: ME`)
  only if `give` is non-blank, returning `true`; on a blank `give` it returns `false` and
  adds nothing
- `accept(id)` — sets that offer's status to `accepted`
- `decline(id)` — sets that offer's status to `declined`
- `setStatusFilter`, `setTheme`, `navigate(route)`

Seed data (3 items `i1`–`i3`, 3 offers `of1`–`of3`):

| item | id | owner |
|---|---|---|
| Skateboard  | `i1` | nina |
| Guitar      | `i2` | me   |
| Camera lens | `i3` | omar |

| offer | id | item | offeredBy | give | status |
|---|---|---|---|---|---|
| `of1` | `i2` | tom  | Headphones | pending  |
| `of2` | `i2` | uma  | Books      | accepted |
| `of3` | `i1` | me   | Old phone  | pending  |

The first new offer gets id `of4`.

## Optional helper — `hooks/useTrades.ts`
Derived selectors: `counts` (`{ total, pending, accepted, declined }`), `offersForItem(id)`,
and `myOffers` (offers where `offeredBy === ME`). Pure helpers `countOffers`,
`offersByItem`, `filterByStatus`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>`
with `<NavBar/>` and `<main data-testid="page-content">`. Starts on `items`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-items | nav-detail | nav-offers | nav-mytrades`
(labels Items / Detail / Offers / My Trades). Active route's button has `aria-current="page"`.

## Pages
### `app/items/page.tsx` — `data-testid="page-items"`
`<ul data-testid="item-list">` of `ItemRow`s: `<li data-testid="item-<id>">` with
`item-<id>-name`, `item-<id>-owner`, and a `view-<id>` button (calls `select`). When there
are no items, render `<p data-testid="no-items">` and no list.

### `app/detail/page.tsx` — `data-testid="page-detail"`
Selected item. If none/not found → `<p data-testid="no-selection">`. Otherwise show
`detail-name`, `detail-owner`, the offers for this item as `<ul data-testid="offer-list">`
with `<li data-testid="offer-<id>" data-status="pending|accepted|declined">` showing
`offer-<id>-give` and — only when the offer is `pending` — an `accept-<id>` and a
`decline-<id>` button. When the item has no offers, render `<p data-testid="no-offers">`.
Include a propose form `<form data-testid="propose-form">` with a `give-input` and a
`submit-offer` button; on submit with a non-blank value it calls `propose` and the new offer
appears; a blank value renders `<p data-testid="form-error">` and adds nothing.

### `app/offers/page.tsx` — `data-testid="page-offers"`
A status filter `<select data-testid="status-filter">` (`all`/`pending`/`accepted`/`declined`)
then `<ul data-testid="all-offers-list">` of `<li data-testid="alloffer-<id>">` for offers
matching the filter (showing the item name and `give`). When none match, render
`<p data-testid="no-matching">` and no list.

### `app/mytrades/page.tsx` — `data-testid="page-mytrades"`
`<ul data-testid="mytrades-list">` of `<li data-testid="mytrade-<id>" data-status="...">` for
offers made by `ME` (showing the item name and status). Empty → `<p data-testid="no-trades">`,
no list.

## Presentational components
- `components/ItemRow.tsx` — one item row (see Items page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`.

### `app/api/offers/route.ts`
Web handlers; re-export `__reset`. JSON `content-type: application/json`.
- **GET** — `{ offers: Offer[] }`. Optional `?itemId=<id>` and `?status=<status>` filters
  (combine with AND).
- **POST** — body `{ itemId, offeredBy?, give }`. 201 with the created offer
  (`status: 'pending'`, `offeredBy` default `unknown`; ids `of4`, `of5`, …). Missing/blank
  `give` → 400 `{ error: "give required" }`.
- **PUT** — `?id=<id>` with body `{ status: 'accepted' | 'declined' }` sets the offer's
  status and returns it. Unknown id → 404 `{ error: "not found" }`. An invalid status →
  400 `{ error: "invalid status" }`.
