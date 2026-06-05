> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Group Chats app

Build a small multi-route group-chat management app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding all cross-route state, and an
API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Person = { id: string; name: string }`
- `Group = { id: string; name: string; adminId: string; memberIds: string[] }`
- `Route = 'chats' | 'chat-detail' | 'members' | 'create'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `people: Person[]`, `groups: Group[]`, `theme: Theme`, `route: Route`
- `currentUserId: string` (always `'u1'`)
- `selectedGroupId: string | null`
- `openGroup(groupId)` — sets `selectedGroupId`, navigates to `chat-detail`
- `addMember(groupId, personId)` — adds `personId` to that group's `memberIds` (no duplicates)
- `removeMember(groupId, personId)` — removes `personId` from that group's `memberIds`; the
  group admin can never be removed (ignored if `personId` is the admin)
- `leaveGroup(groupId)` — removes `currentUserId` from that group's `memberIds` (ignored if the
  current user is the admin)
- `createGroup(name)` — appends a `Group` (fresh id `g4`, `g5`, …) with `adminId` =
  `currentUserId` and `memberIds` = `[currentUserId]`; blank/whitespace name is ignored (no
  group added); after creating, sets `selectedGroupId` to the new group and navigates to
  `chat-detail`
- `setTheme(theme)`, `navigate(route)`

Seed people (`u1` is the current user):

| name | id |
|---|---|
| You    | `u1` |
| Ada    | `u2` |
| Linus  | `u3` |
| Grace  | `u4` |

Seed groups:

| id | name | admin | members |
|---|---|---|---|
| `g1` | Weekend Plans | `u1` | `[u1, u2, u3]` |
| `g2` | Book Club     | `u2` | `[u1, u2, u4]` |
| `g3` | Founders      | `u3` | `[u3, u4]`     |

The first created group gets id `g4`.

## Optional helper — `hooks/useGroups.ts`
Derived selectors over the shared state: `myGroups` (groups whose `memberIds` include the
current user), `nonMembers(groupId)` (people not in that group), and `stats`
(`{ totalGroups, myGroupCount, adminCount }` where `adminCount` is the number of groups the
current user administers). Pure helpers `filterMine`, `outsiders`, and `computeStats` are
convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`chats`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-chats" | "nav-chat-detail" | "nav-members" | "nav-create"` (labels
Chats / Detail / Members / Create). Clicking one calls `navigate`. The button for the current
route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/chats/page.tsx` — `data-testid="page-chats"`
List the current user's groups only (`myGroups`) as `<ul data-testid="chats-list">` with each
group `<li data-testid="group-<id>">` containing the name (`group-<id>-name`), a member count
(`group-<id>-count`), and an `open-<id>` button (calls `openGroup`). Also a
`<span data-testid="chats-count">` showing the number of the current user's groups.

### `app/chat-detail/page.tsx` — `data-testid="page-chat-detail"`
Detail for `selectedGroupId`. If none is selected, render
`<p data-testid="no-group-selected">`. Otherwise show the group name (`detail-name`), an
admin badge `detail-admin` showing the admin's name, the member list as
`<ul data-testid="member-list">` with each member `<li data-testid="member-<id>">` (name in
`member-<id>-name`, plus a `remove-<id>` button that calls `removeMember`; render NO
`remove-<id>` button for the admin member). A `<select data-testid="add-select">` listing
`nonMembers(group)` (option value `''` placeholder plus one per non-member) with an
`add-submit` button that adds the chosen person via `addMember` (does nothing when the
placeholder is selected). When the current user is NOT the admin, also render a `leave-group`
button that calls `leaveGroup`; when the current user IS the admin, render no `leave-group`.

### `app/members/page.tsx` — `data-testid="page-members"`
A directory of every person as `<ul data-testid="people-list">` of
`<li data-testid="person-<id>">` with name (`person-<id>-name`). Also a
`<div data-testid="group-stats">` showing `stat-total`, `stat-mine`, and `stat-admin` values
from `stats`.

### `app/create/page.tsx` — `data-testid="page-create"`
A create form `<form data-testid="create-form">` with `name-input` and `create-submit`.
Submitting a non-blank name calls `createGroup` and clears the input; a blank name does
nothing. Also a theme control `theme-select` (`<select>` with `light` / `dark`) bound to
`theme`; changing it calls `setTheme`.

## Presentational components
- `components/GroupRow.tsx` — one chats-list row (see Chats page).
- `components/MemberItem.tsx` — one member `<li>` (see Chat Detail page).
- `components/PersonRow.tsx` — one members directory row (see Members page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/chats/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ groups: Group[] }`. Optional `?memberId=<id>` filter (only groups containing
  that member).
- **POST** — body `{ name, adminId }`. 201 with the created group (`memberIds: [adminId]`,
  new ids `g4`, `g5`, …). If `name` is missing/blank → 400 `{ error: "name required" }`. If
  `adminId` is missing/blank → 400 `{ error: "adminId required" }`.
- **PUT** — `?id=<id>`. Body `{ add?: string; remove?: string }`. Adds/removes a member id
  (the admin can never be removed). Returns the updated group. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
