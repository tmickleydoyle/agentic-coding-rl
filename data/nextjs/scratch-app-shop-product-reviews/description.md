> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Product Reviews app

Build a small multi-route product-reviews app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all cross-route
state, and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Product = { id: string; name: string; category: string }`
- `Review = { id: string; productId: string; rating: number; text: string; createdAt: number }`
- `SortBy = 'rating' | 'date'`
- `Route = 'products' | 'product-reviews' | 'write-review' | 'top-rated'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useReviews()` hook that
throws if used outside the provider. It exposes:

- `products: Product[]`, `reviews: Review[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` (the product whose reviews page is shown)
- `sortBy: SortBy`
- `selectProduct(id)` — sets `selectedId` and navigates to `product-reviews`
- `addReview({ productId, rating, text })` — appends a new `Review` (fresh id `r4`, `r5`, …,
  `createdAt` is a monotonically increasing number)
- `removeReview(id)` — drops the review
- `setSortBy`, `setTheme`, `navigate(route)`

Seed data (3 products, 3 reviews). `createdAt` values increase with insertion order.

| product | id | category |
|---|---|---|
| Wireless Mouse  | `p1` | accessories |
| Mechanical Keyboard | `p2` | accessories |
| Standing Desk   | `p3` | furniture |

| review | id | product | rating | text | createdAt |
|---|---|---|---|---|---|
| —  | `r1` | `p1` | 5 | Great mouse | 1 |
| —  | `r2` | `p1` | 3 | A bit small | 2 |
| —  | `r3` | `p2` | 4 | Clicky and nice | 3 |

The first added review gets id `r4` and `createdAt` 4.

## Optional helper — `hooks/useRatings.ts`
Derived selectors. `averageRating(reviews, productId)` returns the mean rating for a product
(0 if none). `reviewsFor(reviews, productId)` returns that product's reviews. `sortReviews(
reviews, sortBy)` returns a sorted copy: by `rating` descending (highest first), or by `date`
descending (newest `createdAt` first). `topRated(products, reviews)` returns products sorted
by average rating descending (products with no reviews count as average 0 and sort last; ties
keep input order). A `useRatings()` hook returning `{ average, sorted, ranked }` for the
selected product / current sort is convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`products`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-products" | "nav-product-reviews" | "nav-write-review" | "nav-top-rated"`
(labels Products / Reviews / Write Review / Top Rated). Clicking one calls `navigate`. The
button for the current route has `aria-current="page"`; the others must **not** have it.

## Pages
### `app/products/page.tsx` — `data-testid="page-products"`
A `<ul data-testid="product-list">` with one `<li data-testid="product-<id>">` per product
showing `product-<id>-name`, `product-<id>-avg` (the average rating, formatted to one decimal
place via `toFixed(1)`), `product-<id>-count` (number of reviews), and a `view-<id>` button
that calls `selectProduct(id)`. There is also a `theme-toggle` button and a
`<p data-testid="current-theme">` here (theme lives in context and reflects on `app-root`).

### `app/product-reviews/page.tsx` — `data-testid="page-product-reviews"`
Shows the selected product's reviews. If `selectedId` is null, render
`<p data-testid="no-selection">`. Otherwise render `<h2 data-testid="selected-name">` with the
product name, a `<p data-testid="selected-avg">` (average to one decimal), a sort control
`<select data-testid="sort-select">` (options `rating`, `date`), and a
`<ul data-testid="review-list">` of `<li data-testid="review-<id>">` rows each containing
`review-<id>-rating`, `review-<id>-text`, and a `remove-<id>` button. If the product has no
reviews, render `<p data-testid="empty-reviews">` and no `review-list`.

### `app/write-review/page.tsx` — `data-testid="page-write-review"`
`<form data-testid="review-form">` with `product-select` (one option per product),
`rating-input` (type number), `text-input` (a textarea or input), and `submit-review`. On
submit: validation — if the rating is not an integer in `1..5`, render
`<p data-testid="form-error">` and stay; if the text is empty/whitespace, render the same
`form-error` and stay. Otherwise add the review and `navigate('product-reviews')` after
selecting that product (so it shows in the reviews list).

### `app/top-rated/page.tsx` — `data-testid="page-top-rated"`
A `<ol data-testid="ranking-list">` of products ranked by average rating descending, each
`<li data-testid="rank-<id>">` showing `rank-<id>-name` and `rank-<id>-avg`.

## Presentational components
- `components/ReviewItem.tsx` — one review row (see Reviews page).
- `components/Stars.tsx` — `{ rating }` → `<span data-testid="stars">` rendering the numeric
  rating (used wherever a rating is shown; optional).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()` that
re-seeds. This is independent of the client Context state.

### `app/api/reviews/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses set
`content-type: application/json`.
- **GET** — `{ reviews: Review[] }`. Optional `?productId=<id>` filter. Optional
  `?sort=rating|date` returns them sorted (rating desc, or date/createdAt desc).
- **POST** — body `{ productId, rating, text }`. 201 with the created review. If `rating` is
  not an integer in `1..5` → 400 `{ error: "rating 1-5 required" }`. If `text` is blank → 400
  `{ error: "text required" }`. New ids continue `r4`, `r5`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/products/route.ts`
- **GET** — `{ products: Product[] }`. Each product includes an `average` field (mean rating,
  number) and a `count` field (review count) computed from the store's reviews.
