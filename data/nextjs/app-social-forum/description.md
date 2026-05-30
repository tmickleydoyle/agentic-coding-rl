# Social Forum app

Build a small multi-route forum app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Category = { id: string; name: string }`
- `Reply = { id: string; threadId: string; text: string; votes: number }`
- `Thread = { id: string; title: string; categoryId: string; votes: number; createdAt: number }`
- `Sort = 'votes' | 'recent'`
- `CategoryFilter = 'all' | string`
- `Route = 'threads' | 'thread' | 'new' | 'categories'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `categories: Category[]`, `threads: Thread[]`, `replies: Reply[]`, `theme: Theme`,
  `route: Route`
- `sort: Sort`, `categoryFilter: CategoryFilter`, `selectedThreadId: string | null`
- `addThread({ title, categoryId })` — appends a `Thread` (fresh id `t4`, `t5`, …,
  `votes: 0`, `createdAt` = an increasing counter so newer threads sort first by `recent`);
  blank title is ignored (no thread added). Returns nothing.
- `upvoteThread(id)` — +1 votes
- `addReply(threadId, text)` — appends a `Reply` (fresh id `r4`, `r5`, …, `votes: 0`);
  blank text ignored
- `upvoteReply(id)` — +1 votes
- `setSort(sort)`, `setCategoryFilter(filter)`, `setTheme(theme)`
- `openThread(threadId)` — sets `selectedThreadId` and navigates to `thread`
- `navigate(route)`

Seed categories:

| name | id |
|---|---|
| General | `g1` |
| Help    | `g2` |
| Showoff | `g3` |

Seed threads (`createdAt` increases with id):

| title | id | category | votes | createdAt |
|---|---|---|---|---|
| Welcome thread     | `t1` | `g1` | 5 | 1 |
| How do I deploy?   | `t2` | `g2` | 2 | 2 |
| Look what I built  | `t3` | `g3` | 8 | 3 |

The first added thread gets id `t4` and `createdAt: 4`.

Seed replies:

| text | id | thread | votes |
|---|---|---|---|
| Hi there!  | `r1` | `t1` | 1 |
| Try the CLI| `r2` | `t2` | 3 |
| Me too     | `r3` | `t1` | 0 |

The first added reply gets id `r4`.

## Optional helper — `hooks/useThreads.ts`
Derived selectors: `visibleThreads` (threads after the current category filter, then sorted
— `votes` descending by votes, `recent` descending by `createdAt`) and `stats`
(`{ totalThreads, totalReplies, totalVotes }` where `totalVotes` sums thread votes only).
Pure helpers `sortThreads` and `filterThreads` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`threads`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-threads" | "nav-thread" | "nav-new" | "nav-categories"` (labels
Threads / Thread / New / Categories). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/threads/page.tsx` — `data-testid="page-threads"`
A `sort-select` (`votes` / `recent`) bound to `sort` and a `category-filter` (`<select>`
with `all` plus one option per category) bound to `categoryFilter`. Then the list of
`visibleThreads` via `ThreadRow` as `<li data-testid="thread-<id>">` containing the title
(`thread-<id>-title`), vote count (`thread-<id>-votes`), an `upvote-<id>` button, and an
`open-<id>` button (calls `openThread`). When no thread matches, render
`<p data-testid="empty-threads">` and **no** `thread-list`. Otherwise wrap rows in
`<ul data-testid="thread-list">`.

### `app/thread/page.tsx` — `data-testid="page-thread"`
Detail for `selectedThreadId`. If none selected, render
`<p data-testid="no-thread-selected">`. Otherwise show the title (`detail-title`), the
thread vote count (`detail-votes`) and a `detail-upvote` button, the reply list as
`<ul data-testid="reply-list">` of `<li data-testid="reply-<id>">` (text in
`reply-<id>-text`, votes in `reply-<id>-votes`, an `upvote-reply-<id>` button), and a reply
form `<form data-testid="reply-form">` with `reply-input` and `reply-submit`. Submitting a
non-blank reply adds it and clears the input; blank adds nothing.

### `app/new/page.tsx` — `data-testid="page-new"`
`<form data-testid="new-thread-form">` with `title-input`, a `category-select` (one option
per category), and `submit-thread`. On submit: if the title is empty/whitespace, render
`<p data-testid="form-error">` and stay. Otherwise add the thread and `navigate('threads')`.

### `app/categories/page.tsx` — `data-testid="page-categories"`
List every category as `<li data-testid="category-<id>">` with name (`category-<id>-name`)
and a `category-<id>-count` showing how many threads belong to it. Also a
`<div data-testid="forum-stats">` showing `stat-threads`, `stat-replies`, and `stat-votes`
from `stats`.

## Presentational components
- `components/ThreadRow.tsx` — one threads-page row (see Threads page).
- `components/ReplyItem.tsx` — one reply `<li>` (see Thread page).
- `components/SortBar.tsx` — the `sort-select` + `category-filter` controls.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/threads/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ threads: Thread[] }`. Optional `?categoryId=<id>` filter and optional
  `?sort=votes|recent` (votes descending, recent = createdAt descending). With no sort,
  return in seed/insertion order.
- **POST** — body `{ title, categoryId? }`. 201 with the created thread (`votes: 0`,
  new ids `t4`, `t5`, …, increasing `createdAt`). If `title` is missing/blank → 400
  `{ error: "title required" }`. `categoryId` defaults to `g1`.
- **PUT** — `?id=<id>`. Upvotes the thread (+1) and returns it. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404
  `{ error: "not found" }`.
