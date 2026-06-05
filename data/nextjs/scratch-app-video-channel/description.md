> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Video Channel app

Build a small multi-route video-channel app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Video = { id: string; channelId: string; title: string; views: number; uploaded: number }`
  (`uploaded` is an ordering index; higher = newer)
- `Channel = { id: string; name: string }`
- `SortKey = 'views' | 'recent'`
- `Route = 'channel' | 'video-detail' | 'uploads' | 'subscriptions'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `channels: Channel[]`, `videos: Video[]`, `theme: Theme`, `route: Route`
- `subscribedIds: string[]` — subscribed channel ids
- `viewCounts: Record<string, number>` — extra views added this session per videoId
- `selectedChannelId: string | null`, `selectedVideoId: string | null`
- `sort: SortKey` — current sort on the uploads page
- `isSubscribed(channelId)` → boolean
- `viewsFor(videoId)` → base video views + session view bumps for that video
- `openChannel(channelId)` — set `selectedChannelId`, navigate to `channel`
- `openVideo(videoId)` — set `selectedVideoId`, navigate to `video-detail`
- `toggleSubscribe(channelId)` — add/remove the channelId from `subscribedIds`
- `recordView(videoId)` — increment the session view bump for that video by 1
- `setSort(sort)`, `setTheme`, `navigate(route)`

Seed data:
- channels: `ch1` "CodeCast", `ch2` "DesignDaily"
- videos:
  - `v1` ch1 "Hooks Explained" views `120` uploaded `3`
  - `v2` ch1 "Context Deep Dive" views `90` uploaded `1`
  - `v3` ch2 "Color Theory" views `200` uploaded `2`
  - `v4` ch2 "Spacing Systems" views `50` uploaded `4`
- `selectedChannelId` starts at `ch1`; nothing subscribed; sort starts `recent`.

## Optional helper — `hooks/useChannel.ts`
Pure helpers: `findChannel(channels, id)` and `findVideo(videos, id)` return the item or
`undefined`. `channelVideos(videos, channelId)` returns that channel's videos.
`sortVideos(videos, sort, viewsFor)` returns a **new** sorted array: by `viewsFor(id)`
descending for `'views'`, by `uploaded` descending for `'recent'`. A `useSubscriptions()`
hook returns the subscribed channels as `Channel[]`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `channel`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`nav-channel | nav-video-detail | nav-uploads | nav-subscriptions` (labels Channel / Video
/ Uploads / Subscriptions). Clicking calls `navigate`. Current route's button has
`aria-current="page"`; others must not.

## Pages
### `app/channel/page.tsx` — `data-testid="page-channel"`
If no `selectedChannelId`, render `<p data-testid="no-channel">`. Otherwise show
`<h1 data-testid="channel-name">`, a `subscribe-toggle` button (text "Subscribe" / "Unsubscribe",
clicking calls `toggleSubscribe`), a `subscriber-flag` rendered **only** when subscribed,
and a channel switcher: for each channel a `switch-<id>` button calling `openChannel`. List
the channel's videos as `<li data-testid="cv-<id>">` with `cv-<id>-title`, `cv-<id>-views`
(from `viewsFor`), and an `open-<id>` button calling `openVideo`.

### `app/video-detail/page.tsx` — `data-testid="page-video-detail"`
If no `selectedVideoId`, render `<p data-testid="no-video">`. Otherwise show
`<h1 data-testid="detail-title">`, a `detail-channel` (the channel name), a `detail-views`
(from `viewsFor`), and a `watch-btn` button that calls `recordView` (each click adds a
view).

### `app/uploads/page.tsx` — `data-testid="page-uploads"`
All videos across channels, sorted. Two buttons `sort-views` and `sort-recent` calling
`setSort`; the active one has `aria-pressed="true"`. List videos in sorted order as
`<li data-testid="up-<id>">` with `up-<id>-title` and `up-<id>-views`. Also render a
`current-sort` element showing the sort key.

### `app/subscriptions/page.tsx` — `data-testid="page-subscriptions"`
If nothing subscribed, render `<p data-testid="no-subscriptions">`. Otherwise a
`subscribed-count-value` (number subscribed) and list each subscribed channel as
`<li data-testid="sub-<id>">` with `sub-<id>-name` and an `unsub-<id>` button that calls
`toggleSubscribe`.

## Presentational components
- `components/VideoRow.tsx` — a `cv-<id>` row on the channel page.
- `components/SortBar.tsx` — the sort buttons on the uploads page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/videos/route.ts`
- **GET** — `{ videos: Video[] }`. With `?id=<id>` → `{ video }` or 404
  `{ error: "not found" }`. With `?channelId=<id>` → `{ videos }` for that channel. With
  `?sort=views` → videos sorted by views descending; `?sort=recent` → by uploaded
  descending.
- **POST** — body `{ id }` records a view (increments that video's `views` by 1); 200 with
  `{ video }`. Unknown id → 404 `{ error: "not found" }`. Missing id → 400
  `{ error: "id required" }`.
