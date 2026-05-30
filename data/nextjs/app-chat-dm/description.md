# Direct Messages app

Build a small multi-route direct-messaging app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and an
API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Person = { id: string; name: string; handle: string }`
- `DM = { id: string; threadId: string; authorId: string; text: string }`
- `Thread = { id: string; personId: string; unread: boolean }`
- `Route = 'inbox' | 'thread' | 'people' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `people: Person[]`, `threads: Thread[]`, `dms: DM[]`, `theme: Theme`, `route: Route`
- `currentUserId: string` (always `'u1'`)
- `selectedThreadId: string | null`
- `query: string` — people-search query
- `openThread(threadId)` — sets `selectedThreadId`, marks that thread read, navigates to `thread`
- `sendDM(threadId, text)` — appends a `DM` (fresh id `d5`, `d6`, …) authored by
  `currentUserId`; blank/whitespace text is ignored (no DM added)
- `markRead(threadId)` — sets that thread's `unread` to `false`
- `markUnread(threadId)` — sets that thread's `unread` to `true`
- `setQuery(query)`, `setTheme(theme)`, `navigate(route)`

Seed people (`u1` is the current user):

| name | id | handle |
|---|---|---|
| You    | `u1` | `@you` |
| Ada    | `u2` | `@ada` |
| Linus  | `u3` | `@linus` |
| Grace  | `u4` | `@grace` |

Seed threads:

| id | person | unread |
|---|---|---|
| `t1` | `u2` | true  |
| `t2` | `u3` | false |
| `t3` | `u4` | true  |

Seed DMs:

| id | thread | author | text |
|---|---|---|---|
| `d1` | `t1` | `u2` | Hey there |
| `d2` | `t1` | `u1` | Hi Ada |
| `d3` | `t2` | `u3` | Ship it |
| `d4` | `t3` | `u4` | Coffee? |

The first sent DM gets id `d5`.

## Optional helper — `hooks/useInbox.ts`
Derived selectors over the shared state: `threadDMs(threadId)` (DMs in a thread),
`matchedPeople` (people whose name or handle contains `query`, case-insensitive; the current
user is excluded), and `stats` (`{ totalThreads, unreadThreads, totalMessages }`). Pure
helpers `dmsFor`, `searchPeople`, and `computeStats` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`inbox`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-inbox" | "nav-thread" | "nav-people" | "nav-settings"` (labels
Inbox / Thread / People / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/inbox/page.tsx` — `data-testid="page-inbox"`
List threads as `<ul data-testid="thread-list">` with each thread
`<li data-testid="thread-<id>">` containing the other person's name (`thread-<id>-name`), an
unread badge `thread-<id>-unread` whose text is `Unread` when unread and `Read` otherwise, and
an `open-<id>` button (calls `openThread`). Also a `<span data-testid="inbox-unread-count">`
showing the number of unread threads.

### `app/thread/page.tsx` — `data-testid="page-thread"`
Detail for `selectedThreadId`. If none is selected, render
`<p data-testid="no-thread-selected">`. Otherwise show the other person's name
(`thread-title`), the DM list as `<ul data-testid="dm-list">` with each DM
`<li data-testid="dm-<id>">` (author handle in `dm-<id>-author`, text in `dm-<id>-text`), a
send form `<form data-testid="send-form">` with `dm-input` and `send-submit`, and a
`mark-unread` button that calls `markUnread` for the thread. Submitting a non-blank DM adds it
and clears the input; a blank DM adds nothing.

### `app/people/page.tsx` — `data-testid="page-people"`
A directory with a search box `people-search` bound to `query`. Below it list
`matchedPeople` as `<ul data-testid="people-list">` of `<li data-testid="person-<id>">` with
name (`person-<id>-name`) and handle (`person-<id>-handle`). When nothing matches, render
`<p data-testid="no-people">` and **no** `people-list`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
A theme control `theme-select` (`<select>` with `light` / `dark`) bound to `theme`; changing
it calls `setTheme`. Also a `<div data-testid="inbox-stats">` showing `stat-threads`,
`stat-unread`, and `stat-messages` values from `stats`.

## Presentational components
- `components/ThreadRow.tsx` — one inbox row (see Inbox page).
- `components/DMItem.tsx` — one DM `<li>` (see Thread page).
- `components/PersonRow.tsx` — one people directory row (see People page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/threads/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ threads: Thread[] }`. Optional `?unread=true` filter (only unread threads).
- **POST** — body `{ personId }`. 201 with the created thread (`unread: false`, new ids
  `t4`, `t5`, …). If `personId` is missing/blank → 400 `{ error: "personId required" }`.
- **PUT** — `?id=<id>`. With body `{ unread: boolean }` set `unread` to that value; with no
  `unread` key, toggle. Returns the updated thread. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
