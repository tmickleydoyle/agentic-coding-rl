> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Code Snippets app

Build a small multi-route code-snippet library. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Snippet = { id: string; title: string; language: string; code: string; favorite: boolean; copyCount: number }`
- `Route = 'snippets' | 'detail' | 'add' | 'favorites'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `snippets: Snippet[]`, `theme: Theme`, `route: Route`
- `selectedId: string | null` — the snippet shown on the detail page
- `languageFilter: string | null` — active language filter on the list
- `searchQuery: string`
- `addSnippet({ title, language, code })` — appends a `Snippet` (`favorite: false`,
  `copyCount: 0`, fresh id `s4`, `s5`, …), returns it
- `toggleFavorite(id)` — flips `favorite`
- `incrementCopy(id)` — bumps `copyCount` by 1
- `removeSnippet(id)` — drops a snippet
- `openSnippet(id)` — sets `selectedId` + navigates to `detail`
- `setLanguageFilter`, `setSearchQuery`, `setTheme`, `navigate(route)`

Seed data (3 snippets):

| snippet | id | language | favorite | copyCount |
|---|---|---|---|---|
| Debounce       | `s1` | js     | false | 0 |
| Quick sort     | `s2` | python | true  | 2 |
| Flex center    | `s3` | css    | false | 0 |

(Bodies are short code strings; titles must be searchable.) The first added snippet gets id
`s4`.

## Derived helpers — `hooks/useSnippets.ts`
Pure helpers (convenient, not required by name) plus a `useSnippets()` hook returning:
- `visibleSnippets` — `snippets` filtered by `languageFilter` (when set) AND `searchQuery`
  (case-insensitive title match; blank query matches everything).
- `languages` — sorted unique languages across ALL snippets.
- `favorites` — snippets with `favorite === true`.
- `selected` — the snippet whose id is `selectedId`, or `null`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`snippets`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-snippets" | "nav-detail" | "nav-add" | "nav-favorites"` (labels
Snippets / Detail / Add / Favorites). The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/snippets/page.tsx` — `data-testid="page-snippets"`
A `search-input` bound to `searchQuery`, a `language-filter` `<select>` (option `all` = "All
languages" plus one per language in `languages`), then the list. Each row is
`<li data-testid="snippet-<id>">` with `snippet-<id>-title`, `snippet-<id>-language`, an
`open-<id>` button (calls `openSnippet`), and a `fav-<id>` button (calls `toggleFavorite`).
When `visibleSnippets` is empty render `<p data-testid="snippets-empty">` and **no**
`snippet-list`; otherwise wrap rows in `<ul data-testid="snippet-list">`.

### `app/detail/page.tsx` — `data-testid="page-detail"`
If no snippet selected, render `<p data-testid="no-selection">`. Otherwise show
`<p data-testid="detail-title">`, `<p data-testid="detail-language">`,
`<pre data-testid="detail-code">`, and `<p data-testid="detail-copies">` (the copyCount).
Buttons: `copy-snippet` (calls `incrementCopy(selected.id)`), `toggle-fav` (calls
`toggleFavorite`), and `delete-snippet` (calls `removeSnippet(selected.id)` then
`navigate('snippets')`).

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="snippet-form">` with `title-input`, `language-input`, `code-input`
(textarea), and `save-snippet`. On submit: if `title` OR `language` is empty/whitespace,
render `<p data-testid="form-error">` and stay. Otherwise `addSnippet` and
`navigate('snippets')`.

### `app/favorites/page.tsx` — `data-testid="page-favorites"`
A `<ul data-testid="favorites-list">` of `favorites`. Each is
`<li data-testid="favorite-<id>">` with `favorite-<id>-title` and an `unfav-<id>` button
(calls `toggleFavorite`). When there are none render `<p data-testid="favorites-empty">` and
no list.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/snippets/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ snippets: Snippet[] }`. Optional `?language=<lang>`, `?favorite=true`, and
  `?q=<text>` (case-insensitive title match) filters (AND).
- **POST** — body `{ title, language, code? }`. 201 with the created snippet. If `title` or
  `language` is missing/blank → 400 `{ error: "title and language required" }`. New ids
  continue `s4`, `s5`, …
- **PUT** — `?id=<id>`. Body `{ title?, language?, code?, favorite? }` patch; additionally
  `{ copy: true }` increments `copyCount`. Returns the updated snippet. Unknown id → 404
  `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
