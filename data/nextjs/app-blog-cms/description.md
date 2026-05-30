# Blog CMS app

Build a small multi-route blog CMS. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding cross-route state, and API route
handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `PostStatus = 'draft' | 'published'`
- `Post = { id: string; title: string; body: string; categoryId: string; status: PostStatus }`
- `Category = { id: string; name: string }`
- `StatusFilter = 'all' | PostStatus`
- `CategoryFilter = 'all' | string`
- `Route = 'posts' | 'editor' | 'categories' | 'published'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider holding the client app state plus a `useApp()` hook that throws if used
outside the provider. It exposes:

- `posts: Post[]`, `categories: Category[]`, `theme: Theme`, `route: Route`
- `statusFilter: StatusFilter`, `categoryFilter: CategoryFilter`
- `addPost({ title, body?, categoryId, status? })` — appends a `Post` with a fresh id like
  `b4`, `b5`, …; defaults `status` to `'draft'`
- `togglePublish(id)` — flips `draft` <-> `published`
- `removePost(id)` — drops the post
- `setStatusFilter`, `setCategoryFilter`, `setTheme`, `navigate(route)`

Seed data (3 categories, 3 posts):

| category | id |
|---|---|
| Engineering | `c1` |
| Design | `c2` |
| Company | `c3` |

| post | id | category | status |
|---|---|---|---|
| Hello World | `b1` | `c1` | published |
| Design Systems | `b2` | `c2` | draft |
| We are hiring | `b3` | `c3` | published |

## Routing — `app/page.tsx` (entry point)
Default-exports `App`, which renders `AppStateProvider` wrapping an inner `Shell`. `Shell`
reads context, sets `data-theme` on `app-root`, renders `NavBar` and the active page. The
provider wrapper itself cannot call `useApp()`; only components inside it can.

`NavBar` renders a button per route (`nav-posts`, `nav-editor`, `nav-categories`,
`nav-published`); the active one has `aria-current="page"`.

## Pages
- **posts** (`page-posts`): `Filters` (status + category selects) then a `post-list` of
  `PostItem`s, or `empty-state` when nothing matches. Each item: `post-<id>` with
  `data-status`, title/category/status spans, a `publish-<id>` toggle, a `remove-<id>` button.
- **editor** (`page-editor`): `editor-form` with `title-input`, `body-input`,
  `category-select`, `status-select`, `submit-post`. On submit validate title (`form-error`
  if blank), `addPost(...)`, then `navigate('posts')`.
- **categories** (`page-categories`): `StatCard`s for total/published/draft and a
  `category-counts` list (`category-count-<id>-value`).
- **published** (`page-published`): `current-theme` + `theme-toggle`, a `published-count`,
  and a `published-list` of only published posts.

## Derived state — `hooks/usePosts.ts`
`countPosts`, `filterPosts`, and a `usePosts()` hook returning `{ counts, filtered }`.

## API — `app/api/posts/route.ts` and `app/api/categories/route.ts`
In-memory store in `lib/store.ts` (separate from client state) with seed data and
`__reset()`. Route files re-export `__reset`.

- `GET /api/posts?status=&categoryId=` → `{ posts }` filtered.
- `POST /api/posts` `{ title, body?, categoryId?, status? }` → 201 with the post; 400
  `{ error: 'title required' }` if title blank. Defaults to `draft`.
- `PUT /api/posts?id=` patches `title/body/categoryId/status`; with no `status` given it
  **toggles** draft/published; 404 if id missing.
- `DELETE /api/posts?id=` → `{ ok: true }`; 404 if missing.
- `GET /api/categories` → `{ categories }`; `POST` `{ name }` → 201; 400 if name blank.

All JSON responses set `content-type: application/json`.
