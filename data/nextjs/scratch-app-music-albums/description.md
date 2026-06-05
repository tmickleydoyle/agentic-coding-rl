> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Albums app

Build a small multi-route album library. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Track = { id: string; title: string; lengthSec: number }`
- `Album = { id: string; title: string; artist: string; year: number; favorite: boolean; rating: number; tracks: Track[] }`
  (`rating` is 0–5; 0 means unrated.)
- `Route = 'albums' | 'album-detail' | 'artists' | 'favorites'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `albums: Album[]`, `theme: Theme`, `route: Route`
- `selectedAlbumId: string | null` — the album on the detail page
- `artistFilter: string | null` — active artist filter on the albums list
- `toggleFavorite(albumId)` — flips `favorite`
- `rateAlbum(albumId, rating)` — sets `rating` (clamped to 0–5)
- `openAlbum(id)` — sets `selectedAlbumId` + navigates to `album-detail`
- `openArtist(artist)` — sets `artistFilter` to that artist + navigates to `albums`
- `setArtistFilter`, `setTheme`, `navigate(route)`

Seed data — 4 albums:

| album | id | artist | year | favorite | rating | tracks (id/title/lengthSec) |
|---|---|---|---|---|---|---|
| Dawn      | `a1` | Aria | 2019 | true  | 5 | `t1` "Wake" 200, `t2` "Glow" 180 |
| Dusk      | `a2` | Aria | 2021 | false | 0 | `t3` "Fade" 220 |
| Currents  | `a3` | Echo | 2018 | false | 4 | `t4` "Tide" 240, `t5` "Drift" 210 |
| Signals   | `a4` | Echo | 2022 | true  | 0 | `t6` "Ping" 160 |

## Derived helpers — `hooks/useAlbums.ts`
Pure helpers (convenient, not required by name) plus a `useAlbums()` hook returning:
- `visibleAlbums` — `albums` filtered by `artistFilter` (when set; blank/null = all).
- `artists` — sorted unique artists across ALL albums.
- `favorites` — albums with `favorite === true`.
- `selectedAlbum` — the album whose id is `selectedAlbumId`, or `null`.
- `albumCountByArtist` — record mapping each artist to how many albums they have.
- `averageRating` — mean `rating` across albums that have `rating > 0` (rated albums only),
  rounded to one decimal; `0` if none are rated.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`albums`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-albums" | "nav-album-detail" | "nav-artists" | "nav-favorites"` (labels
Albums / Detail / Artists / Favorites). The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/albums/page.tsx` — `data-testid="page-albums"`
An `artist-filter` `<select>` (option `all` = "All artists" plus one per artist in `artists`),
then the list. Wrap rows in `<ul data-testid="album-list">`; each is
`<li data-testid="album-<id>">` with `album-<id>-title`, `album-<id>-artist`,
`album-<id>-rating` (the numeric rating), a `fav-<id>` button (calls `toggleFavorite`), and
an `open-<id>` button (calls `openAlbum`). When `visibleAlbums` is empty render
`<p data-testid="albums-empty">` and **no** `album-list`.

### `app/album-detail/page.tsx` — `data-testid="page-album-detail"`
If no album selected, render `<p data-testid="no-album">`. Otherwise show
`<p data-testid="detail-title">`, `<p data-testid="detail-artist">`,
`<p data-testid="detail-year">`, `<p data-testid="detail-rating">` (numeric rating), and
`<p data-testid="detail-total-length">` (sum of track `lengthSec`). Five rating buttons
`rate-1`…`rate-5` (each calls `rateAlbum(album.id, n)`) and a `toggle-fav` button (calls
`toggleFavorite`). A `<ul data-testid="track-list">` of the album's tracks; each is
`<li data-testid="track-<id>">` with `track-<id>-title` and `track-<id>-length`.

### `app/artists/page.tsx` — `data-testid="page-artists"`
A `<ul data-testid="artist-list">` of `artists`; each is `<li data-testid="artist-<name>">`
with `artist-<name>-count` (the album count from `albumCountByArtist`) and a
`view-<name>` button (calls `openArtist(name)`).

### `app/favorites/page.tsx` — `data-testid="page-favorites"`
A `<p data-testid="avg-rating">` with `averageRating`. A `<ul data-testid="favorites-list">`
of `favorites`; each is `<li data-testid="favorite-<id>">` with `favorite-<id>-title` and an
`unfav-<id>` button (calls `toggleFavorite`). When there are none render
`<p data-testid="favorites-empty">` and no list.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/albums/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ albums: Album[] }`. Optional `?artist=<artist>`, `?favorite=true`, and
  `?minRating=<n>` (albums with `rating >= n`) filters (AND).
- **POST** — body `{ title, artist, year? }`. 201 with the created album (`favorite: false`,
  `rating: 0`, `tracks: []`). If `title` or `artist` is missing/blank → 400
  `{ error: "title and artist required" }`. New ids continue `a5`, `a6`, …. `year`
  defaults to `0`.
- **PUT** — `?id=<id>`. Body `{ title?, artist?, year?, favorite?, rating? }` patch
  (`rating` clamped 0–5). Returns the updated album. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
