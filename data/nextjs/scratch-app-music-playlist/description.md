> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Music Playlist app

Build a small multi-route music playlist library. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Song = { id: string; title: string; artist: string; genre: string; durationSec: number; playCount: number }`
- `Playlist = { id: string; name: string; songIds: string[] }`
- `Route = 'library' | 'playlist' | 'queue' | 'search'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `songs: Song[]`, `playlists: Playlist[]`, `theme: Theme`, `route: Route`
- `selectedPlaylistId: string | null` — the playlist shown on the playlist page
- `queue: string[]` — ordered song ids in the play queue
- `shuffle: boolean` — shuffle toggle flag
- `searchQuery: string`
- `addSongToPlaylist(playlistId, songId)` — appends `songId` to that playlist's `songIds`
  if not already present
- `removeSongFromPlaylist(playlistId, songId)` — drops it from `songIds`
- `enqueue(songId)` — appends `songId` to `queue` if not already present
- `dequeue(songId)` — removes `songId` from `queue`
- `playSong(songId)` — bumps that song's `playCount` by 1
- `toggleShuffle()` — flips `shuffle`
- `openPlaylist(id)` — sets `selectedPlaylistId` + navigates to `playlist`
- `setSearchQuery`, `setTheme`, `navigate(route)`

Seed data — 4 songs:

| song | id | artist | genre | durationSec | playCount |
|---|---|---|---|---|---|
| Sunrise     | `s1` | Aria      | pop  | 210 | 0 |
| Night Drive | `s2` | Aria      | rock | 240 | 3 |
| Deep Blue   | `s3` | Echo      | jazz | 180 | 1 |
| Pulse       | `s4` | Echo      | rock | 200 | 0 |

Seed data — 2 playlists:

| playlist | id | name | songIds |
|---|---|---|---|
| Favorites | `p1` | Favorites | `['s2']` |
| Chill     | `p2` | Chill     | `[]` |

Queue starts empty, shuffle starts `false`.

## Derived helpers — `hooks/useLibrary.ts`
Pure helpers (convenient, not required by name) plus a `useLibrary()` hook returning:
- `visibleSongs` — `songs` filtered by `searchQuery` (case-insensitive match on title OR
  artist; blank query matches everything).
- `genres` — sorted unique genres across ALL songs.
- `selectedPlaylist` — the playlist whose id is `selectedPlaylistId`, or `null`.
- `playlistSongs` — the `Song[]` for the selected playlist's `songIds` (in order; skips
  missing ids).
- `queueSongs` — the `Song[]` for ids in `queue` (in order; skips missing ids).
- `totalQueueDuration` — sum of `durationSec` across `queueSongs`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`library`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-library" | "nav-playlist" | "nav-queue" | "nav-search"` (labels
Library / Playlist / Queue / Search). The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/library/page.tsx` — `data-testid="page-library"`
List of all songs and all playlists. Wrap songs in `<ul data-testid="song-list">`; each row
is `<li data-testid="song-<id>">` with `song-<id>-title`, `song-<id>-artist`, an
`enqueue-<id>` button (calls `enqueue`), and a `play-<id>` button (calls `playSong`). Then a
`<ul data-testid="playlist-list">` where each is `<li data-testid="playlist-<id>">` with
`playlist-<id>-name` and an `open-playlist-<id>` button (calls `openPlaylist`).

### `app/playlist/page.tsx` — `data-testid="page-playlist"`
If no playlist selected, render `<p data-testid="no-playlist">`. Otherwise show
`<p data-testid="playlist-title">` (the name) and a `<select data-testid="add-song-select">`
whose options are `placeholder` ("Add a song…") plus one option per song NOT already in the
playlist (value = song id, label = title); selecting one calls `addSongToPlaylist`. Then a
`<ul data-testid="playlist-songs">` of `playlistSongs`; each is
`<li data-testid="pl-song-<id>">` with `pl-song-<id>-title` and a `remove-<id>` button
(calls `removeSongFromPlaylist`). When the playlist has no songs render
`<p data-testid="playlist-empty">` and no `playlist-songs` list.

### `app/queue/page.tsx` — `data-testid="page-queue"`
A `shuffle-toggle` button (calls `toggleShuffle`) showing "Shuffle: On"/"Shuffle: Off". A
`<p data-testid="queue-duration">` with `totalQueueDuration`. When the queue is empty render
`<p data-testid="queue-empty">` and no list. Otherwise a `<ol data-testid="queue-list">` of
`queueSongs`; each is `<li data-testid="q-song-<id>">` with `q-song-<id>-title` and a
`remove-q-<id>` button (calls `dequeue`).

### `app/search/page.tsx` — `data-testid="page-search"`
A `search-input` bound to `searchQuery`. Then the results: when `visibleSongs` is empty
render `<p data-testid="search-empty">` and **no** `search-results`; otherwise a
`<ul data-testid="search-results">` where each is `<li data-testid="result-<id>">` with
`result-<id>-title`, `result-<id>-artist`, and an `enqueue-result-<id>` button (calls
`enqueue`).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/songs/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ songs: Song[] }`. Optional `?genre=<genre>`, `?artist=<artist>`, and
  `?q=<text>` (case-insensitive match on title OR artist) filters (AND).
- **POST** — body `{ title, artist, genre?, durationSec? }`. 201 with the created song. If
  `title` or `artist` is missing/blank → 400 `{ error: "title and artist required" }`. New
  ids continue `s5`, `s6`, …. `genre` defaults to `""`, `durationSec` to `0`, `playCount`
  to `0`.
- **PUT** — `?id=<id>`. Body `{ title?, artist?, genre?, durationSec? }` patch; additionally
  `{ play: true }` increments `playCount`. Returns the updated song. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
