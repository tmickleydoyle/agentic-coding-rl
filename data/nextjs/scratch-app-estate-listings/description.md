> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Estate Listings app

Build a small multi-route property-listings app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all cross-route
state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `PropertyType = 'house' | 'condo' | 'townhouse'`
- `Property = { id: string; address: string; type: PropertyType; price: number; beds: number; baths: number }`
- `TypeFilter = 'all' | PropertyType`
- `BedsFilter = 'all' | number`
- `Route = 'listings' | 'property-detail' | 'favorites' | 'filters'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useEstate()` hook that throws if used outside the provider.
It exposes:

- `properties: Property[]`, `favorites: string[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null`, `typeFilter: TypeFilter`, `bedsFilter: BedsFilter`,
  `maxPrice: number | null`
- `isFavorite(id)` — whether id is favorited
- `toggleFavorite(id)` — add/remove id from favorites
- `setTypeFilter`, `setBedsFilter`, `setMaxPrice`, `setTheme`, `navigate(route)`
- `openProperty(id)` — set `selectedId` and navigate to `property-detail`

Seed data (4 properties, no initial favorites):

| id | address | type | price | beds | baths |
|---|---|---|---|---|---|
| `h1` | 12 Oak St | house | 450000 | 3 | 2 |
| `h2` | 500 Pine Ave | condo | 320000 | 2 | 1 |
| `h3` | 88 Maple Rd | townhouse | 510000 | 4 | 3 |
| `h4` | 7 Birch Ln | house | 615000 | 5 | 4 |

## Optional helper — `hooks/useListings.ts`
`filtered` (properties after the current type/beds/maxPrice filters) and `stats`
(`{ total, favoriteCount, averagePrice }`, averagePrice rounded). Pure helpers
`filterProperties` and `computeStats` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` that
shows the active page. Starts on `listings`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with three buttons: `nav-listings | nav-favorites |
nav-filters` (labels Listings / Favorites / Filters). Clicking calls `navigate`. The button
for the current route has `aria-current="page"`; others must **not**. (The `property-detail`
route is reached via `openProperty`, not the nav.)

## Pages
### `app/listings/page.tsx` — `data-testid="page-listings"`
`listing-count` (number of filtered properties) and `average-price` (stats.averagePrice).
Then the filtered list: each property via `PropertyCard` as
`<li data-testid="property-<id>" data-favorite="true|false">` with address, type, price,
beds, an `open-<id>` button, and a `favorite-<id>` button. When nothing matches render
`<p data-testid="empty-state">` and no `property-list`; otherwise wrap rows in
`<ul data-testid="property-list">`.

### `app/property-detail/page.tsx` — `data-testid="page-property-detail"`
Show the `selectedId` property: `detail-address`, `detail-type`, `detail-price`,
`detail-beds`, `detail-baths`. A `detail-favorite` toggle button and a `detail-back` button
that navigates to `listings`. If no property is selected, render `<p data-testid="detail-empty">`.

### `app/favorites/page.tsx` — `data-testid="page-favorites"`
`favorites-count` and the favorited properties (same `PropertyCard`) in
`<ul data-testid="favorites-list">`, or `<p data-testid="favorites-empty">` when none.

### `app/filters/page.tsx` — `data-testid="page-filters"`
A `<Filters>` block (`type-filter` select, `beds-filter` select, `max-price` input). Also a
`current-theme` `<p>` and a `theme-toggle` button (flips light/dark in context, persists via
`app-root data-theme`). An `apply-filters` button navigates to `listings`.

## Presentational components
- `components/PropertyCard.tsx` — one property row (see Listings page).
- `components/Filters.tsx` — `type-filter`/`beds-filter` `<select>`s and a `max-price`
  `<input>`. Beds select: "Any beds" (`all`) plus 2/3/4 (`+`); type select: "All types"
  (`all`) plus house/condo/townhouse.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same 4 properties) plus `__reset()` that
re-seeds. Independent of the client Context state.

### `app/api/listings/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — with `?id=<id>` returns that property, or 404 `{ error: "not found" }`.
  Otherwise `{ properties: Property[] }` honoring optional `?type=`, `?minBeds=`,
  `?maxPrice=` filters (combine with AND).
- **POST** — body `{ address, type?, price?, beds?, baths? }`. 201 with the created property
  (ids continue `h5`, `h6`, …). Blank/missing address → 400 `{ error: "address required" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
