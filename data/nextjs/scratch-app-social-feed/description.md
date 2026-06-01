> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Social Feed app

Build a small multi-route social feed app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `User = { id: string; name: string; handle: string }`
- `Comment = { id: string; postId: string; authorId: string; text: string }`
- `Post = { id: string; authorId: string; text: string; likes: number; likedByMe: boolean }`
- `FeedFilter = 'all' | 'following'`
- `Route = 'feed' | 'post' | 'profile' | 'explore'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `users: User[]`, `posts: Post[]`, `comments: Comment[]`, `theme: Theme`, `route: Route`
- `feedFilter: FeedFilter`, `currentUserId: string` (always `'u1'`)
- `selectedPostId: string | null`, `selectedUserId: string | null`
- `following: string[]` — ids of users `u1` follows
- `toggleLike(postId)` — flips `likedByMe`, adjusts `likes` by ±1
- `addComment(postId, text)` — appends a `Comment` (fresh id `c4`, `c5`, …) authored by
  `currentUserId`; blank/whitespace text is ignored (no comment added)
- `toggleFollow(userId)` — adds/removes `userId` from `following` (never self)
- `setFeedFilter(filter)`, `setTheme(theme)`
- `openPost(postId)` — sets `selectedPostId` and navigates to `post`
- `openProfile(userId)` — sets `selectedUserId` and navigates to `profile`
- `navigate(route)`

Seed users (`u1` is the current user):

| name | id | handle |
|---|---|---|
| You    | `u1` | `@you` |
| Ada    | `u2` | `@ada` |
| Linus  | `u3` | `@linus` |

`following` starts as `['u2']` (you follow Ada).

Seed posts:

| post | id | author | likes | likedByMe |
|---|---|---|---|---|
| Hello world          | `p1` | `u2` (Ada)   | 3 | false |
| Shipped a feature    | `p2` | `u3` (Linus) | 1 | true  |
| Coffee then code     | `p3` | `u1` (You)   | 0 | false |

Seed comments:

| comment | id | post | author | text |
|---|---|---|---|---|
| Nice!     | `c1` | `p1` | `u3` | Nice! |
| Welcome   | `c2` | `p1` | `u1` | Welcome |
| Congrats  | `c3` | `p2` | `u2` | Congrats |

The first added comment gets id `c4`.

## Optional helper — `hooks/useFeed.ts`
Derived selectors over the shared state: `visiblePosts` (posts after the current feed
filter — `all` shows every post; `following` shows posts authored by `u1` or by a followed
user) and `stats` (`{ totalPosts, totalLikes, followingCount }`). Pure helpers
`filterFeed` and `computeStats` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`feed`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-feed" | "nav-post" | "nav-profile" | "nav-explore"` (labels
Feed / Post / Profile / Explore). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/feed/page.tsx` — `data-testid="page-feed"`
A filter control `feed-filter` (`<select>` with `all` / `following`) bound to `feedFilter`.
Then the list of `visiblePosts` via `PostCard` as
`<li data-testid="post-<id>">` containing the author handle (`post-<id>-author`), text
(`post-<id>-text`), a like count (`post-<id>-likes`), a `like-<id>` button, an
`open-<id>` button (calls `openPost`), and an `author-<id>` button (calls
`openProfile(authorId)`). When no post matches the filter, render
`<p data-testid="empty-feed">` and **no** `feed-list`. Otherwise wrap rows in
`<ul data-testid="feed-list">`.

### `app/post/page.tsx` — `data-testid="page-post"`
Detail for `selectedPostId`. If none is selected, render
`<p data-testid="no-post-selected">`. Otherwise show the post text
(`detail-text`), author handle (`detail-author`), like count (`detail-likes`), a
`detail-like` button, the comment list as `<ul data-testid="comment-list">` with each
comment `<li data-testid="comment-<id>">` (text in `comment-<id>-text`), and a
comment form `<form data-testid="comment-form">` with `comment-input` and `comment-submit`.
Submitting a non-blank comment adds it and clears the input; a blank comment adds nothing.

### `app/profile/page.tsx` — `data-testid="page-profile"`
Profile for `selectedUserId`, defaulting to `currentUserId` when none selected. Show the
name (`profile-name`), handle (`profile-handle`), a `profile-post-count` (number of posts
by that user), and — when the profile is NOT the current user — a `follow-toggle` button
whose text is `Following` when followed and `Follow` otherwise; clicking it toggles follow.
For the current user, render no `follow-toggle`. Then list that user's posts as
`<ul data-testid="profile-posts">` of `<li data-testid="profile-post-<id>">`.

### `app/explore/page.tsx` — `data-testid="page-explore"`
A people directory: every user except the current user as
`<li data-testid="user-<id>">` with name (`user-<id>-name`), a `follow-<id>` button
(text `Following`/`Follow`, toggles follow), and a `visit-<id>` button (calls
`openProfile`). Also a `<div data-testid="explore-stats">` showing `stat-posts`,
`stat-likes`, and `stat-following` values from `stats`.

## Presentational components
- `components/PostCard.tsx` — one feed post row (see Feed page).
- `components/CommentItem.tsx` — one comment `<li>` (see Post page).
- `components/UserRow.tsx` — one explore directory row (see Explore page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/posts/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ posts: Post[] }`. Optional `?authorId=<id>` filter.
- **POST** — body `{ authorId, text }`. 201 with the created post (`likes: 0`,
  `likedByMe: false`, new ids `p4`, `p5`, …). If `text` is missing/blank → 400
  `{ error: "text required" }`. If `authorId` is missing/blank → 400
  `{ error: "authorId required" }`.
- **PUT** — `?id=<id>`. With body `{ liked: boolean }` set `likedByMe` to that value
  (adjusting `likes` only when it actually changes); with no `liked` key, toggle.
  Returns the updated post. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
