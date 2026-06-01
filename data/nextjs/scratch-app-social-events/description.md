> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Community Events app

Build a small multi-route community-events app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all cross-route
state, and two API route handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

To keep upcoming-vs-past deterministic, an event's `day` is an **integer day index** and the
app uses a fixed `NOW = 100` (exported from `lib/types.ts`). An event is **upcoming** when
`day >= NOW`, otherwise **past**.

## Types — `lib/types.ts`
- `Rsvp = 'going' | 'maybe' | 'no'`
- `Event = { id: string; title: string; day: number; rsvp: Rsvp | null; going: number }`
  (`going` is the base attendee count from others; the current user's own RSVP is tracked by
  `rsvp` and counted on top when it equals `'going'`)
- `TimeFilter = 'all' | 'upcoming' | 'past'`
- `Route = 'events' | 'event-detail' | 'create' | 'my-events'`
- `Theme = 'light' | 'dark'`
- export `NOW = 100` and `RSVPS: Rsvp[] = ['going', 'maybe', 'no']`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useEvents()` hook that
throws if used outside the provider. It exposes:

- `events: Event[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` (the event whose detail page is shown)
- `timeFilter: TimeFilter`
- `selectEvent(id)` — sets `selectedId` and navigates to `event-detail`
- `setRsvp(id, rsvp)` — sets the current user's RSVP for that event (replacing any prior one)
- `addEvent({ title, day })` — appends a new `Event` (`rsvp: null`, `going: 0`, fresh id
  `e<N>`)
- `setTimeFilter`, `setTheme`, `navigate(route)`

Seed data (3 events). `NOW = 100`.

| event | id | title | day | rsvp | going |
|---|---|---|---|---|---|
| —  | `e1` | Park Cleanup     | 120 | going | 8 |
| —  | `e2` | Book Club        | 90  | null  | 4 |
| —  | `e3` | Hack Night       | 130 | maybe | 12 |

The first added event gets id `e4`.

## Optional helper — `hooks/useEventStats.ts`
Derived selectors. `attendeeCount(event)` returns `event.going + (event.rsvp === 'going' ? 1 :
0)`. `isUpcoming(event)` returns `event.day >= NOW`. `filterByTime(events, timeFilter)` applies
the filter. `myEvents(events)` returns events where `rsvp` is non-null (the user responded).
`rsvpCounts(events)` returns `Record<Rsvp, number>` counting the user's responses. A
`useEventStats()` hook returning `{ filtered, mine, counts }` is convenient but not required.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`events`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-events" | "nav-event-detail" | "nav-create" | "nav-my-events"` (labels
Events / Detail / Create / My Events). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have it.

## Pages
### `app/events/page.tsx` — `data-testid="page-events"`
A `<Filters>` block (time select: all / upcoming / past) then the event list. Each renders via
`EventCard` as `<li data-testid="event-<id>" data-upcoming="true|false">` containing
`event-<id>-title`, `event-<id>-count` (the attendee count incl. the user's going RSVP), and a
`view-<id>` button calling `selectEvent(id)`. When none match the filter, render
`<p data-testid="empty-state">` and **no** `event-list`; otherwise wrap rows in
`<ul data-testid="event-list">`. Also a `theme-toggle` button and a
`<p data-testid="current-theme">` (theme reflects on `app-root`).

### `app/event-detail/page.tsx` — `data-testid="page-event-detail"`
Shows the selected event. If `selectedId` is null render `<p data-testid="no-selection">`.
Otherwise show `<h2 data-testid="detail-title">`, `<p data-testid="detail-count">` (attendee
count), `<p data-testid="detail-rsvp">` (the user's current RSVP, or `none` when null), and
three RSVP buttons `rsvp-going`, `rsvp-maybe`, `rsvp-no` that call `setRsvp(selectedId, ...)`.

### `app/create/page.tsx` — `data-testid="page-create"`
`<form data-testid="event-form">` with `title-input`, `day-input` (type number), and
`submit-event`. On submit: if the title is empty/whitespace render `<p data-testid="form-error">`
and stay. Otherwise add the event and `navigate('events')`.

### `app/my-events/page.tsx` — `data-testid="page-my-events"`
Lists events the user has RSVP'd to (non-null `rsvp`). A `<ul data-testid="my-list">` of
`<li data-testid="my-<id>">` showing `my-<id>-title` and `my-<id>-rsvp`. Also show RSVP totals
`rsvp-count-<rsvp>-value` for each of `going`,`maybe`,`no`. When the user has no RSVPs, render
`<p data-testid="my-empty">` and no `my-list`.

## Presentational components
- `components/EventCard.tsx` — one event card (see Events page).
- `components/Filters.tsx` — a `time-filter` `<select>` with `all`/`upcoming`/`past` options.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()` that re-seeds.
Independent of the client Context state.

### `app/api/events/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ events: Event[] }`. Optional `?when=upcoming|past` filter (using `NOW`).
- **POST** — body `{ title, day? }`. 201 with the created event (`rsvp: null`, `going: 0`). If
  `title` is missing/blank → 400 `{ error: "title required" }`. New ids continue `e4`, …
- **PUT** — `?id=<id>`. Body `{ rsvp }` sets the RSVP (must be `going`/`maybe`/`no`, else 400
  `{ error: "invalid rsvp" }`). Returns the updated event. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/stats/route.ts`
- **GET** — `{ total: number; upcoming: number; past: number; rsvpCounts: Record<Rsvp,
  number> }` computed from the store (`rsvpCounts` counts events whose `rsvp` equals each
  value).
