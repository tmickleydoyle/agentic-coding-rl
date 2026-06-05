> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Travel Packing List

Build a small multi-route packing-list app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Category = 'clothing' | 'toiletries' | 'electronics' | 'documents' | 'other'`
- `Item = { id: string; tripId: string; name: string; category: Category; packed: boolean }`
- `Trip = { id: string; name: string }`
- `Route = 'trips' | 'list' | 'add-item' | 'summary'`
- `Theme = 'light' | 'dark'`
- `CATEGORIES: Category[]` — the five categories in the order above.

## Shared state — `components/PackingProvider.tsx`
A React Context provider plus a `usePacking()` hook that throws if used outside the
provider. It exposes:

- `trips: Trip[]`, `items: Item[]`, `theme: Theme`, `route: Route`,
  `selectedTripId: string | null`
- `addItem({ tripId, name, category })` — appends a new `Item` (`packed: false`, fresh id
  `i5`, `i6`, …)
- `togglePacked(id)` — flips `packed`
- `removeItem(id)` — drops the item
- `selectTrip(id)` — sets `selectedTripId` and navigates to `list`
- `setTheme`, `navigate(route)`

Seed data (2 trips, 4 items):

| trip | id |
|---|---|
| Beach Weekend | `tr1` |
| Ski Trip | `tr2` |

| item | id | trip | category | packed |
|---|---|---|---|---|
| Swimsuit | `i1` | `tr1` | clothing | true |
| Sunscreen | `i2` | `tr1` | toiletries | false |
| Passport | `i3` | `tr1` | documents | false |
| Gloves | `i4` | `tr2` | clothing | false |

The first added item gets id `i5`.

## Helper — `hooks/usePackingStats.ts`
Pure helpers `percentPacked(items, tripId)` (rounded percent of that trip's items packed,
`0` when no items) and `groupByCategory(items, tripId)` returning `{ category, items,
packed, total }[]` for categories that have at least one item, in `CATEGORIES` order. A
`useTripList(tripId)` hook returns `{ trip, groups, percent, tripItems }`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<PackingProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">`. Starts
on `trips`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-trips | nav-list | nav-add-item |
nav-summary`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/trips/page.tsx` — `data-testid="page-trips"`
List trips. Each row `trip-<id>` shows `trip-<id>-name`, `trip-<id>-percent` (percent
packed), and an `open-<id>` button that calls `selectTrip`. Empty list → `empty-state`.

### `app/list/page.tsx` — `data-testid="page-list"`
If no trip is selected → `no-trip` + `back-to-trips`. Otherwise `list-name`, `list-percent`
(percent packed), then one block per non-empty category as `category-<cat>` with
`category-<cat>-label`, `category-<cat>-count` (text `packed/total`), and a
`category-<cat>-list` `<ul>`. Each item renders via `ItemRow` as `<li
data-testid="item-<id>" data-packed="true|false">` with `item-<id>-name`, a `toggle-<id>`
button, and a `remove-<id>` button. Also an `add-item-link` button → navigate to
`add-item`. When the trip has no items → `list-empty`.

### `app/add-item/page.tsx` — `data-testid="page-add-item"`
`<form data-testid="add-item-form">` with `trip-select` (defaults to `selectedTripId` or
the first trip), `name-input`, `category-select` (one option per category), and
`submit-item`. Blank name → `form-error`, stay on the page. Otherwise add the item and
`navigate('list')`.

### `app/summary/page.tsx` — `data-testid="page-summary"`
StatCards `stat-trips-value`, `stat-items-value`, `stat-packed-value` (count of packed
items). Then a `trip-progress` list: per trip a `progress-<id>-percent`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/ItemRow.tsx` — one item row (see List page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`.

### `app/api/lists/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — no params → `{ trips }` where each trip includes a `percent` field. With
  `?tripId=<id>` → `{ trip, items, percent }`, or 404 for an unknown id.
- **POST** — body `{ tripId, name, category? }`. 404 if the trip is missing, 400 `{ error:
  "name required" }` if name blank, else 201 with the item (ids `i5`, `i6`, …). An unknown
  category falls back to `other`.
- **PUT** — `?id=<id>`. With body `{ packed: boolean }` set it; with no `packed` key,
  toggle. Returns the updated item. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`, or 404 `{ error: "not found" }`.
