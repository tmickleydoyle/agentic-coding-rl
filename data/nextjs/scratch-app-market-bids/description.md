> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Market Bids app

Build a small multi-route auction app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding all cross-route state, and two API
resources backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]` —
do **not** `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index loops.

## Types — `lib/types.ts`
- `Auction = { id: string; title: string; currentBid: number; highBidder: string | null; hoursLeft: number; closed: boolean }`
- `Bid = { id: string; auctionId: string; bidder: string; amount: number }`
- `Route = 'auctions' | 'detail' | 'mybids' | 'won'`
- `Theme = 'light' | 'dark'`
- The current user is the constant `ME = 'me'`.

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws outside the provider. It exposes:
- `auctions: Auction[]`, `bids: Bid[]`, `theme: Theme`, `route: Route`, `selectedId: string | null`
- `placeBid(auctionId, amount)` — only succeeds if the auction is open and `amount` is
  strictly greater than its `currentBid`; on success it appends a `Bid` (fresh id `b{N}`,
  bidder `ME`), sets the auction's `currentBid = amount` and `highBidder = ME`, and returns
  `true`. On failure it returns `false` and changes nothing.
- `closeAuction(id)` — sets `closed: true`.
- `select(id)` — sets `selectedId` and navigates to `detail`.
- `setTheme`, `navigate(route)`.

Seed data (3 auctions, ids `a1`–`a3`; 1 seed bid `b1`):

| auction | id | currentBid | highBidder | hoursLeft | closed |
|---|---|---|---|---|---|
| Vintage camera | `a1` | 50  | dave  | 5 | false |
| Signed poster  | `a2` | 20  | me    | 2 | true  |
| Gaming console | `a3` | 120 | erin  | 8 | false |

Seed bid: `b1 = { auctionId: 'a2', bidder: 'me', amount: 20 }`. The first new bid gets id `b2`.

## Optional helper — `hooks/useAuctions.ts`
Derived selectors: `counts` (`{ total, open, closed }`), `myBids` (bids by `ME`), and
`wonAuctions` (closed auctions whose `highBidder === ME`). Pure helpers `countAuctions`,
`bidsBy`, `wonBy`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>`
with `<NavBar/>` and `<main data-testid="page-content">`. Starts on `auctions`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-auctions | nav-detail | nav-mybids | nav-won`
(labels Auctions / Detail / My Bids / Won). Active route's button has `aria-current="page"`.

## Pages
### `app/auctions/page.tsx` — `data-testid="page-auctions"`
`<ul data-testid="auction-list">` of `AuctionRow`s: `<li data-testid="auction-<id>"
data-closed="true|false">` with title, `auction-<id>-bid` (current bid), `auction-<id>-time`
(showing hoursLeft, e.g. "5h"), and a `view-<id>` button (calls `select`).

### `app/detail/page.tsx` — `data-testid="page-detail"`
Selected auction. If none/not found → `<p data-testid="no-selection">`. Otherwise show
`detail-title`, `detail-bid` (current), `detail-high` (highBidder or "none"), a bid form
`<form data-testid="bid-form">` with `bid-input` (number) and `place-bid` button, and a
`close-auction` button. On submit: call `placeBid`; if it returns false render
`<p data-testid="bid-error">` (and the bid is unchanged); on success clear the error. If the
auction is `closed`, render `<p data-testid="closed-note">` and do **not** render the bid form.

### `app/mybids/page.tsx` — `data-testid="page-mybids"`
`<ul data-testid="mybids-list">` of `<li data-testid="mybid-<bidId>">` for each bid by `ME`
(showing the auction title and amount). Empty → `<p data-testid="no-bids">`, no list.

### `app/won/page.tsx` — `data-testid="page-won"`
`<ul data-testid="won-list">` of `<li data-testid="won-<auctionId>">` for closed auctions
the user won (highBidder === ME). Empty → `<p data-testid="no-won">`, no list.

## Presentational components
- `components/AuctionRow.tsx` — one auction row (see Auctions page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`. Independent of
the client Context.

### `app/api/auctions/route.ts`
Web handlers; re-export `__reset`. JSON `content-type: application/json`.
- **GET** — `{ auctions: Auction[] }`. Optional `?open=true` returns only non-closed.
- **POST** — body `{ title, hoursLeft?, startBid? }`. 201 with the created auction
  (`currentBid = startBid ?? 0`, `highBidder = null`, `closed = false`, ids `a4`, `a5`, …).
  Blank `title` → 400 `{ error: "title required" }`.

### `app/api/bids/route.ts`
- **GET** — `{ bids: Bid[] }`. Optional `?auctionId=<id>` filter.
- **POST** — body `{ auctionId, bidder, amount }`. The bid must be strictly greater than the
  auction's `currentBid` and the auction must be open. On success: 201 with the created bid
  (ids `b2`, `b3`, …) and the auction's `currentBid`/`highBidder` are updated. Unknown
  `auctionId` → 404 `{ error: "not found" }`. Closed auction → 409 `{ error: "auction closed" }`.
  `amount` not greater than current → 400 `{ error: "bid too low" }`.
