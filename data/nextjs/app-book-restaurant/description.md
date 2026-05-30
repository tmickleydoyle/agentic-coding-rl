# Restaurant Reservations app

Build a small multi-route restaurant-reservation app. Routing is **in-app** (React state —
no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Table = { id: string; name: string; capacity: number }`
- `Reservation = { id: string; tableId: string; time: string; party: number; name: string }`
- `Route = 'availability' | 'reserve' | 'reservations' | 'tables'`
- `Theme = 'light' | 'dark'`

`time` is a `HH:MM` string from a fixed list of `TIMES`:
`['17:00','18:00','19:00','20:00','21:00']`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `tables: Table[]`, `reservations: Reservation[]`, `times: string[]`, `theme: Theme`,
  `route: Route`
- `availableTables(time, party)` — the tables whose `capacity >= party` and that are **not**
  already reserved at that `time`.
- `reserve({ tableId, time, party, name })` — appends a `Reservation` with a fresh id
  (`r3`, `r4`, …) **only if** the table is free at that time and its capacity fits the party.
  Returns `true` on success, `false` otherwise.
- `cancel(id)` — drops the reservation
- `setTheme`, `navigate(route)`

Seed data (3 tables, 2 reservations):

| table | id | capacity |
|---|---|---|
| T1 Window  | `t1` | 2 |
| T2 Booth   | `t2` | 4 |
| T3 Patio   | `t3` | 6 |

| reservation | id | table | time | party | name |
|---|---|---|---|---|---|
| `r1` | `t1` | `19:00` | 2 | Ada |
| `r2` | `t2` | `20:00` | 3 | Grace |

The first added reservation gets id `r3`.

## Optional helper — `hooks/useAvailability.ts`
Derived selectors: `isReserved(tableId, time)`, `freeTables(time, party)`, and
`reservationsByTime` (a map time→count). Pure helpers `tableIsReserved` and `findFreeTables`
are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`availability`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-availability" | "nav-reserve" | "nav-reservations" | "nav-tables"` (labels
Availability / Reserve / Reservations / Tables). Clicking one calls `navigate`. The button
for the current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/availability/page.tsx` — `data-testid="page-availability"`
A `time-select` (one option per `TIMES`) and a `party-input` (number). Below, a list of
tables that are available for that time + party. Each available table renders as
`<li data-testid="avail-<id>">` with `avail-<id>-name`, `avail-<id>-capacity`, and a
`reserve-<id>` button that calls `navigate('reserve')` after stashing the chosen
time/party/table (use context or simple local state via the reserve page reading defaults).
For simplicity, the reserve button just navigates to `reserve`. If no table is available,
render `<p data-testid="none-available">`.

### `app/reserve/page.tsx` — `data-testid="page-reserve"`
`<form data-testid="reserve-form">` with `name-input`, `table-select` (one option per
table, showing the name), `time-select` (one per `TIMES`), `party-input` (number), and
`submit-reserve`. On submit: if name is empty/whitespace, render `<p data-testid="form-error">`
and stay. Otherwise call `reserve(...)`; on success navigate to `reservations`; if it returns
false, render `<p data-testid="conflict-error">` (table full or already reserved).

### `app/reservations/page.tsx` — `data-testid="page-reservations"`
Lists reservations as `<li data-testid="reservation-<id>">` with `reservation-<id>-table`,
`reservation-<id>-time`, `reservation-<id>-party`, `reservation-<id>-name`, and a
`cancel-<id>` button calling `cancel(id)`. When there are no reservations, render
`<p data-testid="empty-state">` and **no** `reservations-list`; otherwise wrap rows in
`<ul data-testid="reservations-list">`.

### `app/tables/page.tsx` — `data-testid="page-tables"`
Lists all tables as `<li data-testid="table-<id>">` with `table-<id>-name`,
`table-<id>-capacity`, and `table-<id>-reservations` (the number of reservations for that
table).

## Presentational components
- `components/TableCard.tsx` — `{ table, reservationCount }` → a `table-<id>` row.
- `components/ReservationRow.tsx` — one reservation row for the reservations page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/reservations/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ reservations: Reservation[] }`. Optional `?tableId=<id>` and `?time=<time>`
  filters (combine with AND).
- **POST** — body `{ tableId, time, party, name }`. 201 with the created reservation. If
  `tableId`, `time`, or `name` is missing/blank, or `party` is not a positive number → 400
  `{ error: "invalid reservation" }`. If the party exceeds the table capacity → 422
  `{ error: "over capacity" }`. If the table is already reserved at that time → 409
  `{ error: "table taken" }`. New ids continue `r3`, `r4`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
