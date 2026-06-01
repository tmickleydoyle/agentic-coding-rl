> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Podcast app

Build a small multi-route podcast library. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Episode = { id: string; title: string; durationMin: number; played: boolean }`
- `Show = { id: string; title: string; category: string; subscribed: boolean; episodes: Episode[] }`
- `Route = 'shows' | 'show-detail' | 'queue' | 'subscriptions'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `shows: Show[]`, `theme: Theme`, `route: Route`
- `selectedShowId: string | null` — the show on the detail page
- `queue: string[]` — ordered episode ids in the up-next queue
- `categoryFilter: string | null` — active category filter on the shows list
- `toggleSubscribe(showId)` — flips a show's `subscribed`
- `markPlayed(showId, episodeId)` — sets that episode's `played` to `true`
- `markUnplayed(showId, episodeId)` — sets it to `false`
- `enqueue(episodeId)` — appends to `queue` if not already present
- `dequeue(episodeId)` — removes from `queue`
- `openShow(id)` — sets `selectedShowId` + navigates to `show-detail`
- `setCategoryFilter`, `setTheme`, `navigate(route)`

Seed data — 3 shows:

| show | id | category | subscribed | episodes (id/title/durationMin/played) |
|---|---|---|---|---|
| Tech Talk  | `sh1` | tech    | true  | `e1` "Intro" 30 played, `e2` "Deep Dive" 45 not |
| Daily News | `sh2` | news    | false | `e3` "Monday" 15 not |
| Code Cast  | `sh3` | tech    | false | `e4` "Rust" 50 not, `e5` "Go" 40 played |

Queue starts empty.

## Derived helpers — `hooks/useShows.ts`
Pure helpers (convenient, not required by name) plus a `useShows()` hook returning:
- `visibleShows` — `shows` filtered by `categoryFilter` (when set; blank/null = all).
- `categories` — sorted unique categories across ALL shows.
- `subscriptions` — shows with `subscribed === true`.
- `selectedShow` — the show whose id is `selectedShowId`, or `null`.
- `queueEpisodes` — flat `Episode[]` for ids in `queue` (in order; skips missing). Look up
  episodes across all shows.
- `totalQueueMinutes` — sum of `durationMin` across `queueEpisodes`.
- `unplayedCount` — total episodes across ALL shows with `played === false`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`shows`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-shows" | "nav-show-detail" | "nav-queue" | "nav-subscriptions"` (labels
Shows / Detail / Queue / Subscriptions). The current route's button has
`aria-current="page"`; others must **not**.

## Pages
### `app/shows/page.tsx` — `data-testid="page-shows"`
A `category-filter` `<select>` (option `all` = "All categories" plus one per category in
`categories`), then the list. Wrap rows in `<ul data-testid="show-list">`; each is
`<li data-testid="show-<id>">` with `show-<id>-title`, `show-<id>-category`, a
`subscribe-<id>` button (calls `toggleSubscribe`, label "Subscribe"/"Unsubscribe" by current
state), and an `open-<id>` button (calls `openShow`). When `visibleShows` is empty render
`<p data-testid="shows-empty">` and **no** `show-list`.

### `app/show-detail/page.tsx` — `data-testid="page-show-detail"`
If no show selected, render `<p data-testid="no-show">`. Otherwise show
`<p data-testid="detail-title">` (title) and `<p data-testid="detail-played-count">` (number
of played episodes in this show). A `<ul data-testid="episode-list">` of the show's episodes;
each is `<li data-testid="ep-<id>">` with `ep-<id>-title`, a `played-<id>` indicator
(`<span>` text "played" or "unplayed"), a `toggle-played-<id>` button (calls `markPlayed` if
currently unplayed else `markUnplayed`), and an `enqueue-<id>` button (calls `enqueue`).

### `app/queue/page.tsx` — `data-testid="page-queue"`
A `<p data-testid="queue-minutes">` with `totalQueueMinutes`. When the queue is empty render
`<p data-testid="queue-empty">` and no list. Otherwise an `<ol data-testid="queue-list">` of
`queueEpisodes`; each is `<li data-testid="q-ep-<id>">` with `q-ep-<id>-title` and a
`remove-q-<id>` button (calls `dequeue`).

### `app/subscriptions/page.tsx` — `data-testid="page-subscriptions"`
A `<p data-testid="unplayed-count">` with `unplayedCount`. A `<ul data-testid="subs-list">`
of `subscriptions`; each is `<li data-testid="sub-<id>">` with `sub-<id>-title` and an
`unsub-<id>` button (calls `toggleSubscribe`). When there are none render
`<p data-testid="subs-empty">` and no list.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/shows/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ shows: Show[] }`. Optional `?category=<cat>` and `?subscribed=true` filters
  (AND).
- **POST** — body `{ title, category? }`. 201 with the created show (`subscribed: false`,
  `episodes: []`). If `title` is missing/blank → 400 `{ error: "title required" }`. New ids
  continue `sh4`, `sh5`, …. `category` defaults to `""`.
- **PUT** — `?id=<id>`. Body `{ title?, category?, subscribed? }` patch; additionally
  `{ subscribe: true }` sets `subscribed` to `true` and `{ subscribe: false }` sets it to
  `false`. Returns the updated show. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
