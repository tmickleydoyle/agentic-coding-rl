# Support Chat app

Build a small multi-route customer-support chat app. Routing is **in-app** (React state —
no `next` imports anywhere). Four routes, a shared Context holding all cross-route state, and
an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Agent = { id: string; name: string }`
- `Canned = { id: string; label: string; text: string }`
- `Reply = { id: string; chatId: string; authorId: string; text: string }`
- `Status = 'open' | 'closed'`
- `Chat = { id: string; customer: string; status: Status; agentId: string | null }`
- `Route = 'queue' | 'chat' | 'canned' | 'history'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `agents: Agent[]`, `chats: Chat[]`, `replies: Reply[]`, `canned: Canned[]`, `theme: Theme`,
  `route: Route`
- `currentAgentId: string` (always `'a1'`)
- `selectedChatId: string | null`
- `openChat(chatId)` — sets `selectedChatId`, navigates to `chat`
- `sendReply(chatId, text)` — appends a `Reply` (fresh id `y4`, `y5`, …) authored by
  `currentAgentId`; blank/whitespace text is ignored (no reply added)
- `closeChat(chatId)` — sets that chat's `status` to `closed`
- `reopenChat(chatId)` — sets that chat's `status` to `open`
- `assignAgent(chatId, agentId)` — sets that chat's `agentId`
- `setTheme(theme)`, `navigate(route)`

Seed agents:

| name | id |
|---|---|
| You   | `a1` |
| Sam   | `a2` |

Seed chats:

| id | customer | status | agentId |
|---|---|---|---|
| `c1` | Alice | open   | `a1`  |
| `c2` | Bob   | open   | null  |
| `c3` | Cara  | closed | `a2`  |

Seed canned replies:

| id | label | text |
|---|---|---|
| `k1` | Greeting | Hi, how can I help? |
| `k2` | Closing  | Glad I could help! |

Seed replies:

| id | chat | author | text |
|---|---|---|---|
| `y1` | `c1` | Alice | My order is late |
| `y2` | `c1` | `a1`  | Let me check |
| `y3` | `c3` | `a2`  | All sorted |

The first sent reply gets id `y4`.

## Optional helper — `hooks/useSupport.ts`
Derived selectors over the shared state: `chatReplies(chatId)` (replies in a chat),
`openChats` (chats whose status is `open`), and `stats`
(`{ totalChats, openChats, closedChats }`). Pure helpers `repliesFor`, `filterOpen`, and
`computeStats` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`queue`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-queue" | "nav-chat" | "nav-canned" | "nav-history"` (labels
Queue / Chat / Canned / History). Clicking one calls `navigate`. The button for the current
route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/queue/page.tsx` — `data-testid="page-queue"`
List the OPEN chats only as `<ul data-testid="queue-list">` with each chat
`<li data-testid="chat-<id>">` containing the customer name (`chat-<id>-customer`), the
status (`chat-<id>-status`), and an `open-<id>` button (calls `openChat`). Also a
`<span data-testid="queue-count">` showing the number of open chats.

### `app/chat/page.tsx` — `data-testid="page-chat"`
Detail for `selectedChatId`. If none is selected, render `<p data-testid="no-chat-selected">`.
Otherwise show the customer name (`chat-title`), the status (`chat-status`), the reply list as
`<ul data-testid="reply-list">` with each reply `<li data-testid="reply-<id>">` (text in
`reply-<id>-text`), a send form `<form data-testid="send-form">` with `reply-input` and
`send-submit`, an agent `<select data-testid="assign-select">` bound to the chat's `agentId`
(option value `''` for Unassigned plus one option per agent) that calls `assignAgent`, and a
`close-toggle` button whose text is `Reopen` when the chat is closed and `Close` when open;
clicking it closes an open chat or reopens a closed one. Submitting a non-blank reply adds it
and clears the input; a blank reply adds nothing.

### `app/canned/page.tsx` — `data-testid="page-canned"`
List canned replies as `<ul data-testid="canned-list">` of `<li data-testid="canned-<id>">`
with the label (`canned-<id>-label`) and a `use-<id>` button. When a chat is selected,
clicking `use-<id>` calls `sendReply(selectedChatId, cannedText)`; when no chat is selected,
the button is disabled.

### `app/history/page.tsx` — `data-testid="page-history"`
A theme control `theme-select` (`<select>` with `light` / `dark`) bound to `theme`; changing
it calls `setTheme`. List ALL chats as `<ul data-testid="history-list">` of
`<li data-testid="history-<id>">` with customer (`history-<id>-customer`) and status
(`history-<id>-status`). Also a `<div data-testid="support-stats">` showing `stat-total`,
`stat-open`, and `stat-closed` values from `stats`.

## Presentational components
- `components/ChatRow.tsx` — one queue row (see Queue page).
- `components/ReplyItem.tsx` — one reply `<li>` (see Chat page).
- `components/CannedRow.tsx` — one canned-replies row (see Canned page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/chats/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ chats: Chat[] }`. Optional `?status=open|closed` filter.
- **POST** — body `{ customer }`. 201 with the created chat (`status: 'open'`,
  `agentId: null`, new ids `c4`, `c5`, …). If `customer` is missing/blank → 400
  `{ error: "customer required" }`.
- **PUT** — `?id=<id>`. Body may include `status` (`'open'`/`'closed'`) and/or `agentId`
  (string or null). Applies whichever keys are present and returns the updated chat. Unknown
  id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
