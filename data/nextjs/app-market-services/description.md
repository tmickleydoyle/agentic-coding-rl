# Market Services app

Build a small multi-route service-gigs app. Routing is **in-app** (React state — no `next`
imports). Four routes, a shared Context, one API resource backed by a separate in-memory
store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]` —
no `for...of` over Map/Set; use `.forEach`/`Array.from`/index loops.

## Types — `lib/types.ts`
- `Category = 'design' | 'writing' | 'dev' | 'audio'`
- `Review = { id: string; author: string; rating: number; text: string }`
- `Gig = { id: string; title: string; category: Category; price: number; reviews: Review[] }`
- `Booking = { id: string; gigId: string; name: string }`
- `CategoryFilter = 'all' | Category`
- `Route = 'gigs' | 'detail' | 'book' | 'bookings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws outside the provider. It exposes:
- `gigs: Gig[]`, `bookings: Booking[]`, `theme: Theme`, `route: Route`
- `categoryFilter: CategoryFilter`, `selectedId: string | null`
- `select(id)` — sets `selectedId` and navigates to `detail`
- `book(gigId, name)` — appends a `Booking` (fresh id `bk{N}`) only if `name` is non-blank,
  returning `true`; on a blank name it returns `false` and adds nothing
- `addReview(gigId, { author, rating, text })` — appends a `Review` (fresh id `r{N}`) to that
  gig
- `setCategoryFilter`, `setTheme`, `navigate(route)`

Seed data (3 gigs `g1`–`g3`):

| gig | id | category | price | reviews |
|---|---|---|---|---|
| Logo design   | `g1` | design  | 80 | `r1` (sam, 5, "Great!"), `r2` (mia, 4, "Solid") |
| Blog post     | `g2` | writing | 50 | (none) |
| Bug fix       | `g3` | dev     | 120| `r3` (lee, 3, "Ok") |

The first new booking is `bk1`; the first new review is `r4`.

## Optional helper — `hooks/useGigs.ts`
Derived selectors: `filtered` (gigs after the category filter) and pure helpers
`filterGigs` and `averageRating(gig)` (mean of its review ratings, or `0` when none).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>`
with `<NavBar/>` and `<main data-testid="page-content">`. Starts on `gigs`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-gigs | nav-detail | nav-book | nav-bookings`
(labels Gigs / Detail / Book / My Bookings). Active route's button has `aria-current="page"`.

## Pages
### `app/gigs/page.tsx` — `data-testid="page-gigs"`
A `<Filters>` block (category select) then the gig list. Each gig renders via `GigCard` as
`<li data-testid="gig-<id>">` with `gig-<id>-title`, `gig-<id>-price`, `gig-<id>-rating`
(its average rating), and a `view-<id>` button (calls `select`). When no gig matches the
filter, render `<p data-testid="empty-state">` and no `gig-list`. Otherwise wrap rows in
`<ul data-testid="gig-list">`.

### `app/detail/page.tsx` — `data-testid="page-detail"`
Selected gig. If none/not found → `<p data-testid="no-selection">`. Otherwise show
`detail-title`, `detail-price`, `detail-rating` (average), a `book-this` button that
navigates to `book`, and a reviews list `<ul data-testid="review-list">` with
`<li data-testid="review-<id>">` (author + rating + text), or `<p data-testid="no-reviews">`
when the gig has none. Include a review form `<form data-testid="review-form">` with
`review-author`, `review-rating` (number), `review-text`, and `submit-review`; on submit with
a non-blank author it calls `addReview` and the new review appears in the list.

### `app/book/page.tsx` — `data-testid="page-book"`
If no gig is selected → `<p data-testid="no-selection">`. Otherwise a
`<form data-testid="book-form">` with a `book-name` input and `submit-booking` button.
On submit: if name is blank render `<p data-testid="form-error">` and stay; otherwise `book(...)`
and `navigate('bookings')`.

### `app/bookings/page.tsx` — `data-testid="page-bookings"`
`<ul data-testid="bookings-list">` of `<li data-testid="booking-<id>">` showing the gig
title (`booking-<id>-gig`) and customer name (`booking-<id>-name`). Empty →
`<p data-testid="no-bookings">`, no list.

## Presentational components
- `components/GigCard.tsx` — one gig row (see Gigs page).
- `components/Filters.tsx` — `category-filter` `<select>` with an `all` → "All categories"
  option plus one per category.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`.

### `app/api/gigs/route.ts`
Web handlers; re-export `__reset`. JSON `content-type: application/json`.
- **GET** — `{ gigs: Gig[] }`. Optional `?category=<cat>` filter.
- **POST** — body `{ title, category?, price? }`. 201 with the created gig (`reviews: []`,
  `category` default `dev`, `price` default `0`; ids `g4`, `g5`, …). Blank `title` → 400
  `{ error: "title required" }`.
- **PUT** — `?id=<id>` with body `{ author, rating, text? }` appends a review to that gig
  (review ids `r4`, `r5`, …) and returns the updated gig. Unknown id → 404
  `{ error: "not found" }`. Blank `author` → 400 `{ error: "author required" }`.
