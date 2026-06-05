> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Kanban Board app

Build a small multi-route kanban board app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Column = 'backlog' | 'doing' | 'done'`
- `Card = { id: string; title: string; column: Column; archived: boolean }`
- `Route = 'board' | 'add-card' | 'archive' | 'settings'`
- `Theme = 'light' | 'dark'`

The columns are ordered `['backlog', 'doing', 'done']`. "Forward" moves toward `done`,
"back" moves toward `backlog`. A card already in `done` cannot move forward; a card in
`backlog` cannot move back.

## Shared state — `components/BoardProvider.tsx`
A React Context provider holding the whole client app state, plus a `useBoard()` hook that
throws if used outside the provider. It exposes:

- `cards: Card[]`, `theme: Theme`, `route: Route`, `wipLimit: number`
- `addCard(title: string)` — appends a new `Card` in `backlog` (`archived: false`,
  fresh string id like `c5`, `c6`, …). Whitespace-only titles are ignored (no card added).
- `moveForward(id)` / `moveBack(id)` — shift a card one column; no-op at the ends
- `deleteCard(id)` — drops the card entirely
- `archiveCard(id)` — sets `archived: true` (stays in the list, hidden from the board)
- `restoreCard(id)` — sets `archived: false`
- `setWipLimit(n: number)` — sets the per-column WIP limit
- `setTheme`, `navigate(route)`

Seed data (4 cards, default `wipLimit = 3`):

| card | id | column | archived |
|---|---|---|---|
| Set up repo      | `c1` | backlog | false |
| Write tests      | `c2` | doing   | false |
| Draft API        | `c3` | doing   | false |
| Ship v1          | `c4` | done    | false |

The first added card gets id `c5`.

## Optional helper — `hooks/useColumns.ts`
Derived selectors over the shared state: `byColumn` (a `Record<Column, Card[]>` of
non-archived cards per column, preserving insertion order) and `counts`
(`Record<Column, number>`). Pure helpers `groupByColumn` and `countByColumn` are
convenient but not required by name. A column is "over limit" when its count exceeds
`wipLimit`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<BoardProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`board`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-board" | "nav-add-card" | "nav-archive" | "nav-settings"` (labels
Board / Add card / Archive / Settings). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/board/page.tsx` — `data-testid="page-board"`
Renders three `Column` sections in order backlog/doing/done. Each column:
`<section data-testid="column-<col>">` with a count `<span data-testid="count-<col>">`
showing the number of non-archived cards in it, and — when the count exceeds `wipLimit` —
a `<p data-testid="warning-<col>">` warning element (absent otherwise). Each non-archived
card renders as `<li data-testid="card-<id>" data-column="<col>">` with the title, a
`forward-<id>` button (absent in `done`), a `back-<id>` button (absent in `backlog`), an
`archive-<id>` button, and a `delete-<id>` button.

### `app/add-card/page.tsx` — `data-testid="page-add-card"`
`<form data-testid="add-card-form">` with `card-title-input` and `submit-card`. On submit:
if the title is empty/whitespace, render `<p data-testid="form-error">` and stay on the
page. Otherwise add the card (lands in backlog) and `navigate('board')`.

### `app/archive/page.tsx` — `data-testid="page-archive"`
Lists archived cards as `<li data-testid="archived-<id>">` with the title and a
`restore-<id>` button. When there are none, render `<p data-testid="empty-archive">` and
**no** `archive-list`. Otherwise wrap rows in `<ul data-testid="archive-list">`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` shows the current theme; `theme-toggle` button flips
light/dark in context. A `wip-input` (number) plus `wip-save` button updates `wipLimit`;
`<span data-testid="current-wip">` shows the current limit. Theme persists across
navigation and is reflected on `app-root`'s `data-theme`.

## Presentational components
- `components/CardItem.tsx` — one board card row (see Board page).
- `components/Column.tsx` — a single column section (count, optional warning, card list).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/cards/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ cards: Card[] }`. Optional `?column=backlog|doing|done` filter, and
  `?archived=true|false` filter (combine with AND). By default returns all cards.
- **POST** — body `{ title }`. 201 with the created card (column `backlog`, not archived).
  If `title` is missing/blank → 400 `{ error: "title required" }`. New ids continue `c5`, `c6`, …
- **PUT** — `?id=<id>`. Body may include `{ column }` to set the column and/or
  `{ archived: boolean }` to set archived. Returns the updated card. Unknown id → 404
  `{ error: "not found" }`. Invalid column value → 400 `{ error: "invalid column" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
