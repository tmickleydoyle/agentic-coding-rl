> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Travel bucket list app

Build a small multi-route travel wishlist app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Destination = { id: string; name: string; country: string; continent: string; visited: boolean; notes: string }`
- `Route = 'list' | 'destination-detail' | 'add' | 'visited'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider + `useApp()` hook that throws if used outside the provider. It exposes:

- `destinations: Destination[]`, `theme: Theme`, `route: Route`,
  `continentFilter: string` (default `'all'`), `selectedId: string | null`
- `addDestination({ name, country, continent, notes? })` — appends a `Destination` with a
  fresh id like `d6`, `d7`, … (`visited: false`)
- `toggleVisited(id)` — flips `visited`
- `setContinentFilter`, `setTheme`, `navigate(route)`
- `selectDestination(id)` — sets `selectedId` and navigates to `destination-detail`

Seed: `d1` Kyoto/Japan/Asia/visited, `d2` Patagonia/Argentina/South America,
`d3` Reykjavik/Iceland/Europe, `d4` Cairo/Egypt/Africa/visited, `d5` Lisbon/Portugal/Europe.

## Helper — `hooks/useDestinations.ts`
Pure helpers `filterByContinent`, `groupByContinent` (sorted `{ continent, items }[]`),
`continents` (sorted unique), `visitedCount`. The hook returns `filtered`, `groups`,
`allContinents`, `visited`, `remaining`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<AppStateProvider>`. Root `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `list`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-list | nav-visited | nav-add | nav-destination-detail`.
Clicking calls `navigate`; the current route's button has `aria-current="page"`.

## Pages
### `app/list/page.tsx` — `data-testid="page-list"`
A `counts` block (`count-total` of filtered, `count-visited`, `count-remaining`), a
`continent-filter` select (`all` + one per continent), and `continent-groups` where each
`group-<continent>` has `group-<continent>-title`, `group-<continent>-count`, and
`group-<continent>-list` of `DestinationCard`s. Empty → `empty-state`.

### `app/destination-detail/page.tsx` — `data-testid="page-destination-detail"`
When `selectedId` is null, render `no-selection`. Otherwise `detail-name`,
`detail-country`, `detail-continent`, `detail-notes`, `detail-visited`
(visited/not visited), and a `detail-toggle` button.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-form">` with `name-input`, `country-input`, `continent-input`,
`notes-input`, `submit-destination`. Validate name and continent (non-empty) → `form-error`
and stay; else `addDestination(...)` and `navigate('list')`.

### `app/visited/page.tsx` — `data-testid="page-visited"`
A `visited-counts` block (`visited-count`, `remaining-count`) and a `visited-list` of
visited `DestinationCard`s (or `empty-state`). Also a `current-theme` + `theme-toggle`
reflected on `app-root`.

## Presentational components
- `components/DestinationCard.tsx` — `dest-<id>` with `data-visited` and
  `-name`/`-country`/`-continent` and `toggle-<id>` + `open-<id>` buttons.

## API — separate in-memory store
`lib/store.ts` holds its own seed destinations (same ids) + `__reset()`.

### `app/api/destinations/route.ts`
Web `Request`/`Response`; re-export `__reset`; JSON `content-type: application/json`.
- **GET** — `{ destinations: Destination[] }`. Optional `?continent=` and
  `?visited=true|false` filters (AND).
- **POST** — body `{ name, continent, country?, notes? }`. 201 with the created destination
  (`d6`, `d7`, …, `visited: false`). Blank `name` → 400 `{ error: "name required" }`; blank
  `continent` → 400 `{ error: "continent required" }`.
- **PUT** — `?id=<id>`. With body `{ visited: boolean }` set it; with no `visited` key,
  toggle. Returns the updated destination. Unknown id → 404 `{ error: "not found" }`.
