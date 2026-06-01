> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Blog Comments moderation app

Build a small multi-route comment-moderation app for a blog. Routing is **in-app** (React
state — no `next` imports). Four routes, a shared Context, and an API route handler backed
by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `CommentStatus = 'pending' | 'approved' | 'spam'`
- `Post = { id: string; title: string }`
- `Comment = { id: string; postId: string; author: string; body: string; status: CommentStatus }`
- `StatusFilter = 'all' | CommentStatus`
- `Route = 'posts' | 'post-detail' | 'moderation' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider plus a `useApp()` hook that throws outside the provider. It exposes:

- `posts: Post[]`, `comments: Comment[]`, `theme: Theme`, `route: Route`
- `statusFilter: StatusFilter`, `selectedPostId: string | null`
- `setStatus(id, status)` — sets a comment's moderation status
- `removeComment(id)` — drops the comment
- `setStatusFilter`, `setTheme`, `navigate(route)`
- `openPost(postId)` — sets `selectedPostId` and navigates to `post-detail`

Seed data (2 posts, 4 comments):

| post | id |
|---|---|
| Getting Started | `p1` |
| Advanced Tips | `p2` |

| comment | id | post | status |
|---|---|---|---|
| Great post! (Ada) | `k1` | `p1` | approved |
| buy now (Spammer) | `k2` | `p1` | pending |
| Thanks (Lin) | `k3` | `p2` | pending |
| cheap pills (Bot) | `k4` | `p2` | spam |

## Routing — `app/page.tsx` (entry point)
Default-exports `App`, which renders `AppStateProvider` wrapping an inner `Shell`. `Shell`
sets `data-theme` on `app-root`, renders `NavBar` and the active page. `NavBar` has buttons
for `posts`, `moderation`, `settings` (`nav-<route>`), the active one with
`aria-current="page"`. The `post-detail` route is reached via `openPost`, not the navbar.

## Pages
- **posts** (`page-posts`): a `post-list` where each `post-<id>` shows the title, a
  per-post comment count (`post-<id>-count`), and an `open-<id>` button that calls `openPost`.
- **post-detail** (`page-post-detail`): `detail-title`, and a `detail-comment-list` of the
  selected post's comments (or `detail-empty`). Each comment can be moderated.
- **moderation** (`page-moderation`): a `status-filter` select and a `comment-list` of all
  comments (filtered), or `empty-state`. Each `comment-<id>` has `data-status`, author/body/
  status spans, and `approve-<id>`, `spam-<id>`, `pending-<id>`, `remove-<id>` buttons.
- **settings** (`page-settings`): `StatCard`s for total/pending/approved/spam, a
  `current-theme`, and a `theme-toggle`.

## Derived state — `hooks/useComments.ts`
`countComments`, `filterComments`, and a `useComments()` hook returning `{ counts, filtered }`.

## API — `app/api/comments/route.ts`
In-memory store in `lib/store.ts` (separate from client state) with seed data and
`__reset()`. The route file re-exports `__reset`.

- `GET /api/comments?status=&postId=` → `{ comments }` filtered.
- `POST /api/comments` `{ postId, author, body? }` → 201 with the comment (status
  `pending`); 400 `{ error: 'postId required' }` / `{ error: 'author required' }` if blank.
- `PUT /api/comments?id=` `{ status }` → updated comment; 400 `{ error: 'status required' }`
  / `{ error: 'invalid status' }`; 404 if id missing.
- `DELETE /api/comments?id=` → `{ ok: true }`; 404 if missing.

All JSON responses set `content-type: application/json`.
