> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Lyrics app

Build a small multi-route lyrics library. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Song = { id: string; title: string; artist: string; lines: string[] }`
- `FavoriteLine = { songId: string; lineIndex: number }`
- `Route = 'songs' | 'song-detail' | 'search' | 'favorites'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `songs: Song[]`, `theme: Theme`, `route: Route`
- `selectedSongId: string | null` — the song on the detail page
- `favoriteLines: FavoriteLine[]` — favorited lyric lines
- `artistFilter: string | null` — active artist filter on the songs list
- `searchQuery: string`
- `toggleFavoriteLine(songId, lineIndex)` — adds the `{ songId, lineIndex }` pair if absent,
  else removes it
- `isLineFavorite(songId, lineIndex)` — returns whether that pair is favorited
- `openSong(id)` — sets `selectedSongId` + navigates to `song-detail`
- `openArtist(artist)` — sets `artistFilter` to that artist + navigates to `songs`
- `setArtistFilter`, `setSearchQuery`, `setTheme`, `navigate(route)`

Seed data — 3 songs:

| song | id | artist | lines |
|---|---|---|---|
| Open Road | `g1` | Aria | `["We ride at dawn", "Chasing the sun", "Open road ahead"]` |
| Quiet Sea | `g2` | Aria | `["Waves roll slow", "Quiet sea at night"]` |
| City Lights | `g3` | Echo | `["Neon city lights", "Dancing in the rain", "Lost in the sound"]` |

`favoriteLines` starts empty.

## Derived helpers — `hooks/useLyrics.ts`
Pure helpers (convenient, not required by name) plus a `useLyrics()` hook returning:
- `visibleSongs` — `songs` filtered by `artistFilter` (when set; blank/null = all).
- `artists` — sorted unique artists across ALL songs.
- `selectedSong` — the song whose id is `selectedSongId`, or `null`.
- `searchResults` — for a non-blank `searchQuery`, the list of
  `{ song: Song; lineIndex: number; line: string }` for every lyric line that contains the
  query (case-insensitive). Blank query → empty array.
- `favoriteLineDetails` — for each entry in `favoriteLines` (in order), a
  `{ songId: string; lineIndex: number; line: string; songTitle: string }`; skip entries
  whose song or line no longer exists.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`songs`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-songs" | "nav-song-detail" | "nav-search" | "nav-favorites"` (labels
Songs / Detail / Search / Favorites). The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/songs/page.tsx` — `data-testid="page-songs"`
An `artist-filter` `<select>` (option `all` = "All artists" plus one per artist in `artists`),
then the list. Wrap rows in `<ul data-testid="song-list">`; each is
`<li data-testid="song-<id>">` with `song-<id>-title`, `song-<id>-artist`,
`song-<id>-linecount` (number of lyric lines), and an `open-<id>` button (calls `openSong`).
When `visibleSongs` is empty render `<p data-testid="songs-empty">` and **no** `song-list`.

### `app/song-detail/page.tsx` — `data-testid="page-song-detail"`
If no song selected, render `<p data-testid="no-song">`. Otherwise show
`<p data-testid="detail-title">`, `<p data-testid="detail-artist">`, and a
`view-artist` button (calls `openArtist(song.artist)`). A `<ul data-testid="line-list">` of
the song's lines; each is `<li data-testid="line-<index>">` with a `line-<index>-text` span
(the line text) and a `fav-line-<index>` button (calls `toggleFavoriteLine(song.id, index)`,
label "Unfavorite" when that line is favorited else "Favorite").

### `app/search/page.tsx` — `data-testid="page-search"`
A `search-input` bound to `searchQuery`. When `searchResults` is empty render
`<p data-testid="search-empty">` and **no** `search-results`. Otherwise a
`<ul data-testid="search-results">`; each result is
`<li data-testid="sresult-<songId>-<lineIndex>">` with a `sresult-<songId>-<lineIndex>-line`
span (the matching line) and a `sresult-<songId>-<lineIndex>-title` span (the song title).

### `app/favorites/page.tsx` — `data-testid="page-favorites"`
A `<p data-testid="fav-count">` with the number of favorite lines. A
`<ul data-testid="fav-list">` of `favoriteLineDetails`; each is
`<li data-testid="favline-<songId>-<lineIndex>">` with a `favline-<songId>-<lineIndex>-text`
span (the line), a `favline-<songId>-<lineIndex>-song` span (the song title), and a
`remove-<songId>-<lineIndex>` button (calls `toggleFavoriteLine`). When there are none
render `<p data-testid="fav-empty">` and no list.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/songs/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ songs: Song[] }`. Optional `?artist=<artist>` filter, and `?q=<text>` which
  keeps only songs that have at least one line OR a title containing the text
  (case-insensitive). Filters AND.
- **POST** — body `{ title, artist, lines? }` (`lines` an array of strings). 201 with the
  created song. If `title` or `artist` is missing/blank → 400
  `{ error: "title and artist required" }`. New ids continue `g4`, `g5`, …. `lines` defaults
  to `[]`.
- **PUT** — `?id=<id>`. Body `{ title?, artist?, lines? }` patch. Returns the updated song.
  Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
