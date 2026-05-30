# Meeting Room Booking app

Build a small multi-route meeting-room booking app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Room = { id: string; name: string; floor: number }`
- `Booking = { id: string; roomId: string; start: number; end: number; title: string }`
  where `start`/`end` are integer hours on a 24h clock (e.g. 9 = 09:00). A booking occupies
  the half-open interval `[start, end)`.
- `Route = 'rooms' | 'book' | 'schedule' | 'my-bookings'`
- `Theme = 'light' | 'dark'`

## Conflict rule
Two bookings on the **same room** conflict when their hour intervals overlap, i.e.
`aStart < bEnd && bStart < aEnd`. Bookings that merely touch (e.g. 9–10 and 10–11) do **not**
conflict. A valid booking requires `start < end`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `rooms: Room[]`, `bookings: Booking[]`, `theme: Theme`, `route: Route`,
  `selectedRoomId: string | null`
- `selectRoom(id)` — sets `selectedRoomId` and navigates to `book`
- `book({ roomId, start, end, title })` — appends a `Booking` with a fresh id (`k3`, `k4`, …)
  **only if** `start < end` and it does not conflict with an existing booking on that room.
  Returns `true` on success, `false` otherwise.
- `cancel(id)` — drops the booking
- `setTheme`, `navigate(route)`

Seed data (3 rooms, 2 bookings):

| room | id | floor |
|---|---|---|
| Aspen   | `m1` | 1 |
| Birch    | `m2` | 2 |
| Cedar   | `m3` | 3 |

| booking | id | room | start | end | title |
|---|---|---|---|---|---|
| `k1` | `m1` | 9  | 10 | Standup |
| `k2` | `m2` | 13 | 14 | Review  |

The first added booking gets id `k3`.

## Optional helper — `hooks/useRoomSchedule.ts`
Derived selectors: `bookingsForRoom(roomId)` (sorted by start), `hasConflict(roomId, start,
end, ignoreId?)`, and `bookingsByRoom` (a map id→count). Pure helpers `overlaps` and
`conflictExists` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`rooms`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-rooms" | "nav-book" | "nav-schedule" | "nav-my-bookings"` (labels
Rooms / Book / Schedule / My Bookings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/rooms/page.tsx` — `data-testid="page-rooms"`
Lists rooms. Each renders as `<li data-testid="room-<id>">` with `room-<id>-name`,
`room-<id>-floor`, and a `select-<id>` button calling `selectRoom(id)` (navigates to `book`).

### `app/book/page.tsx` — `data-testid="page-book"`
If no room is selected, render `<p data-testid="no-room">`. Otherwise show
`<p data-testid="selected-room">` with the room name, a `title-input`, a `start-input`
(number), an `end-input` (number), and `submit-booking`. On submit: if title is empty/
whitespace, render `<p data-testid="form-error">` and stay. Otherwise call `book(...)`; on
success navigate to `my-bookings`; if it returns false, render
`<p data-testid="conflict-error">` (overlap or `start >= end`).

### `app/schedule/page.tsx` — `data-testid="page-schedule"`
Today's schedule grouped by room. For each room render `<li data-testid="room-schedule-<id>">`
showing `room-schedule-<id>-count` (number of bookings on that room) and, for each booking,
a `booking-<id>` entry showing the title and its `start`–`end` hours.

### `app/my-bookings/page.tsx` — `data-testid="page-my-bookings"`
Lists all bookings as `<li data-testid="booking-<id>">` with `booking-<id>-room`,
`booking-<id>-time` (formatted `start`–`end`), `booking-<id>-title`, and a `cancel-<id>`
button. When there are no bookings, render `<p data-testid="empty-state">` and **no**
`bookings-list`; otherwise wrap rows in `<ul data-testid="bookings-list">`.

## Presentational components
- `components/RoomCard.tsx` — `{ room, onSelect }` → a `room-<id>` row.
- `components/BookingRow.tsx` — one booking row for my-bookings.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/bookings/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ bookings: Booking[] }`. Optional `?roomId=<id>` filter.
- **POST** — body `{ roomId, start, end, title }`. 201 with the created booking. If `roomId`
  or `title` is missing/blank, or `start`/`end` are not numbers, or `start >= end` → 400
  `{ error: "invalid booking" }`. If it overlaps an existing booking on that room → 409
  `{ error: "conflict" }`. New ids continue `k3`, `k4`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
