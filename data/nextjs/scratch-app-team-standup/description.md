> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Team Standup app

Build a small multi-route daily-standup app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Member = { id: string; name: string }`
- `Entry = { id: string; memberId: string; date: string; yesterday: string; today: string; blocker: string | null }`
- `Route = 'today' | 'history' | 'team' | 'add-entry'`
- `Theme = 'light' | 'dark'`

The "current" day is the constant `TODAY = '2026-05-29'`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `members: Member[]`, `entries: Entry[]`, `theme: Theme`, `route: Route`
- `selectedDate: string` (defaults to `TODAY`)
- `addEntry({ memberId, yesterday, today, blocker? })` — appends an `Entry` dated `TODAY`
  with a fresh id like `e4`, `e5`, … A blank/whitespace `blocker` is stored as `null`.
- `selectDate(date)` — sets `selectedDate`
- `setTheme`, `navigate(route)`

Seed data (3 members, 3 entries):

| member | id |
|---|---|
| Ada   | `m1` |
| Grace | `m2` |
| Linus | `m3` |

| entry | id | member | date | blocker |
|---|---|---|---|---|
| e1 | `m1` | 2026-05-28 | "Waiting on review" |
| e2 | `m2` | 2026-05-28 | null |
| e3 | `m1` | 2026-05-29 | null |

(`yesterday`/`today` text is free-form; tests don't assert exact prose for seeds beyond
what's listed in the test file.)

## Optional helper — `hooks/useStandup.ts`
Derived selectors over the shared state: `entriesForDate(date)`, `blockerCount(entries)`
(number of entries whose `blocker` is non-null), `dates(entries)` (sorted unique list of
dates, ascending), and `entriesForMember(memberId)`. Pure helpers; not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-today" | "nav-history" | "nav-team" | "nav-add-entry"` (labels
Today / History / Team / Add). Clicking one calls `navigate`. The button for the current
route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Shows today's entries (`date === TODAY`). A `today-blocker-count` span shows how many of
today's entries have a blocker. Then a `<ul data-testid="today-list">` of
`EntryCard`s, or `<p data-testid="today-empty">` when there are none.

### `app/history/page.tsx` — `data-testid="page-history"`
A `<select data-testid="date-select">` listing all distinct entry dates (value = date),
bound to `selectedDate`; changing it calls `selectDate`. Below it a
`<ul data-testid="history-list">` of EntryCards for entries on `selectedDate`, or
`<p data-testid="history-empty">` when none. A `history-count` span shows the number of
entries on the selected date.

### `app/team/page.tsx` — `data-testid="page-team"`
A `<ul data-testid="team-list">`. Each member is `<li data-testid="team-member-<id>">`
with a `team-member-<id>-name` span and a `team-member-<id>-count` span (total number of
that member's entries across all dates).

### `app/add-entry/page.tsx` — `data-testid="page-add-entry"`
`<form data-testid="add-form">` with `member-select` (one option per member),
`yesterday-input`, `today-input`, `blocker-input`, and `submit-entry`. On submit: if either
`yesterday` or `today` is empty/whitespace, render `<p data-testid="form-error">` and stay.
Otherwise `addEntry(...)` and `navigate('today')`.

## Presentational component
- `components/EntryCard.tsx` — one entry: `<li data-testid="entry-<id>" data-has-blocker="true|false">`
  with `entry-<id>-member` (member name), `entry-<id>-yesterday`, `entry-<id>-today`, and —
  only when a blocker exists — `entry-<id>-blocker`.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/standups/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ entries: Entry[] }`. Optional `?date=<date>` and `?memberId=<id>` filters
  (combine with AND). Also supports `?blockers=true` → only entries with a non-null blocker.
- **POST** — body `{ memberId, date?, yesterday, today, blocker? }`. 201 with the created
  entry. `date` defaults to `2026-05-29`. A blank `blocker` becomes `null`. If `yesterday`
  or `today` is missing/blank → 400 `{ error: "yesterday and today required" }`. New ids
  continue `e4`, `e5`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
