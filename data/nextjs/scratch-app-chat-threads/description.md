> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Threaded Channel Chat app

Build a small multi-route threaded-chat app: a channel of top-level messages, each of which
can have threaded replies, with reply counts and a resolve toggle. Routing is **in-app**
(React state — no `next` imports anywhere). Four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Member = { id: string; name: string; handle: string }`
- `Reply = { id: string; messageId: string; authorId: string; text: string }`
- `Message = { id: string; authorId: string; text: string; resolved: boolean }`
- `Route = 'channel' | 'thread' | 'search' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `members: Member[]`, `messages: Message[]`, `replies: Reply[]`, `theme: Theme`, `route: Route`
- `currentUserId: string` (always `'u1'`)
- `selectedMessageId: string | null`
- `query: string` — message-search query
- `openThread(messageId)` — sets `selectedMessageId`, navigates to `thread`
- `postMessage(text)` — appends a top-level `Message` (fresh id `m4`, `m5`, …) authored by
  `currentUserId` with `resolved: false`; blank/whitespace text is ignored (no message added)
- `addReply(messageId, text)` — appends a `Reply` (fresh id `r5`, `r6`, …) authored by
  `currentUserId`; blank/whitespace text is ignored (no reply added)
- `toggleResolved(messageId)` — flips that message's `resolved`
- `setQuery(query)`, `setTheme(theme)`, `navigate(route)`

Seed members (`u1` is the current user):

| name | id | handle |
|---|---|---|
| You    | `u1` | `@you` |
| Ada    | `u2` | `@ada` |
| Linus  | `u3` | `@linus` |

Seed messages:

| id | author | text | resolved |
|---|---|---|---|
| `m1` | `u2` | Deploy failing | false |
| `m2` | `u3` | Lunch spot ideas | false |
| `m3` | `u1` | Docs updated | true |

Seed replies:

| id | message | author | text |
|---|---|---|---|
| `r1` | `m1` | `u1` | Looking now |
| `r2` | `m1` | `u3` | Same here |
| `r3` | `m1` | `u2` | Fixed it |
| `r4` | `m2` | `u1` | Tacos |

The first posted message gets id `m4`; the first added reply gets id `r5`.

## Optional helper — `hooks/useChannel.ts`
Derived selectors over the shared state: `messageReplies(messageId)` (replies on a message),
`replyCount(messageId)` (number of replies), `matchedMessages` (messages whose text contains
`query`, case-insensitive), and `stats` (`{ totalMessages, openMessages, totalReplies }`
where `openMessages` counts unresolved messages). Pure helpers `repliesFor`, `searchMessages`,
and `computeStats` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`channel`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-channel" | "nav-thread" | "nav-search" | "nav-settings"` (labels
Channel / Thread / Search / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/channel/page.tsx` — `data-testid="page-channel"`
A post form `<form data-testid="post-form">` with `post-input` and `post-submit` (posts a new
top-level message; blank ignored; clears input on submit). Below it list every message as
`<ul data-testid="message-list">` with each message `<li data-testid="message-<id>">`
containing the author handle (`message-<id>-author`), text (`message-<id>-text`), a reply count
(`message-<id>-replies`), a resolved badge `message-<id>-status` whose text is `Resolved` when
resolved and `Open` otherwise, and an `open-<id>` button (calls `openThread`).

### `app/thread/page.tsx` — `data-testid="page-thread"`
Detail for `selectedMessageId`. If none is selected, render
`<p data-testid="no-thread-selected">`. Otherwise show the root message text
(`thread-text`), a resolved badge (`thread-status`, same `Resolved`/`Open` text), a
`resolve-toggle` button (text `Reopen` when resolved, `Resolve` when open) that calls
`toggleResolved`, the reply list as `<ul data-testid="reply-list">` with each reply
`<li data-testid="reply-<id>">` (author handle in `reply-<id>-author`, text in
`reply-<id>-text`), and a reply form `<form data-testid="reply-form">` with `reply-input` and
`reply-submit`. Submitting a non-blank reply adds it and clears the input; a blank reply adds
nothing.

### `app/search/page.tsx` — `data-testid="page-search"`
A search box `message-search` bound to `query`. Below it list `matchedMessages` as
`<ul data-testid="search-list">` of `<li data-testid="result-<id>">` with the text
(`result-<id>-text`) and an `open-result-<id>` button (calls `openThread`). When nothing
matches, render `<p data-testid="no-results">` and **no** `search-list`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
A theme control `theme-select` (`<select>` with `light` / `dark`) bound to `theme`; changing
it calls `setTheme`. Also a `<div data-testid="channel-stats">` showing `stat-messages`,
`stat-open`, and `stat-replies` values from `stats`.

## Presentational components
- `components/MessageCard.tsx` — one channel message row (see Channel page).
- `components/ReplyItem.tsx` — one reply `<li>` (see Thread page).
- `components/ResultRow.tsx` — one search result row (see Search page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/messages/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ messages: Message[] }`. Optional `?resolved=true|false` filter.
- **POST** — body `{ authorId, text }`. 201 with the created message (`resolved: false`, new
  ids `m4`, `m5`, …). If `authorId` is missing/blank → 400 `{ error: "authorId required" }`.
  If `text` is missing/blank → 400 `{ error: "text required" }`.
- **PUT** — `?id=<id>`. With body `{ resolved: boolean }` set `resolved` to that value; with
  no `resolved` key, toggle. Returns the updated message. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
