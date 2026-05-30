# Estate Mortgage app

Build a small multi-route mortgage tool. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Property = { id: string; address: string; price: number }`
- `Route = 'properties' | 'calculator' | 'compare' | 'saved'`
- `Theme = 'light' | 'dark'`
- `LoanInput = { price: number; downPayment: number; rate: number; termYears: number }`

## Mortgage math — `lib/mortgage.ts`
- `monthlyPayment(input: LoanInput): number` — standard amortized payment.
  Principal `P = max(0, price - downPayment)`, monthly rate `r = (rate/100)/12`,
  `n = termYears * 12`. `M = P·r(1+r)^n / ((1+r)^n − 1)`; if `r === 0`, `M = P/n`; if
  `n <= 0`, return 0. Round to whole dollars.
- `totalInterest(input): number` — `max(0, round(monthly·n − P))`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useMortgage()` hook that throws if used outside the
provider. It exposes:

- `properties: Property[]`, `saved: string[]`, `theme: Theme`, `route: Route`
- `rate: number` (default `5`), `termYears: number` (default `30`),
  `downPayment: number` (default `0`)
- `isSaved(id)`, `toggleSaved(id)`
- `setRate`, `setTermYears`, `setDownPayment`, `setTheme`, `navigate(route)`

Seed data (3 properties, no initial saves):

| id | address | price |
|---|---|---|
| `p1` | 12 Oak St | 450000 |
| `p2` | 500 Pine Ave | 320000 |
| `p3` | 88 Maple Rd | 510000 |

## Optional helper — `hooks/useSaved.ts`
`savedProperties` and `quotes` (`{ property, monthly }[]`) computing each saved property's
monthly payment from the shared `rate`/`termYears`/`downPayment`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`properties`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons `nav-properties | nav-calculator |
nav-compare | nav-saved` (labels Properties / Calculator / Compare / Saved). Active route's
button has `aria-current="page"`; others must **not**.

## Pages
### `app/properties/page.tsx` — `data-testid="page-properties"`
`<ul data-testid="property-list">` of `PropertyCard`s: `<li data-testid="property-<id>"
data-saved="true|false">` with address, price, and a `save-<id>` toggle button.

### `app/calculator/page.tsx` — `data-testid="page-calculator"`
Inputs `price-input` (local state, default 400000), `down-input`, `rate-input`,
`term-input` (the last three read/write the shared `downPayment`/`rate`/`termYears`). Show
`monthly-payment` and `total-interest`. Also a `current-theme` `<p>` and a `theme-toggle`
button (flips light/dark in context, persists via `app-root data-theme`).

### `app/compare/page.tsx` — `data-testid="page-compare"`
Echo the current loan params: `compare-rate`, `compare-term`, `compare-down`. Then a
`<ul data-testid="compare-list">` of saved properties as `<li data-testid="compare-<id>"
data-cheapest="true|false">` with `compare-<id>-address` and `compare-<id>-monthly`. The row
with the lowest monthly payment gets `data-cheapest="true"`. When nothing is saved render
`<p data-testid="compare-empty">` and no list.

### `app/saved/page.tsx` — `data-testid="page-saved"`
`saved-count` and a `<ul data-testid="saved-list">` of `PropertyCard`s (each passing a
`monthly` so `property-<id>-monthly` renders), or `<p data-testid="saved-empty">` when none.

## Presentational components
- `components/PropertyCard.tsx` — `<li data-testid="property-<id>" data-saved>` with
  address, price, optional `property-<id>-monthly`, and a `save-<id>` button.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same 3 properties) plus `__reset()`. Independent
of the client Context.

### `app/api/properties/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `?id=<id>` returns that property or 404 `{ error: "not found" }`; otherwise
  `{ properties: Property[] }`.
- **POST** — body `{ address, price? }`. 201 with the created property (ids continue
  `p4`, `p5`, …). Blank/missing address → 400 `{ error: "address required" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`; unknown id → 404 `{ error: "not found" }`.
