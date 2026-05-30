# Conference Scheduler app

Build a small multi-route conference-scheduler app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and an
API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Session = { id: string; title: string; track: string; slot: string; speaker: string }`
- `Route = 'schedule' | 'session-detail' | 'my-agenda' | 'speakers'`
- `Theme = 'light' | 'dark'`

`slot` is a `HH:MM` string from a fixed list of `SLOTS`:
`['09:00','10:00','11:00','13:00','14:00']`. Two sessions **conflict** when they share the
same `slot`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `sessions: Session[]`, `agenda: string[]` (session ids the user added), `theme: Theme`,
  `route: Route`, `selectedSessionId: string | null`
- `selectSession(id)` — sets `selectedSessionId` and navigates to `session-detail`.
- `inAgenda(id)` — whether the session id is in the agenda.
- `conflictsWith(id)` — returns the id of an already-added session that shares the slot with
  session `id`, or `null` if there is no conflict (ignores `id` itself).
- `addToAgenda(id)` — adds the session **only if** it exists and there is no slot conflict.
  Returns `true` on success, `false` otherwise (unknown id or conflict).
- `removeFromAgenda(id)` — drops the id from the agenda.
- `setTheme`, `navigate(route)`

Seed data (4 sessions, agenda starts with `s1`):

| session | id | track | slot | speaker |
|---|---|---|---|---|
| Intro to RL | `s1` | AI | `09:00` | Ada |
| Vector DBs | `s2` | Data | `10:00` | Grace |
| Edge Caching | `s3` | Web | `09:00` | Linus |
| GPU Tuning | `s4` | AI | `11:00` | Edsger |

`agenda` starts as `['s1']`. So `s3` (slot 09:00) conflicts with `s1`.

## Optional helper — `hooks/useAgenda.ts`
Derived selectors: `agendaSessions` (the Session[] in agenda order), `sessionsByTrack` (a
map track→Session[]), and `agendaCount`. Pure helper `findConflict(sessions, agendaIds, id)`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` showing
the active page. Starts on `schedule`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-schedule" |
"nav-session-detail" | "nav-my-agenda" | "nav-speakers"` (labels Schedule / Session /
My Agenda / Speakers). Clicking calls `navigate`. The current route's button has
`aria-current="page"`; others must **not**.

## Pages
### `app/schedule/page.tsx` — `data-testid="page-schedule"`
A `track-filter` select with options `All` plus each distinct track. Lists sessions matching
the filter as `<li data-testid="session-<id>">` with `session-<id>-title`,
`session-<id>-track`, `session-<id>-slot`, and a `view-<id>` button calling
`selectSession(id)`. Wrap rows in `<ul data-testid="sessions-list">`. If nothing matches the
filter, render `<p data-testid="no-sessions">`.

### `app/session-detail/page.tsx` — `data-testid="page-session-detail"`
If `selectedSessionId` is null/unknown, render `<p data-testid="no-session">`. Otherwise show
`session-title`, `session-speaker`, `session-slot`. If the session is already in the agenda,
render a `remove-btn` calling `removeFromAgenda`. Otherwise render an `add-btn` calling
`addToAgenda`; if the add fails (conflict), render `<p data-testid="conflict-error">` that
also includes the conflicting session id in a `conflict-with` span.

### `app/my-agenda/page.tsx` — `data-testid="page-my-agenda"`
Lists agenda sessions as `<li data-testid="agenda-<id>">` with `agenda-<id>-title`,
`agenda-<id>-slot`, and a `drop-<id>` button calling `removeFromAgenda`. Show
`<span data-testid="agenda-count">` (number of sessions). When the agenda is empty, render
`<p data-testid="empty-state">` and **no** `agenda-list`; otherwise wrap rows in
`<ul data-testid="agenda-list">`.

### `app/speakers/page.tsx` — `data-testid="page-speakers"`
Lists each distinct speaker as `<li data-testid="speaker-<name>">` with `speaker-<name>-count`
(number of sessions that speaker has). Use the speaker name verbatim in the testid.

## Presentational components
- `components/SessionCard.tsx` — `{ session, onView }` → a `session-<id>` row.
- `components/AgendaRow.tsx` — one agenda row for my-agenda.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus `__reset()`.
Independent of the client Context state.

### `app/api/sessions/route.ts`
Web `Request`/`Response`. re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ sessions: Session[] }`. Optional `?track=<track>` and `?slot=<slot>` filters
  (combine with AND).
- **POST** — body `{ title, track, slot, speaker }`. 201 with the created session (new ids
  continue `s5`, `s6`, …). If any field is missing/blank → 400 `{ error: "invalid session" }`.
  If `slot` is not one of `SLOTS` → 422 `{ error: "bad slot" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
