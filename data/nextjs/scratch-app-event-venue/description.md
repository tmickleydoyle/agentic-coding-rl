> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Event Venue Booking app

Build a small multi-route venue-booking app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding all cross-route state, and an API
route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Venue = { id: string; name: string; capacity: number }`
- `Booking = { id: string; venueId: string; date: string; attendees: number; organizer: string }`
- `Route = 'venues' | 'venue-detail' | 'book' | 'bookings'`
- `Theme = 'light' | 'dark'`

`date` is a `YYYY-MM-DD` string from a fixed list of `DATES`:
`['2026-06-01','2026-06-02','2026-06-03']`. A venue is **unavailable** on a date when it
already has a booking on that date.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `venues: Venue[]`, `bookings: Booking[]`, `dates: string[]`, `theme: Theme`, `route: Route`,
  `selectedVenueId: string | null`
- `selectVenue(id)` — sets `selectedVenueId` and navigates to `venue-detail`.
- `isAvailable(venueId, date)` — true when the venue has no booking on that date.
- `bookingsFor(venueId)` — bookings for that venue.
- `book({ venueId, date, attendees, organizer })` — appends a `Booking` with a fresh id
  (`b3`, `b4`, …) **only if** the venue exists, `organizer` is non-blank, `attendees` is a
  positive integer `<= capacity`, and the venue is available on that date. Returns `true` on
  success, `false` otherwise.
- `cancel(id)` — drops the booking.
- `setTheme`, `navigate(route)`

Seed data (2 venues, 2 bookings):

| venue | id | capacity |
|---|---|---|
| Grand Hall | `g1` | 200 |
| Studio B   | `g2` | 40 |

| booking | id | venue | date | attendees | organizer |
|---|---|---|---|---|---|
| `b1` | `g1` | `2026-06-01` | 150 | Ada |
| `b2` | `g2` | `2026-06-02` | 30 | Grace |

The first added booking gets id `b3`. So `g1` is unavailable on `2026-06-01`.

## Optional helper — `hooks/useAvailability.ts`
Derived selectors: `availableVenues(date)` (venues with no booking on that date),
`bookingCount(venueId)`, and `totalAttendees` (sum of attendees across all bookings). Pure
helpers `venueIsBooked(bookings, venueId, date)` and `findAvailable(venues, bookings, date)`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">` showing the
active page. Starts on `venues`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-venues" |
"nav-venue-detail" | "nav-book" | "nav-bookings"` (labels Venues / Venue / Book / Bookings).
Clicking calls `navigate`. The current route's button has `aria-current="page"`; others must
**not**.

## Pages
### `app/venues/page.tsx` — `data-testid="page-venues"`
A `date-select` (one option per `DATES`). Lists all venues as `<li data-testid="venue-<id>">`
with `venue-<id>-name`, `venue-<id>-capacity`, an availability marker
`<span data-testid="venue-<id>-status">` reading `available` or `booked` for the chosen date,
and a `view-<id>` button calling `selectVenue(id)`. Wrap rows in
`<ul data-testid="venues-list">`.

### `app/venue-detail/page.tsx` — `data-testid="page-venue-detail"`
If `selectedVenueId` is null/unknown, render `<p data-testid="no-venue">`. Otherwise show
`venue-name`, `venue-capacity`, a `book-btn` that navigates to `book`, and the venue's
bookings as `<li data-testid="vb-<id>">` with `vb-<id>-date` and `vb-<id>-attendees`, wrapped
in `<ul data-testid="venue-bookings">`. If the venue has no bookings, render
`<p data-testid="no-bookings">`.

### `app/book/page.tsx` — `data-testid="page-book"`
If no venue is selected, render `<p data-testid="no-venue">`. Otherwise a
`<form data-testid="book-form">` with `organizer-input`, a `date-select` (one option per
`DATES`), an `attendees-input` (number, default 1), and `submit-book`. On submit: if organizer
is blank, render `<p data-testid="form-error">` and stay. Otherwise call `book(...)`; on
success navigate to `bookings`; if it returns false render `<p data-testid="book-error">`
(over capacity or the date is taken).

### `app/bookings/page.tsx` — `data-testid="page-bookings"`
Lists all bookings as `<li data-testid="booking-<id>">` with `booking-<id>-venue`,
`booking-<id>-date`, `booking-<id>-attendees`, `booking-<id>-organizer`, and a `cancel-<id>`
button calling `cancel(id)`. Show `<span data-testid="total-attendees">` (sum across all
bookings). When there are no bookings, render `<p data-testid="empty-state">` and **no**
`bookings-list`; otherwise wrap rows in `<ul data-testid="bookings-list">`.

## Presentational components
- `components/VenueCard.tsx` — `{ venue, status, onView }` → a `venue-<id>` row.
- `components/BookingRow.tsx` — one booking row for the bookings page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`. Independent of
the client Context state.

### `app/api/bookings/route.ts`
Web `Request`/`Response`. re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ bookings: Booking[] }`. Optional `?venueId=<id>` and `?date=<date>` filters
  (combine with AND).
- **POST** — body `{ venueId, date, attendees, organizer }`. 201 with the created booking
  (ids continue `b3`, `b4`, …). If `venueId`, `date`, or `organizer` is missing/blank, or
  `attendees` is not a positive integer → 400 `{ error: "invalid booking" }`. If the venue is
  unknown → 404 `{ error: "not found" }`. If `attendees` exceeds the venue capacity → 422
  `{ error: "over capacity" }`. If the venue is already booked on that date → 409
  `{ error: "date taken" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
