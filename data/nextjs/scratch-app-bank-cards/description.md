> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Bank Cards dashboard app (simulated)

Build a small multi-route banking cards app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Card = { id: string; label: string; last4: string; frozen: boolean; limit: number }`
- `Charge = { id: string; cardId: string; merchant: string; amount: number }` (positive spend)
- `Route = 'cards' | 'card-detail' | 'transactions' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/CardsProvider.tsx`
A React Context provider holding the whole client app state, plus a `useCards()` hook that
throws if used outside the provider. It exposes:

- `cards: Card[]`, `charges: Charge[]`, `theme: Theme`, `route: Route`,
  `selectedId: string | null`
- `addCharge({ cardId, merchant, amount })` — appends a new `Charge` (fresh id `h6`, `h7`, …).
  Returns `{ ok: true }` on success or `{ ok: false; error: string }` when: the card is
  unknown (`'unknown card'`), the card is frozen (`'card frozen'`), the amount is ≤ 0
  (`'amount must be positive'`), or the charge would push that card's spend over its `limit`
  (`'over limit'`).
- `toggleFreeze(id)` — flips the card's `frozen`
- `setLimit(id, limit)` — updates the card's `limit`
- `select(id)` — sets `selectedId` and navigates to `card-detail`
- `setTheme`, `navigate(route)`

Seed data (3 cards, 5 charges):

| card | id | last4 | frozen | limit |
|---|---|---|---|---|
| Personal Visa  | `k1` | 4242 | false | 1000 |
| Travel Mastercard | `k2` | 1881 | false | 2000 |
| Backup Card    | `k3` | 0007 | true  | 500  |

| charge | id | card | merchant | amount |
|---|---|---|---|---|
| Coffee  | `h1` | `k1` | Coffee Co | 6   |
| Books   | `h2` | `k1` | Bookshop  | 54  |
| Hotel   | `h3` | `k2` | Grand Inn | 320 |
| Flights | `h4` | `k2` | SkyAir    | 480 |
| Dinner  | `h5` | `k1` | Bistro    | 40  |

The first added charge gets id `h6`.

## Derived helpers — `hooks/useCards.ts`
`spendByCard(charges)` → `Record<string, number>` summing amounts per card.
`chargesFor(charges, cardId)` → that card's charges in order. `cardSpend(charges, cardId)` →
the sum of that card's charge amounts. `cardRemaining(card, charges)` →
`card.limit - cardSpend(...)`. `cardTotals(cards, charges)` →
`{ totalLimit, totalSpent, frozenCount, cardCount }`. `useCardsSummary()` returns
`{ totals }` from context.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<CardsProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` that
shows the active page based on `route`. Starts on `cards`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-cards" |
"nav-card-detail" | "nav-transactions" | "nav-settings"`. Clicking one calls `navigate`. The
button for the current route has `aria-current="page"`; the others must **not**.

## Pages
### `app/cards/page.tsx` — `data-testid="page-cards"`
Renders `StatCard`s with value testids `stat-limit-value`, `stat-spent-value`,
`stat-frozen-value`, `stat-count-value`. A `<ul data-testid="card-list">` of `CardRow`s, or
`<p data-testid="empty-cards">` if there are none. Each row is `<li data-testid="card-<id>"
data-frozen="true|false">` with `card-<id>-label`, `card-<id>-last4`, `card-<id>-spent`,
`card-<id>-remaining` values and a `card-<id>-open` button that calls `select(id)`.

### `app/card-detail/page.tsx` — `data-testid="page-card-detail"`
If no card is selected, render `<p data-testid="no-selection">`. Otherwise show `card-label`,
`card-limit`, `card-spent`, `card-remaining`, and a `freeze-state` showing `frozen` or
`active`. A `freeze-toggle` button flips frozen. List the card's charges in `<ul
data-testid="charge-list">`, each `<li data-testid="charge-<id>">` with `charge-<id>-merchant`
and `charge-<id>-amount`. If the card has no charges, render `<p data-testid="no-charges">`.

### `app/transactions/page.tsx` — `data-testid="page-transactions"`
`<form data-testid="charge-form">` with `card-select` (one option per card),
`merchant-input`, `amount-input`, and `submit-charge`. On submit, call `addCharge(...)`. If
it fails render `<p data-testid="charge-error">` with the error and stay; on success render
`<p data-testid="charge-success">` and clear the amount.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` and a `theme-toggle` button flipping light/dark. For each
card, a `<div data-testid="limit-<id>">` with a `limit-<id>-input` bound to its limit and a
`limit-<id>-save` button calling `setLimit(id, value)`. Theme persists across navigation on
`app-root`'s `data-theme`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/CardRow.tsx` — one card list item (see Cards page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()` that re-seeds.

### `app/api/cards/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ cards: Card[] }`.
- **POST** — body `{ label, last4, limit? }`. 201 with the created card (`k4`, …),
  `frozen: false`. Blank label → 400 `{ error: "label required" }`. `last4` not exactly 4
  digits → 400 `{ error: "invalid last4" }`. Missing/negative limit defaults to 0.
- **PATCH** — `?id=<id>` with body `{ frozen?: boolean; limit?: number }`. 200 with the
  updated card. Unknown id → 404 `{ error: "not found" }`.

### `app/api/charges/route.ts`
- **GET** — `{ charges: Charge[] }`. Optional `?cardId=<id>` filter.
- **POST** — body `{ cardId, merchant?, amount }`. 201 with the created charge (`h6`, …).
  Unknown/blank card → 400 `{ error: "invalid card" }`. Non-positive amount → 400
  `{ error: "amount must be positive" }`. Frozen card → 400 `{ error: "card frozen" }`.
