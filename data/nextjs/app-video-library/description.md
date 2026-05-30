# Video Library app

Build a small multi-route video-library app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Video = { id: string; title: string; category: string; duration: number }`
- `Route = 'browse' | 'video-detail' | 'watchlist' | 'history'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `videos: Video[]`, `theme: Theme`, `route: Route`
- `watchedIds: string[]` — videos that have been marked watched (history, newest first)
- `watchlistIds: string[]` — videos saved to the watchlist
- `selectedVideoId: string | null` — video shown on the detail page
- `isWatched(videoId)` → boolean
- `inWatchlist(videoId)` → boolean
- `openVideo(videoId)` — set `selectedVideoId`, navigate to `video-detail`
- `markWatched(videoId)` — record the video as watched (move/prepend to front of
  `watchedIds`, no duplicates)
- `toggleWatchlist(videoId)` — add/remove the videoId from `watchlistIds`
- `setTheme`, `navigate(route)`

Seed data (5 videos, nothing watched / no watchlist to start):
- `v1` "Intro to Hooks" category `React` duration `600`
- `v2` "Advanced Generics" category `TypeScript` duration `900`
- `v3` "Flexbox Deep Dive" category `CSS` duration `720`
- `v4` "Suspense Patterns" category `React` duration `840`
- `v5` "Grid Mastery" category `CSS` duration `540`

## Optional helper — `hooks/useLibrary.ts`
Pure helpers: `findVideo(videos, id)` returns the video or `undefined`.
`videosByCategory(videos)` → array of `{ category, videos }` groups, categories in
first-seen order. A `useHistory()` hook returns the watched videos (in `watchedIds`
order) as `Video[]`, and `useWatchlist()` returns the watchlist videos as `Video[]`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `browse`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`nav-browse | nav-video-detail | nav-watchlist | nav-history` (labels Browse / Video /
Watchlist / History). Clicking calls `navigate`. Current route's button has
`aria-current="page"`; others must not.

## Pages
### `app/browse/page.tsx` — `data-testid="page-browse"`
Lists all videos grouped by category. Each category group is
`<section data-testid="category-<category>">` with a `category-<category>-label`. Inside,
each video is `<li data-testid="video-<id>">` with `video-<id>-title`,
`video-<id>-duration` (the number), an `open-<id>` button calling `openVideo(id)`, a
`watched-badge-<id>` element rendered **only** when watched, and a
`watchlist-badge-<id>` element rendered **only** when in the watchlist.

### `app/video-detail/page.tsx` — `data-testid="page-video-detail"`
If no `selectedVideoId`, render `<p data-testid="no-video">`. Otherwise show
`<h1 data-testid="detail-title">`, a `detail-category`, and a `detail-duration`. A
`watch-btn` button calls `markWatched`; once watched, render
`<span data-testid="watched-flag">` and the button text becomes "Watched" (else "Mark
watched"). A `watchlist-toggle` button: text "Add to watchlist" when not in the list and
"Remove from watchlist" when in it; clicking calls `toggleWatchlist`.

### `app/watchlist/page.tsx` — `data-testid="page-watchlist"`
If the watchlist is empty, render `<p data-testid="empty-watchlist">`. Otherwise list each
saved video as `<li data-testid="wl-<id>">` with the title in `wl-<id>-title` and a
`wl-remove-<id>` button that removes it via `toggleWatchlist`.

### `app/history/page.tsx` — `data-testid="page-history"`
If nothing watched, render `<p data-testid="empty-history">`. Otherwise an aggregate
`watched-count-value` (number of watched videos) and a `total-watch-time-value` (sum of
durations of watched videos), then list each watched video as
`<li data-testid="hist-<id>">` (in `watchedIds` order) with the title in
`hist-<id>-title`.

## Presentational components
- `components/VideoCard.tsx` — the `video-<id>` browse row.
- `components/CategoryGroup.tsx` — one `category-<category>` section on browse.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/videos/route.ts`
- **GET** — `{ videos: Video[] }`. With `?id=<id>` → `{ video }` or 404
  `{ error: "not found" }`. With `?category=<cat>` → `{ videos }` filtered by category.
- **POST** — body `{ id }` marks a video watched in the server store; 200 with
  `{ watchedIds }`. Unknown id → 404 `{ error: "not found" }`. Missing id → 400
  `{ error: "id required" }`. Already watched → returns 200 without duplicating.
- **DELETE** — `?id=<id>` clears a video from the server watched list; 200
  `{ ok: true }`. Not watched → 404 `{ error: "not found" }`.
