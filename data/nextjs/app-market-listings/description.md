# Market Listings app

Build a small multi-route classifieds app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Category = 'electronics' | 'furniture' | 'vehicles' | 'misc'`
- `Listing = { id: string; title: string; category: Category; price: number; seller: string; description: string }`
- `CategoryFilter = 'all' | Category`
- `Route = 'browse' | 'detail' | 'post' | 'favorites'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:
- `listings: Listing[]`, `favorites: string[]` (listing ids), `theme: Theme`, `route: Route`
- `categoryFilter: CategoryFilter`, `selectedId: string | null`
- `addListing({ title, category, price, seller, description })` — appends a `Listing` with a
  fresh id (`l4`, `l5`, …)
- `toggleFavorite(id)` — adds/removes the id from favorites
- `select(id)` — sets `selectedId` and navigates to `detail`
- `setCategoryFilter`, `setTheme`, `navigate(route)`

Seed data (3 listings):

| listing | id | category | price | seller |
|---|---|---|---|---|
| iPhone 12     | `l1` | electronics | 400 | alice |
| Oak desk      | `l2` | furniture   | 150 | bob   |
| Road bike     | `l3` | vehicles    | 220 | carol |

The first added listing gets id `l4`.

## Optional helper — `hooks/useListings.ts`
Derived selectors: `counts` (`{ total, favorites, byCategory }`) and `filtered` (listings
after the current category filter). Pure helpers `countListings` and `filterListings`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` showing
the active page. Starts on `browse`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-browse | nav-detail | nav-post |
nav-favorites` (labels Browse / Detail / Post / Favorites). Clicking calls `navigate`. The
current route's button has `aria-current="page"`; others must not.

## Pages
### `app/browse/page.tsx` — `data-testid="page-browse"`
A `<Filters>` block (category select) then the listing list. Each listing renders via
`ListingCard` as `<li data-testid="listing-<id>">` with the title, category, price, a
`view-<id>` button (calls `select`) and a `fav-<id>` button (calls `toggleFavorite`; its
text is "Unfavorite" when favorited, "Favorite" otherwise). When no listing matches the
filter, render `<p data-testid="empty-state">` and **no** `listing-list`. Otherwise wrap
rows in `<ul data-testid="listing-list">`.

### `app/detail/page.tsx` — `data-testid="page-detail"`
Shows the selected listing. If `selectedId` is null or not found, render
`<p data-testid="no-selection">`. Otherwise render `detail-title`, `detail-price`,
`detail-seller`, `detail-description`, a `contact-seller` button that toggles a
`<p data-testid="contact-info">` (showing the seller name) on/off, and a `detail-fav`
button to toggle favorite.

### `app/post/page.tsx` — `data-testid="page-post"`
`<form data-testid="post-form">` with `title-input`, `category-select` (one option per
category), `price-input` (type number), `seller-input`, `description-input`, and
`submit-listing`. On submit: if title is empty/whitespace render `<p data-testid="form-error">`
and stay; otherwise `addListing(...)` and `navigate('browse')`.

### `app/favorites/page.tsx` — `data-testid="page-favorites"`
Lists favorited listings as `<ul data-testid="favorites-list">` with `<li
data-testid="fav-item-<id>">` rows, each with a `view-<id>` button. When there are no
favorites, render `<p data-testid="no-favorites">` and no list.

## Presentational components
- `components/ListingCard.tsx` — one listing row (see Browse page).
- `components/Filters.tsx` — `category-filter` `<select>` with an `all` → "All categories"
  option plus one per category.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. Independent of the client Context state.

### `app/api/listings/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ listings: Listing[] }`. Optional `?category=<cat>` and `?maxPrice=<n>`
  filters (combine with AND).
- **POST** — body `{ title, category?, price?, seller?, description? }`. 201 with the
  created listing. Missing/blank `title` → 400 `{ error: "title required" }`. New ids
  continue `l4`, `l5`, …. Defaults: category `misc`, price `0`, seller `unknown`,
  description `''`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
