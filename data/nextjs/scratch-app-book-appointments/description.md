> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Appointment Booking app

Build a small multi-route appointment-booking app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Service = { id: string; name: string; durationMin: number }`
- `Booking = { id: string; serviceId: string; slot: string; customer: string }`
- `Route = 'services' | 'book' | 'schedule' | 'my-bookings'`
- `Theme = 'light' | 'dark'`

`slot` is a `HH:MM` time string drawn from a fixed list of `SLOTS`:
`['09:00','10:00','11:00','13:00','14:00','15:00','16:00']`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `services: Service[]`, `bookings: Booking[]`, `slots: string[]`, `theme: Theme`,
  `route: Route`, `selectedServiceId: string | null`
- `selectService(id)` — sets `selectedServiceId` and navigates to `book`
- `book({ serviceId, slot, customer })` — appends a `Booking` with a fresh id (`b3`, `b4`, …)
  **only if** that `slot` is free for that `serviceId`. Returns `true` on success, `false`
  if the slot is already taken for that service (double-booking prevented).
- `cancel(id)` — drops the booking
- `setTheme`, `navigate(route)`

Seed data (3 services, 2 bookings):

| service | id | duration |
|---|---|---|
| Haircut       | `s1` | 30 |
| Massage       | `s2` | 60 |
| Consultation  | `s3` | 45 |

| booking | id | service | slot | customer |
|---|---|---|---|---|
| `b1` | `s1` | `09:00` | Ada |
| `b2` | `s2` | `10:00` | Grace |

The first added booking gets id `b3`.

## Optional helper — `hooks/useSchedule.ts`
Derived selectors: `takenSlots(serviceId)` (slots already booked for a service),
`freeSlots(serviceId)` (the `SLOTS` not taken), and `bookingsByService` (a map id→count).
Pure helpers `isSlotTaken` and `freeSlotsFor` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`services`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-services" | "nav-book" | "nav-schedule" | "nav-my-bookings"` (labels
Services / Book / Schedule / My Bookings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/services/page.tsx` — `data-testid="page-services"`
Lists services. Each service renders as
`<li data-testid="service-<id>">` containing `service-<id>-name`, `service-<id>-duration`
(the number of minutes), and a `select-<id>` button that calls `selectService(id)` (which
navigates to `book`).

### `app/book/page.tsx` — `data-testid="page-book"`
If no service is selected, render `<p data-testid="no-service">`. Otherwise show
`<p data-testid="selected-service">` with the service name, a `customer-input`, a
`slot-select` (one option per **free** slot for the selected service), and a `submit-booking`
button. On submit: if customer is empty/whitespace, render `<p data-testid="form-error">` and
stay. Otherwise call `book(...)`; on success navigate to `my-bookings`; if it returns false,
render `<p data-testid="slot-error">`.

### `app/schedule/page.tsx` — `data-testid="page-schedule"`
A daily schedule grouped by slot. For each slot in `SLOTS` render
`<li data-testid="slot-<slot>">` (e.g. `slot-09:00`) showing `slot-<slot>-count` (number of
bookings in that slot) and, for each booking in that slot, a `booking-<id>` entry with the
service name + customer.

### `app/my-bookings/page.tsx` — `data-testid="page-my-bookings"`
Lists all bookings as `<li data-testid="booking-<id>">` with `booking-<id>-service`,
`booking-<id>-slot`, `booking-<id>-customer`, and a `cancel-<id>` button calling `cancel(id)`.
When there are no bookings, render `<p data-testid="empty-state">` and **no** `bookings-list`;
otherwise wrap rows in `<ul data-testid="bookings-list">`.

## Presentational components
- `components/ServiceCard.tsx` — `{ service, onSelect }` → a `service-<id>` row.
- `components/BookingRow.tsx` — one booking row for my-bookings (see above).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/bookings/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ bookings: Booking[] }`. Optional `?serviceId=<id>` and `?slot=<slot>`
  filters (combine with AND).
- **POST** — body `{ serviceId, slot, customer }`. 201 with the created booking. If
  `serviceId`, `slot`, or `customer` is missing/blank → 400 `{ error: "invalid booking" }`.
  If that slot is already taken for that service → 409 `{ error: "slot taken" }`. New ids
  continue `b3`, `b4`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
