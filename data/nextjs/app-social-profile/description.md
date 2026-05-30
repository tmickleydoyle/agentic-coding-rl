# Social Profile app

Build a small multi-route profile app. Routing is **in-app** (React state — no `next`
imports anywhere). The app has four routes, a shared Context holding all cross-route state,
and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Profile = { id: string; name: string; bio: string }`
- `Post = { id: string; authorId: string; text: string }`
- `Route = 'profile' | 'posts' | 'connections' | 'edit'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `profiles: Profile[]`, `posts: Post[]`, `theme: Theme`, `route: Route`
- `meId: string` (always `'u1'`)
- `following: string[]` — ids `u1` follows
- `followers: string[]` — ids that follow `u1`
- `selectedUserId: string | null` — the profile being viewed (defaults to `meId`)
- `toggleFollow(userId)` — adds/removes `userId` from `following` (never self)
- `updateProfile(id, { name, bio })` — replaces that profile's name/bio
- `setTheme(theme)`, `viewUser(userId)` — sets `selectedUserId` and navigates to `profile`
- `navigate(route)`

Seed profiles (`u1` is me):

| name | id | bio |
|---|---|---|
| Mia   | `u1` | Builder of things |
| Omar  | `u2` | Designer |
| Zoe   | `u3` | Writer |
| Kai   | `u4` | Hacker |

`following` starts as `['u2', 'u3']`; `followers` starts as `['u2', 'u4']`.

Seed posts:

| text | id | author |
|---|---|---|
| First post      | `p1` | `u1` |
| Hello followers | `p2` | `u1` |
| Design tips     | `p3` | `u2` |

## Optional helper — `hooks/useProfile.ts`
Derived selectors: `me` (the `meId` profile), `viewed` (the `selectedUserId ?? meId`
profile), `myPosts` (posts authored by the currently-viewed user), and `counts`
(`{ posts, followers, following }` for the currently-viewed user — for non-me users,
`followers`/`following` are 0 since only my graph is tracked, and `posts` is their post
count). Pure helpers `postsBy` and `profileById` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`profile`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-profile" | "nav-posts" | "nav-connections" | "nav-edit"` (labels
Profile / Posts / Connections / Edit). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/profile/page.tsx` — `data-testid="page-profile"`
Profile for the currently-viewed user. Show name (`profile-name`), bio (`profile-bio`),
and a stat block `<div data-testid="profile-stats">` with `stat-posts`, `stat-followers`,
and `stat-following` values from `counts`. When the viewed user is NOT me, render a
`follow-toggle` button (text `Following`/`Follow`, toggles follow). For me, render no
`follow-toggle`.

### `app/posts/page.tsx` — `data-testid="page-posts"`
List the currently-viewed user's posts as `<li data-testid="post-<id>">` with text in
`post-<id>-text`. When the user has no posts, render `<p data-testid="empty-posts">` and
**no** `post-list`. Otherwise wrap rows in `<ul data-testid="post-list">`.

### `app/connections/page.tsx` — `data-testid="page-connections"`
Every profile except me as `<li data-testid="conn-<id>">` with name (`conn-<id>-name`),
a `follow-<id>` button (text `Following`/`Follow`, toggles follow) and a `view-<id>` button
(calls `viewUser`). Also two badges: `<span data-testid="following-count">` and
`<span data-testid="followers-count">` showing the sizes of my `following`/`followers`.

### `app/edit/page.tsx` — `data-testid="page-edit"`
Edit MY profile. `<form data-testid="edit-form">` with `name-input` (prefilled with my
name), `bio-input` (prefilled with my bio), and `save-profile`. On submit: if the name is
empty/whitespace, render `<p data-testid="edit-error">` and do not save. Otherwise call
`updateProfile(meId, { name, bio })` and `navigate('profile')`. Names are saved trimmed.

## Presentational components
- `components/StatBlock.tsx` — `{ label, value, testid }` → renders `stat-<testid>` value.
- `components/ConnectionRow.tsx` — one connections row (see Connections page).
- `components/PostItem.tsx` — one post `<li>` (see Posts page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/users/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ users: Profile[] }`. Optional `?q=<text>` filters by case-insensitive name
  substring.
- **POST** — body `{ name, bio? }`. 201 with the created profile (new ids `u5`, `u6`, …,
  `bio` defaults to `""`). If `name` is missing/blank → 400 `{ error: "name required" }`.
- **PUT** — `?id=<id>`. body `{ name?, bio? }`. Updates the given fields and returns the
  profile. A `name` present but blank → 400 `{ error: "name required" }`. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
