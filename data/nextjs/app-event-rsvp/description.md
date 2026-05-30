# Event RSVP app

Build a small multi-route RSVP app. Routing is **in-app** (React state — no `next` imports
anywhere). Four routes, a shared Context holding all cross-route state, and an API route
handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Rsvp = 'yes' | 'no' | 'maybe' | 'pending'`
- `Invite = { id: string; guest: string; status: Rsvp; extraGuests: number }`
- `EventItem = { id: string; name: string; date: string; invites: Invite[] }`
- `Route = 'events' | 'invite-detail' | 'create' | 'responses'`
- `Theme = 'light' | 'dark'`

A **headcount** for an event = the sum over invites with status `yes` of `1 + extraGuests`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `events: EventItem[]`, `theme: Theme`, `route: Route`,
  `selectedEventId: string | null`, `selectedInviteId: string | null`
- `selectEvent(id)` — sets `selectedEventId` and navigates to `responses`.
- `selectInvite(eventId, inviteId)` — sets both selections and navigates to `invite-detail`.
- `headcount(eventId)` — number described above (0 if unknown).
- `respond(eventId, inviteId, status, extraGuests)` — updates the invite's `status` and
  `extraGuests` **only if** the event+invite exist and `extraGuests` is a non-negative
  integer. Returns `true` on success, `false` otherwise.
- `addEvent(name, date)` — appends an `EventItem` with a fresh id (`e3`, `e4`, …) and an
  empty `invites` list **only if** `name` is non-blank. Returns the new id, or `null`.
- `setTheme`, `navigate(route)`

Seed data (2 events):

| event | id | date | invites |
|---|---|---|---|
| Launch Party | `e1` | 2026-09-10 | `i1` Ada yes +2; `i2` Grace maybe +0; `i3` Linus pending +0 |
| Team Offsite | `e2` | 2026-10-01 | `i4` Edsger no +0 |

So `e1` headcount starts at `3` (Ada yes: 1 + 2). The first added event gets id `e3`.

## Optional helper — `hooks/useResponses.ts`
Derived selectors: `tally(eventId)` (a record `{ yes, no, maybe, pending }` counting invites
by status), and `totalHeadcount` (sum of headcounts across all events). Pure helper
`countHeadcount(invites)`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">` showing the
active page. Starts on `events`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-events" |
"nav-invite-detail" | "nav-create" | "nav-responses"` (labels Events / Invite / Create /
Responses). Clicking calls `navigate`. The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/events/page.tsx` — `data-testid="page-events"`
Lists events as `<li data-testid="event-<id>">` with `event-<id>-name`, `event-<id>-date`,
`event-<id>-headcount` (the headcount number), and a `view-<id>` button calling
`selectEvent(id)`. Wrap rows in `<ul data-testid="events-list">`. Show
`<span data-testid="total-headcount">` (sum across all events).

### `app/responses/page.tsx` — `data-testid="page-responses"`
If no event is selected, render `<p data-testid="no-event">`. Otherwise show `event-name`,
`<span data-testid="event-headcount">`, and the invite list as `<li data-testid="invite-<id>">`
with `invite-<id>-guest`, `invite-<id>-status`, `invite-<id>-extra`, and an `edit-<id>` button
calling `selectInvite(eventId, inviteId)`. Also show tally spans
`<span data-testid="tally-yes">`, `tally-no`, `tally-maybe`, `tally-pending`.

### `app/invite-detail/page.tsx` — `data-testid="page-invite-detail"`
If no invite is selected (or unknown), render `<p data-testid="no-invite">`. Otherwise show
`invite-guest` and a `<form data-testid="rsvp-form">` with a `status-select` (options yes /
no / maybe / pending, default = the invite's current status), an `extra-input` (number,
default = current extraGuests), and `submit-rsvp`. On submit, call `respond(...)`; on success
navigate to `responses`; if it returns false render `<p data-testid="form-error">`.

### `app/create/page.tsx` — `data-testid="page-create"`
A `<form data-testid="create-form">` with `name-input`, `date-input`, and `submit-create`.
On submit: if name is blank, render `<p data-testid="form-error">` and stay; otherwise call
`addEvent(...)` and navigate to `events`.

## Presentational components
- `components/EventCard.tsx` — `{ event, headcount, onView }` → an `event-<id>` row.
- `components/InviteRow.tsx` — one invite row for the responses page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`. Independent of
the client Context state.

### `app/api/events/route.ts`
Web `Request`/`Response`. re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ events: EventItem[] }`. Optional `?id=<id>` returns just that event in the
  array (empty array if unknown).
- **POST** — body `{ name, date }`. 201 with the created event (id `e3`, `e4`, …, empty
  invites). If `name` is missing/blank → 400 `{ error: "invalid event" }`.
- **PATCH** — body `{ eventId, inviteId, status, extraGuests }`. Updates an invite's RSVP.
  200 with the updated invite. If the event or invite is unknown → 404
  `{ error: "not found" }`. If `status` is not one of yes/no/maybe/pending, or `extraGuests`
  is a negative or non-integer number → 400 `{ error: "invalid rsvp" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
