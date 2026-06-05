> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Chat Rooms app

Build a small multi-route chat-rooms app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state,
and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Member = { id: string; name: string; handle: string }`
- `Message = { id: string; roomId: string; authorId: string; text: string }`
- `Room = { id: string; name: string; topic: string }`
- `Route = 'rooms' | 'room' | 'members' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `rooms: Room[]`, `members: Member[]`, `messages: Message[]`, `theme: Theme`, `route: Route`
- `currentUserId: string` (always `'u1'`)
- `selectedRoomId: string | null`
- `unread: Record<string, number>` — unread counts per room id
- `openRoom(roomId)` — sets `selectedRoomId`, clears that room's unread to 0, navigates to `room`
- `sendMessage(roomId, text)` — appends a `Message` (fresh id `m6`, `m7`, …) authored by
  `currentUserId`; blank/whitespace text is ignored (no message added); a message sent to a
  room that is NOT the selected room increments that room's unread count
- `markRead(roomId)` — sets that room's unread to 0
- `setTheme(theme)`, `navigate(route)`

Seed members (`u1` is the current user):

| name | id | handle |
|---|---|---|
| You    | `u1` | `@you` |
| Ada    | `u2` | `@ada` |
| Linus  | `u3` | `@linus` |

Seed rooms:

| name | id | topic |
|---|---|---|
| General  | `r1` | Company wide |
| Random   | `r2` | Off topic |
| Dev      | `r3` | Engineering |

Seed messages:

| id | room | author | text |
|---|---|---|---|
| `m1` | `r1` | `u2` | Morning all |
| `m2` | `r1` | `u3` | Hi there |
| `m3` | `r2` | `u2` | Lunch? |
| `m4` | `r3` | `u3` | Build is green |
| `m5` | `r3` | `u1` | Nice |

The first sent message gets id `m6`.

`unread` starts as `{ r1: 0, r2: 2, r3: 0 }`.

## Optional helper — `hooks/useRooms.ts`
Derived selectors over the shared state: `roomMessages(roomId)` (messages in a room) and
`stats` (`{ totalRooms, totalMessages, totalUnread }`). Pure helpers `messagesFor` and
`computeStats` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`rooms`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-rooms" | "nav-room" | "nav-members" | "nav-settings"` (labels
Rooms / Room / Members / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/rooms/page.tsx` — `data-testid="page-rooms"`
List rooms as `<ul data-testid="rooms-list">` with each room
`<li data-testid="room-<id>">` containing the name (`room-<id>-name`), topic
(`room-<id>-topic`), an unread badge `room-<id>-unread` (the unread count number), and an
`open-<id>` button (calls `openRoom`).

### `app/room/page.tsx` — `data-testid="page-room"`
Detail for `selectedRoomId`. If none is selected, render
`<p data-testid="no-room-selected">`. Otherwise show the room name (`room-title`), the
message list as `<ul data-testid="message-list">` with each message
`<li data-testid="message-<id>">` (author handle in `message-<id>-author`, text in
`message-<id>-text`), and a send form `<form data-testid="send-form">` with `message-input`
and `send-submit`. Submitting a non-blank message adds it and clears the input; a blank
message adds nothing.

### `app/members/page.tsx` — `data-testid="page-members"`
A directory of every member as `<ul data-testid="members-list">` of
`<li data-testid="member-<id>">` with name (`member-<id>-name`) and handle
(`member-<id>-handle`). Also a `<div data-testid="room-stats">` showing `stat-rooms`,
`stat-messages`, and `stat-unread` values from `stats`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
A theme control `theme-select` (`<select>` with `light` / `dark`) bound to `theme`; changing
it calls `setTheme`. Also a `mark-all-read` button that calls `markRead` for every room (sets
all unread to 0), and a `<span data-testid="settings-unread">` showing the total unread count.

## Presentational components
- `components/RoomCard.tsx` — one rooms-list row (see Rooms page).
- `components/MessageItem.tsx` — one message `<li>` (see Room page).
- `components/MemberRow.tsx` — one members directory row (see Members page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/messages/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ messages: Message[] }`. Optional `?roomId=<id>` filter.
- **POST** — body `{ roomId, authorId, text }`. 201 with the created message (new ids
  `m6`, `m7`, …). If `roomId` is missing/blank → 400 `{ error: "roomId required" }`. If
  `authorId` is missing/blank → 400 `{ error: "authorId required" }`. If `text` is
  missing/blank → 400 `{ error: "text required" }`.
- **PUT** — `?id=<id>` with body `{ text }`. Edits the message text. Returns the updated
  message. Blank text → 400 `{ error: "text required" }`. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
