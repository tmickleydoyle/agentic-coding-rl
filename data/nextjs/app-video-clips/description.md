# Video Clips app

Build a small multi-route short-clips app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
one API resource backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Clip = { id: string; title: string; category: string; likes: number }`
- `Route = 'feed' | 'clip-detail' | 'saved' | 'categories'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws outside the provider. Exposes:

- `clips: Clip[]`, `theme: Theme`, `route: Route`
- `likedIds: string[]` — clips the user liked
- `savedIds: string[]` — clips saved (newest first)
- `activeCategory: string | null` — category filter on the feed (`null` = all)
- `selectedClipId: string | null`
- `isLiked(clipId)` → boolean
- `isSaved(clipId)` → boolean
- `likesFor(clipId)` → base clip likes + 1 if the user liked it
- `openClip(clipId)` — set `selectedClipId`, navigate to `clip-detail`
- `toggleLike(clipId)` — add/remove the clipId from `likedIds`
- `toggleSave(clipId)` — add/remove the clipId from `savedIds` (prepend when adding)
- `setCategory(category | null)` — set the feed filter
- `setTheme`, `navigate(route)`

Seed data (5 clips):
- `c1` "Quick Tip" category `Tips` likes `10`
- `c2` "Funny Cat" category `Fun` likes `42`
- `c3` "Code Trick" category `Tips` likes `7`
- `c4` "Dance Move" category `Fun` likes `30`
- `c5` "Life Hack" category `Tips` likes `15`

## Optional helper — `hooks/useClips.ts`
Pure helpers: `findClip(clips, id)` → clip or `undefined`. `categoryCounts(clips)` → array
of `{ category, count }` groups, categories in first-seen order. `filterByCategory(clips,
category)` returns all clips when `category` is `null`, otherwise the matching clips. A
`useSaved()` hook returns the saved clips (in `savedIds` order) as `Clip[]`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `feed`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`nav-feed | nav-clip-detail | nav-saved | nav-categories` (labels Feed / Clip / Saved /
Categories). Clicking calls `navigate`. Current route's button has `aria-current="page"`;
others must not.

## Pages
### `app/feed/page.tsx` — `data-testid="page-feed"`
Render an `active-category` element showing the active category (or "All" when null), and an
`all-filter` button calling `setCategory(null)`. List the (filtered) clips as
`<li data-testid="clip-<id>">` with `clip-<id>-title`, `clip-<id>-likes` (from `likesFor`),
a `save-badge-<id>` rendered **only** when saved, and an `open-<id>` button calling
`openClip`. If no clips match, render `<p data-testid="no-clips">`.

### `app/clip-detail/page.tsx` — `data-testid="page-clip-detail"`
If no `selectedClipId`, render `<p data-testid="no-clip">`. Otherwise show
`<h1 data-testid="detail-title">`, a `detail-category`, a `detail-likes` (from `likesFor`),
a `like-toggle` button (text "Like" / "Unlike", clicking calls `toggleLike`), a `liked-flag`
rendered **only** when liked, and a `save-toggle` button (text "Save" / "Unsave", clicking
calls `toggleSave`).

### `app/saved/page.tsx` — `data-testid="page-saved"`
If nothing saved, render `<p data-testid="no-saved">`. Otherwise a `saved-count-value`
(number saved) and list each saved clip (in `savedIds` order) as
`<li data-testid="sv-<id>">` with `sv-<id>-title` and an `sv-remove-<id>` button that calls
`toggleSave`.

### `app/categories/page.tsx` — `data-testid="page-categories"`
List each category as `<li data-testid="cat-<category>">` with a `cat-<category>-count` (how
many clips it has) and a `cat-<category>-filter` button that calls `setCategory(category)`
and navigates to the feed. Categories appear in first-seen order.

## Presentational components
- `components/ClipCard.tsx` — a `clip-<id>` row on the feed.
- `components/CategoryRow.tsx` — a `cat-<category>` row on the categories page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data plus `__reset()`. Independent of client state.

### `app/api/clips/route.ts`
- **GET** — `{ clips: Clip[] }`. With `?id=<id>` → `{ clip }` or 404
  `{ error: "not found" }`. With `?category=<cat>` → `{ clips }` filtered by category.
- **POST** — body `{ id }` likes a clip (increments that clip's `likes` by 1); 200 with
  `{ clip }`. Unknown id → 404 `{ error: "not found" }`. Missing id → 400
  `{ error: "id required" }`.
