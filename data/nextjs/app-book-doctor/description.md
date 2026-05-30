# Doctor Appointments app

Build a small multi-route doctor-appointment app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Provider = { id: string; name: string; specialty: string; slots: string[] }`
  where `slots` is a list of ISO date strings (`YYYY-MM-DD`) the provider is available.
- `Appointment = { id: string; providerId: string; date: string; patient: string }`
- `Route = 'providers' | 'book' | 'appointments' | 'history'`
- `Theme = 'light' | 'dark'`

A fixed reference date `TODAY = '2026-06-01'` is exported from `lib/types.ts`. An appointment
is **upcoming** when `date >= TODAY` and **past** when `date < TODAY` (string compare on ISO
dates is fine).

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `providers: Provider[]`, `appointments: Appointment[]`, `today: string`, `theme: Theme`,
  `route: Route`, `selectedProviderId: string | null`
- `selectProvider(id)` — sets `selectedProviderId` and navigates to `book`
- `availableSlots(providerId)` — the provider's `slots` that are **not** already booked for
  that provider.
- `book({ providerId, date, patient })` — appends an `Appointment` with a fresh id (`a3`,
  `a4`, …) **only if** the date is one of the provider's slots and is not already booked for
  that provider. Returns `true` on success, `false` otherwise.
- `cancel(id)` — drops the appointment
- `setTheme`, `navigate(route)`

Seed data (3 providers, 2 appointments):

| provider | id | specialty | slots |
|---|---|---|---|
| Dr. Ada Lovelace  | `p1` | Cardiology  | 2026-06-10, 2026-06-12 |
| Dr. Grace Hopper  | `p2` | Dermatology | 2026-05-20, 2026-06-15 |
| Dr. Alan Turing   | `p3` | Neurology   | 2026-06-20 |

| appointment | id | provider | date | patient |
|---|---|---|---|---|
| `a1` | `p1` | `2026-06-10` | Sam (upcoming) |
| `a2` | `p2` | `2026-05-20` | Pat (past) |

The first added appointment gets id `a3`. Note `p1` slot `2026-06-10` is already taken (by
`a1`), so only `2026-06-12` is available for `p1`; `p2` slot `2026-05-20` is taken (by `a2`),
so only `2026-06-15` is available for `p2`.

## Optional helper — `hooks/useAppointments.ts`
Derived selectors: `upcoming` (appointments with `date >= today`, sorted by date),
`past` (`date < today`, sorted by date), and `freeSlots(providerId)`. Pure helpers
`isUpcoming` and `openSlots` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`providers`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-providers" | "nav-book" | "nav-appointments" | "nav-history"` (labels
Providers / Book / Appointments / History). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/providers/page.tsx` — `data-testid="page-providers"`
Lists providers. Each renders as `<li data-testid="provider-<id>">` with `provider-<id>-name`,
`provider-<id>-specialty`, `provider-<id>-open` (number of available — unbooked — slots), and
a `select-<id>` button calling `selectProvider(id)` (navigates to `book`).

### `app/book/page.tsx` — `data-testid="page-book"`
If no provider is selected, render `<p data-testid="no-provider">`. Otherwise show
`<p data-testid="selected-provider">` (provider name), a `patient-input`, a `slot-select`
(one option per **available** slot), and a `submit-appointment` button. On submit: if patient
is empty/whitespace, render `<p data-testid="form-error">` and stay. Otherwise call
`book(...)`; on success navigate to `appointments`; if it returns false render
`<p data-testid="slot-error">`. If the provider has no available slots, render
`<p data-testid="no-slots">` instead of the form.

### `app/appointments/page.tsx` — `data-testid="page-appointments"`
Lists **upcoming** appointments as `<li data-testid="appt-<id>">` with `appt-<id>-provider`,
`appt-<id>-date`, `appt-<id>-patient`, and a `cancel-<id>` button. When there are none,
render `<p data-testid="empty-state">` and **no** `upcoming-list`; otherwise wrap rows in
`<ul data-testid="upcoming-list">`.

### `app/history/page.tsx` — `data-testid="page-history"`
Lists **past** appointments as `<li data-testid="past-<id>">` with `past-<id>-provider`,
`past-<id>-date`, and `past-<id>-patient`. When there are none, render
`<p data-testid="history-empty">` and **no** `past-list`; otherwise wrap rows in
`<ul data-testid="past-list">`.

## Presentational components
- `components/ProviderCard.tsx` — `{ provider, openCount, onSelect }` → a `provider-<id>` row.
- `components/AppointmentRow.tsx` — one appointment row (prefix + optional cancel passed in).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/appointments/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ appointments: Appointment[] }`. Optional `?providerId=<id>` and
  `?when=upcoming|past` filters (combine with AND; `when` compares `date` to `TODAY`).
- **POST** — body `{ providerId, date, patient }`. 201 with the created appointment. If
  `providerId`, `date`, or `patient` is missing/blank → 400
  `{ error: "invalid appointment" }`. If the provider is unknown or the date is not one of
  its slots → 422 `{ error: "slot unavailable" }`. If that slot is already booked → 409
  `{ error: "slot taken" }`. New ids continue `a3`, `a4`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
