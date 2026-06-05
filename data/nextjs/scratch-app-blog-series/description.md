> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Blog Series app

Build a small multi-route app for multi-part article series. Routing is **in-app** (React
state — no `next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Part = { id: string; seriesId: string; order: number; title: string; read: boolean }`
- `Series = { id: string; title: string; author: string }`
- `Route = 'series' | 'series-detail' | 'reader' | 'add-part'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client app state, plus a `useApp()` hook that
throws if used outside the provider. It exposes:

- `series: Series[]`, `parts: Part[]`, `theme: Theme`, `route: Route`
- `currentSeriesId: string | null` — selected series for detail/reader
- `addPart({ seriesId, title })` — appends a new `Part` (`read: false`, `order` = one more
  than the max order in that series, fresh string id like `x7`, `x8`, …)
- `markRead(id)` — sets a part's `read` to `true`
- `toggleRead(id)` — flips `read`
- `selectSeries(id)` — sets `currentSeriesId`
- `setTheme`, `navigate(route)`

Seed data (2 series, 6 parts):

| series | id | author |
|---|---|---|
| Learning Rust  | `s1` | Ada |
| Async Patterns | `s2` | Lin |

| part | id | series | order | read |
|---|---|---|---|---|
| Setup          | `x1` | `s1` | 1 | true  |
| Ownership      | `x2` | `s1` | 2 | true  |
| Lifetimes      | `x3` | `s1` | 3 | false |
| Event loop     | `x4` | `s2` | 1 | true  |
| Promises       | `x5` | `s2` | 2 | false |
| Async/await    | `x6` | `s2` | 3 | false |

The first added part gets id `x7`.

## Optional helper — `hooks/useSeries.ts`
Derived selectors over shared state. `partsFor(seriesId)` returns that series' parts
sorted by `order`. `progressFor(seriesId)` returns `{ total, read, percent }` where
`percent` is `read/total` rounded to a whole number (0 when total is 0). Pure helpers
`sortParts` and `seriesProgress` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders a root element
`<div data-testid="app-root" data-theme={theme}>` containing `<NavBar/>` and
`<main data-testid="page-content">` that shows the active page based on `route`. Starts on
`series`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`data-testid="nav-series" | "nav-series-detail" | "nav-reader" | "nav-add-part"` (labels
Series / Detail / Reader / Add Part). Clicking one calls `navigate`. The button for the
current route has `aria-current="page"`; the others must **not** have that attribute.

## Pages
### `app/series/page.tsx` — `data-testid="page-series"`
Lists all series. Each series renders via `SeriesCard` as
`<li data-testid="series-<id>">` containing the title, author, a `part-count-<id>` showing
how many parts it has, a `progress-<id>` showing the read percent (e.g. `67%`), and an
`open-<id>` button that calls `selectSeries(id)` then `navigate('series-detail')`.

### `app/series-detail/page.tsx` — `data-testid="page-series-detail"`
If no series is selected, render `<p data-testid="no-series">`. Otherwise show the selected
series title in `<h1 data-testid="detail-title">`, a `detail-progress` percent, and a
`<ul data-testid="part-list">` of its parts sorted by order. Each part renders via
`PartRow` as `<li data-testid="part-<id>" data-read="true|false">` with the order, title,
a `read-<id>` button (label "Mark read" / "Mark unread") that calls `toggleRead(id)`, and
an `open-reader-<id>` button that calls `markRead(id)` then `navigate('reader')` with that
part selected.

### `app/reader/page.tsx` — `data-testid="page-reader"`
If no series is selected, render `<p data-testid="no-series">`. Otherwise render the
series' parts (sorted) as a `<ul data-testid="reader-list">`; each item
`<li data-testid="reader-part-<id>" data-read="true|false">` shows the title, and the
count of read parts appears in `<p data-testid="reader-progress">` as `read X of Y`.

### `app/add-part/page.tsx` — `data-testid="page-add-part"`
`<form data-testid="add-part-form">` with `series-select` (one option per series, defaults
to the currently selected series or the first), `title-input`, and `submit-part`. On
submit: if the title is empty/whitespace, render `<p data-testid="form-error">` and stay.
Otherwise add the part to shared state, select that series, and `navigate('series-detail')`.

## Presentational components
- `components/SeriesCard.tsx` — one series row (see Series page).
- `components/PartRow.tsx` — one part row (see Detail page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()`
that re-seeds. This is independent of the client Context state.

### `app/api/series/route.ts`
Web `Request`/`Response` handlers; re-export `__reset` from the store. All JSON responses
set `content-type: application/json`.
- **GET** — `{ series: Series[], parts: Part[] }`. Optional `?seriesId=<id>` restricts
  `parts` to that series (sorted by order); `series` is always the full list.
- **POST** — body `{ seriesId, title }`. 201 with the created part (`read: false`, `order`
  one past that series' max). If `title` is missing/blank → 400 `{ error: "title required" }`.
  If `seriesId` is missing/unknown → 404 `{ error: "series not found" }`. New ids continue
  `x7`, `x8`, …
- **PUT** — `?id=<id>`. With body `{ read: boolean }` set it; with no `read` key, toggle.
  Returns the updated part. Unknown id → 404 `{ error: "not found" }`.
