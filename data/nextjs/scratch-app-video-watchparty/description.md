> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Video Watch Party app

Build a small multi-route watch-party app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Constants
`NOW = 100` is the reference "current time". A party with `time > NOW` is **upcoming**;
`time <= NOW` is **past**.

## Types — `lib/types.ts`
- `Party = { id: string; title: string; time: number; rsvped: boolean; queue: string[] }`
  (`queue` is a list of video titles)
- `Filter = 'upcoming' | 'past'`
- `Route = 'parties' | 'party-detail' | 'create' | 'my-parties'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `parties: Party[]`, `theme: Theme`, `route: Route`
- `filter: Filter` — current filter on the parties page (starts `upcoming`)
- `selectedPartyId: string | null`
- `partyStatus(party)` → `'upcoming' | 'past'` (compares `time` to `NOW`)
- `openParty(partyId)` — set `selectedPartyId`, navigate to `party-detail`
- `toggleRsvp(partyId)` — flip the party's `rsvped`
- `queueVideo(partyId, title)` — append the trimmed title to the party's `queue` (no-op on
  empty/whitespace title)
- `removeFromQueue(partyId, index)` — remove the queue item at that index
- `createParty(title, time)` — add a new party (id `p<N>` where N is `parties.length+1`),
  `rsvped:false`, empty queue, navigate to `parties`; no-op on empty title
- `setFilter(filter)`, `setTheme`, `navigate(route)`

Seed data (3 parties):
- `p1` "React Conf Replay" time `150` rsvped `false` queue `[]`
- `p2` "Design Systems Live" time `80` rsvped `false` queue `["Intro"]`
- `p3` "CSS Showcase" time `200` rsvped `false` queue `[]`

## Optional helper — `hooks/useParties.ts`
Pure helpers: `findParty(parties, id)` → party or `undefined`. `statusOf(party)` →
`'upcoming'|'past'`. `filterParties(parties, filter)` → parties matching the filter
(upcoming = `time > NOW`). A `useMyParties()` hook returns the parties where `rsvped` is
true.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `parties`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`nav-parties | nav-party-detail | nav-create | nav-my-parties` (labels Parties / Party /
Create / My Parties). Clicking calls `navigate`. Current route's button has
`aria-current="page"`; others must not.

## Pages
### `app/parties/page.tsx` — `data-testid="page-parties"`
Two buttons `filter-upcoming` and `filter-past` calling `setFilter`; the active one has
`aria-pressed="true"`. Render a `current-filter` element with the filter key. List the
filtered parties as `<li data-testid="party-<id>">` with `party-<id>-title`,
`party-<id>-status` (the status string), and an `open-<id>` button calling `openParty`. If
no parties match, render `<p data-testid="no-parties">`.

### `app/party-detail/page.tsx` — `data-testid="page-party-detail"`
If no `selectedPartyId`, render `<p data-testid="no-party">`. Otherwise show
`<h1 data-testid="detail-title">`, a `detail-status`, an `rsvp-toggle` button (text "RSVP"
when not rsvped, "Cancel RSVP" when rsvped; clicking calls `toggleRsvp`), and a
`rsvp-flag` rendered **only** when rsvped. Show the queue as `<ul data-testid="queue-list">`
with each item `<li data-testid="queue-item-<index>">` containing a `queue-item-<index>-title`
and a `queue-remove-<index>` button. A form: `<input data-testid="queue-input">` and an
`queue-add` button that calls `queueVideo` with the input value then clears it. Also a
`queue-count` element with the number of queued videos.

### `app/create/page.tsx` — `data-testid="page-create"`
A form with `<input data-testid="title-input">`, `<input data-testid="time-input">`
(numeric), and a `create-submit` button calling `createParty(title, Number(time))`. After a
successful create the app navigates to `parties`. If the title is empty, clicking does
nothing (stays on create).

### `app/my-parties/page.tsx` — `data-testid="page-my-parties"`
If no RSVPs, render `<p data-testid="no-rsvps">`. Otherwise a `rsvp-count-value` (number of
rsvped parties) and list each as `<li data-testid="mp-<id>">` with `mp-<id>-title` and
`mp-<id>-status`.

## Presentational components
- `components/PartyRow.tsx` — a `party-<id>` row on the parties page.
- `components/QueueItem.tsx` — one `queue-item-<index>` row on the detail page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/parties/route.ts`
- **GET** — `{ parties: Party[] }`. With `?id=<id>` → `{ party }` or 404
  `{ error: "not found" }`. With `?filter=upcoming` or `?filter=past` → `{ parties }`
  filtered by status.
- **POST** — body `{ title, time }` creates a party (id `p<N>`); 201 with the party.
  Missing/empty title → 400 `{ error: "title required" }`. Non-numeric time → 400
  `{ error: "time required" }`.
- **DELETE** — `?id=<id>` removes a party; 200 `{ ok: true }`. Unknown id → 404
  `{ error: "not found" }`.
