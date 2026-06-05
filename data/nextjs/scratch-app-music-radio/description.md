> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Radio app

Build a small multi-route radio-station app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Station = { id: string; name: string; genre: string; bitrate: number; favorite: boolean; playCount: number }`
- `Route = 'stations' | 'station-detail' | 'favorites' | 'history'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `stations: Station[]`, `theme: Theme`, `route: Route`
- `selectedStationId: string | null` — the station on the detail page
- `nowPlayingId: string | null` — the station currently playing
- `history: string[]` — station ids most-recent-first (no duplicates; max 5 entries)
- `genreFilter: string | null` — active genre filter on the stations list
- `play(stationId)` — sets `nowPlayingId`, bumps that station's `playCount`, and pushes the
  id onto the FRONT of `history` (removing any existing copy first, capping length at 5)
- `stop()` — clears `nowPlayingId` (history untouched)
- `toggleFavorite(stationId)` — flips `favorite`
- `openStation(id)` — sets `selectedStationId` + navigates to `station-detail`
- `clearHistory()` — empties `history`
- `setGenreFilter`, `setTheme`, `navigate(route)`

Seed data — 4 stations:

| station | id | genre | bitrate | favorite | playCount |
|---|---|---|---|---|---|
| Jazz FM   | `r1` | jazz       | 128 | true  | 5 |
| Rock Wave | `r2` | rock       | 256 | false | 2 |
| Chill Hub | `r3` | electronic | 320 | true  | 0 |
| News 24   | `r4` | talk       | 96  | false | 8 |

`nowPlayingId` starts `null`, `history` starts empty.

## Derived helpers — `hooks/useStations.ts`
Pure helpers (convenient, not required by name) plus a `useStations()` hook returning:
- `visibleStations` — `stations` filtered by `genreFilter` (when set; blank/null = all).
- `genres` — sorted unique genres across ALL stations.
- `favorites` — stations with `favorite === true`.
- `selectedStation` — the station whose id is `selectedStationId`, or `null`.
- `nowPlaying` — the station whose id is `nowPlayingId`, or `null`.
- `historyStations` — `Station[]` for ids in `history` (in order; skips missing).
- `totalPlays` — sum of `playCount` across ALL stations.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`stations`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-stations" | "nav-station-detail" | "nav-favorites" | "nav-history"`
(labels Stations / Detail / Favorites / History). The current route's button has
`aria-current="page"`; others must **not**.

Also render `<p data-testid="now-playing">` here showing "Now playing: <name>" when something
is playing, or "Nothing playing" when `nowPlayingId` is null. (This is part of the persistent
chrome so it appears on every route.)

## Pages
### `app/stations/page.tsx` — `data-testid="page-stations"`
A `genre-filter` `<select>` (option `all` = "All genres" plus one per genre in `genres`),
then the list. Wrap rows in `<ul data-testid="station-list">`; each is
`<li data-testid="station-<id>">` with `station-<id>-name`, `station-<id>-genre`, a
`play-<id>` button (calls `play`), a `fav-<id>` button (calls `toggleFavorite`), and an
`open-<id>` button (calls `openStation`). When `visibleStations` is empty render
`<p data-testid="stations-empty">` and **no** `station-list`.

### `app/station-detail/page.tsx` — `data-testid="page-station-detail"`
If no station selected, render `<p data-testid="no-station">`. Otherwise show
`<p data-testid="detail-name">`, `<p data-testid="detail-genre">`,
`<p data-testid="detail-bitrate">`, and `<p data-testid="detail-plays">` (the playCount).
Buttons: `play-station` (calls `play(station.id)`), `toggle-fav` (calls `toggleFavorite`),
and `stop-station` (calls `stop`).

### `app/favorites/page.tsx` — `data-testid="page-favorites"`
A `<ul data-testid="favorites-list">` of `favorites`; each is
`<li data-testid="favorite-<id>">` with `favorite-<id>-name` and an `unfav-<id>` button
(calls `toggleFavorite`). When there are none render `<p data-testid="favorites-empty">` and
no list.

### `app/history/page.tsx` — `data-testid="page-history"`
A `<p data-testid="total-plays">` with `totalPlays`. A `clear-history` button (calls
`clearHistory`). When `history` is empty render `<p data-testid="history-empty">` and no
list. Otherwise an `<ol data-testid="history-list">` of `historyStations`; each is
`<li data-testid="hist-<id>">` with `hist-<id>-name`.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/stations/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ stations: Station[] }`. Optional `?genre=<genre>`, `?favorite=true`, and
  `?minBitrate=<n>` (stations with `bitrate >= n`) filters (AND).
- **POST** — body `{ name, genre?, bitrate? }`. 201 with the created station
  (`favorite: false`, `playCount: 0`). If `name` is missing/blank → 400
  `{ error: "name required" }`. New ids continue `r5`, `r6`, …. `genre` defaults to `""`,
  `bitrate` to `0`.
- **PUT** — `?id=<id>`. Body `{ name?, genre?, bitrate?, favorite? }` patch; additionally
  `{ play: true }` increments `playCount`. Returns the updated station. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
