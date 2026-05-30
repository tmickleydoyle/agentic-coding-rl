# Inventory Warehouse app

Build a small multi-route warehouse-bins app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and one API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `BinItem = { name: string; qty: number }`
- `Bin = { id: string; code: string; capacity: number; items: BinItem[] }`
- `Route = 'bins' | 'bin-detail' | 'move' | 'map'`
- `Theme = 'light' | 'dark'`

Helpers: `used(bin)` (sum of item qtys), `freeSpace(bin)` (`max(0, capacity - used)`),
`usagePct(bin)` (rounded `used/capacity * 100`, 0 when capacity 0), `isFull(bin)`
(`used >= capacity`).

## Move logic — `lib/move.ts`
A pure `moveItem(bins, fromId, toId, name, qty)` returning `{ ok: true; bins }` or
`{ ok: false; error }`. Rejections (in priority order): `'same bin'` if from === to,
`'qty must be positive'` if `qty <= 0`, `'bin not found'`, `'not enough stock'` if the source
holds less than `qty` of `name`, `'not enough space'` if the destination's free space is below
`qty`. On success it returns a new bins array: the source loses `qty` (the item entry is
removed if it hits 0) and the destination gains `qty` (a new entry is appended if absent).

## Shared state — `components/AppStateProvider.tsx`
A Context provider plus a `useWarehouse()` hook that throws outside the provider. Exposes:

- `bins: Bin[]`, `theme`, `route`, `selectedId: string | null`, `lastError: string | null`
- `move(fromId, toId, name, qty)` — applies `moveItem`; on failure sets `lastError` and
  returns `false`; on success clears `lastError`, updates bins, returns `true`
- `selectBin(id)` — selects and navigates to `bin-detail`
- `setTheme`, `navigate(route)`

Seed bins:

| id | code | capacity | items |
|---|---|---|---|
| `b1` | A1 | 100 | Bolts 40, Nuts 20 |
| `b2` | A2 | 50  | Washers 50 (full) |
| `b3` | B1 | 80  | (empty) |

## Derived helpers — `hooks/useBins.ts`
`bins`, `stats` (`{ bins, capacity, used }` summed across all bins), and `selected` (or
`null`).

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `bins`.

## NavBar — `components/NavBar.tsx`
`nav-bins | nav-bin-detail | nav-move | nav-map` (Bins / Detail / Move / Map). Active route's
button has `aria-current="page"`; others must not.

## Pages
### `app/bins/page.tsx` — `data-testid="page-bins"`
The bin list. Each bin via `BinRow` as `<li data-testid="bin-<id>" data-full="true|false">`
with `bin-<id>-code`, `bin-<id>-used`, `bin-<id>-capacity`, `bin-<id>-free`,
`bin-<id>-usage`, and a `view-<id>` button (calls `selectBin`). Wrap rows in
`<ul data-testid="bin-list">` (or `<p data-testid="empty-state">` when none).

### `app/bin-detail/page.tsx` — `data-testid="page-bin-detail"`
Detail for `selectedId`, else `<p data-testid="no-selection">`. Shows `detail-code`,
`detail-used`, `detail-capacity`, `detail-free`, `detail-usage`. List items as
`<li data-testid="item-<name>">` with `item-<name>-qty` inside `<ul data-testid="item-list">`,
or `<p data-testid="bin-empty">` when the bin has no items. A `go-move` button navigates to
`move`.

### `app/move/page.tsx` — `data-testid="page-move"`
A `from-bin` select and a `to-bin` select (each bin's code as the label, value = id), an
`item-name` input, a `move-qty` input (default `1`), and a `do-move` button calling `move`.
On failure show `<p data-testid="move-error">` with the error text; on success show
`<p data-testid="move-success">`.

### `app/map/page.tsx` — `data-testid="page-map"`
`current-theme` + `theme-toggle` (reflected on `app-root`). `<p data-testid="overall-usage">`
reads `"<used>/<capacity> (<pct>%)"` across all bins. `<p data-testid="bin-count">` reads
`"<n> bins"`. A `<ul data-testid="map-grid">` with one `<li data-testid="cell-<id>"
data-usage="<pct>">` per bin; clicking a cell calls `selectBin`.

## Presentational components
- `components/BinRow.tsx` — one bin row (see Bins page).

## API — separate in-memory store
`lib/store.ts` holds its own seed bins plus `__reset()`, and reuses `moveItem` from
`lib/move.ts`.

### `app/api/bins/route.ts`
Web `Request`/`Response`; re-export `__reset`. `content-type: application/json` on all.
- **GET** — `{ bins }`. Optional `?available=true` keeps only bins with free space.
- **POST** — body `{ code, capacity }`. 201 with the created bin (`items: []`, ids `b4`…).
  Blank code → 400 `{ error: "code required" }`; non-positive capacity → 400
  `{ error: "capacity invalid" }`.
- **PUT** — body `{ from, to, name, qty }` moves items. Bad fields → 400
  `{ error: "move invalid" }`; non-positive qty → 400 `{ error: "qty invalid" }`; unknown bin
  → 404 `{ error: "not found" }`; a rejected move → 409 with the move error
  (`{ error: "not enough space" }`, etc.). Success → `{ bins }`.
