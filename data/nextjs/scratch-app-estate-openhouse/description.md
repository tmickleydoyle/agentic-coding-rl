> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Estate Open House app

Build a small multi-route open-house app. Houses have a scheduled time, a list of
registered visitors, and feedback notes. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Visitor = { name: string }`
- `Feedback = { visitor: string; rating: number; note: string }`
- `House = { id: string; address: string; time: string; visitors: Visitor[]; feedback: Feedback[] }`
- `Route = 'schedule' | 'house-detail' | 'register' | 'feedback'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `houses: House[]`, `theme: Theme`, `route: Route`
- `currentHouseId: string | null` — selected house for detail/register/feedback
- `registerVisitor(houseId, name)` — appends `{ name }` to that house's visitors
- `addFeedback(houseId, { visitor, rating, note })` — appends to that house's feedback
- `selectHouse(id)` — sets `currentHouseId`
- `setTheme`, `navigate(route)`

Seed data (3 houses):

| house | id | address | time | visitors | feedback |
|---|---|---|---|---|---|
| `h1` | 12 Oak St   | 10:00 | Ada, Lee     | Ada/5/"Bright" |
| `h2` | 9 Pine Ave  | 11:30 | Sam          | — |
| `h3` | 4 Elm Rd    | 13:00 | (none)       | — |

So visitor counts: h1 = 2, h2 = 1, h3 = 0. Total visitors across all houses = 3.

## Optional helper — `hooks/useOpenHouses.ts`
Derived selectors over shared state. `visitorCount(house)` returns its visitor count.
`feedbackCount(house)` returns its feedback count. `averageRating(house)` returns the mean
rating over its feedback rounded to one decimal (0 when there is no feedback). `totals`
returns `{ houses, visitors, feedback }` summed across all houses. Pure helpers
`countVisitors` and `avgRating` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`schedule`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-schedule" | "nav-house-detail" | "nav-register" | "nav-feedback"`
(labels Schedule / Detail / Register / Feedback). Clicking one calls `navigate`. The button
for the current route has `aria-current="page"`; the others must **not** have that
attribute.

## Pages
### `app/schedule/page.tsx` — `data-testid="page-schedule"`
Shows `<p data-testid="total-visitors">` (sum of visitors across houses), then a
`<ul data-testid="house-list">`; each house renders via `HouseCard` as
`<li data-testid="house-<id>">` showing the address in `house-<id>-address`, the time in
`house-<id>-time`, the visitor count in `house-<id>-count`, and an `open-<id>` button that
calls `selectHouse(id)` then `navigate('house-detail')`.

### `app/house-detail/page.tsx` — `data-testid="page-house-detail"`
If no house is selected, render `<p data-testid="no-house">`. Otherwise show the address in
`<h1 data-testid="detail-address">`, the time in `<p data-testid="detail-time">`, the
visitor count in `<p data-testid="detail-count">`, the average feedback rating in
`<p data-testid="detail-avg">`, a `<ul data-testid="visitor-list">` (each
`<li data-testid="visitor-<index>">` with the name, 0-based), and a
`<ul data-testid="feedback-list">` (each `<li data-testid="feedback-<index>">` showing the
visitor, rating in `feedback-<index>-rating`, and note).

### `app/register/page.tsx` — `data-testid="page-register"`
If no house is selected, render `<p data-testid="no-house">`. Otherwise a
`<form data-testid="register-form">` with `name-input` and `submit-visitor`. On submit: if
the name is empty/whitespace, render `<p data-testid="form-error">` and stay. Otherwise
register the visitor to the current house and `navigate('house-detail')`.

### `app/feedback/page.tsx` — `data-testid="page-feedback"`
If no house is selected, render `<p data-testid="no-house">`. Otherwise a
`<form data-testid="feedback-form">` with `visitor-input`, `rating-input` (type number,
1–5), `note-input`, and `submit-feedback`. On submit: if the visitor name is empty/
whitespace, render `<p data-testid="form-error">` and stay. Otherwise add the feedback
(rating parsed as a number, defaulting to 0 when blank/NaN) to the current house and
`navigate('house-detail')`.

## Presentational components
- `components/NavBar.tsx`, `components/HouseCard.tsx` (see Schedule page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state. Each returned house carries
extra computed `visitorCount` and `feedbackCount` numbers.

### `app/api/openhouses/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`. Returned houses carry `visitorCount` and
`feedbackCount`.
- **GET** — `{ houses: (...)[] }`. Optional `?houseId=<id>` returns just that one house in
  the array, or an empty array if unknown.
- **POST** — `?houseId=<id>`, body `{ name }` registers a visitor. 201 with the updated
  house. If `name` is missing/blank → 400 `{ error: "name required" }`. Unknown house →
  404 `{ error: "not found" }`.
- **PUT** — `?houseId=<id>`, body `{ visitor, rating?, note? }` adds feedback. 200 with the
  updated house. If `visitor` is missing/blank → 400 `{ error: "visitor required" }`.
  Unknown house → 404 `{ error: "not found" }`. `rating` defaults to 0, `note` to `""`.
