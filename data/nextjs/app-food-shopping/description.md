# Grocery Shopping List app

Build a small multi-route shopping-list app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding all cross-route state, and one API
route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Item = { id: string; name: string; aisle: string; qty: number; bought: boolean }`
- `AisleGroup = { aisle: string; items: Item[] }`
- `Route = 'list' | 'add' | 'aisles' | 'history'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client state, plus a `useShopping()` hook that
throws if used outside the provider. It exposes:

- `items: Item[]` (the active list), `history: Item[]` (items cleared after buying),
  `theme: Theme`, `route: Route`
- `addItem({ name, aisle, qty })` — appends an `Item` (`bought: false`, fresh id like `i5`,
  `i6`, …)
- `toggleBought(id)` — flips `bought`
- `removeItem(id)` — drops the item from the active list
- `clearBought()` — moves all `bought` items out of `items` into `history` (prepending so
  the most-recently cleared come first), leaving unbought items
- `setTheme`, `navigate(route)`

Seed data (4 items, history empty):

| item | id | aisle | qty | bought |
|---|---|---|---|---|
| Milk    | `i1` | Dairy    | 1 | false |
| Apples  | `i2` | Produce  | 6 | false |
| Cheddar | `i3` | Dairy    | 1 | true  |
| Bananas | `i4` | Produce  | 3 | false |

The first added item gets id `i5`.

## Optional helper — `hooks/useShoppingViews.ts`
Derived selectors: `groups` (active items grouped by aisle as `AisleGroup[]`, aisles sorted
alphabetically, items within in their original order), `boughtCount` (number of bought items
in the active list), and `remaining` (number of unbought items). Pure helper
`groupByAisle(items)` is convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`list`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-list | nav-add | nav-aisles |
nav-history` (labels List / Add / Aisles / History). Clicking calls `navigate`. The current
route's button has `aria-current="page"`; others must not. Show a `data-testid="remaining-badge"`
with the count of unbought active items.

## Pages
### `app/list/page.tsx` — `data-testid="page-list"`
The active list as `<li data-testid="item-<id>" data-bought="true|false">` containing
`item-<id>-name`, `item-<id>-qty`, a `toggle-<id>` button (calls `toggleBought`), and a
`remove-<id>` button (calls `removeItem`). When the list is empty, render
`<p data-testid="list-empty">` and **no** `item-list`; otherwise wrap rows in
`<ul data-testid="item-list">`. Also a `clear-bought` button that calls `clearBought`.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-item-form">` with `name-input`, `aisle-input`, `qty-input`
(type number), and `submit-item`. On submit: blank name → `<p data-testid="form-error">` and
stay; otherwise add the item (aisle defaults to `Other` when blank, qty defaults to 1 when
not a positive number) and `navigate('list')`.

### `app/aisles/page.tsx` — `data-testid="page-aisles"`
The active list grouped by aisle: for each group `<section data-testid="aisle-<aisle>">`
containing an `aisle-<aisle>-count` (number of items in that aisle) and the item names. When
there are no active items, render `<p data-testid="aisles-empty">`.

### `app/history/page.tsx` — `data-testid="page-history"`
Lists `history` items as `<li data-testid="history-<id>">` with the name. When empty, render
`<p data-testid="history-empty">`.

## Presentational components
- `components/ItemRow.tsx` — one item row on the list page.
- `components/AisleSection.tsx` — one aisle group on the aisles page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same items/ids as above) plus a `__reset()` that
re-seeds. Independent of the client Context state.

### `app/api/items/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ items: Item[] }`. Optional `?aisle=<name>` and `?bought=true|false` filters
  (combine with AND).
- **POST** — body `{ name, aisle?, qty? }`. 201 with the created item. Missing/blank `name`
  → 400 `{ error: "name required" }`. New ids continue `i5`, `i6`, …
- **PUT** — `?id=<id>`. With body `{ bought: boolean }` set it; with no `bought` key, toggle.
  Returns the updated item. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
