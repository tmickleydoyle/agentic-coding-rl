> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Event Calendar app

Build a small multi-route calendar app for a single fixed month (**July 2026**, 31 days,
the 1st falls on a Wednesday → weekday index 3 with Sunday = 0). Routing is **in-app** (React
state — no `next` imports anywhere). Four routes, a shared Context holding all cross-route
state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `EventItem = { id: string; title: string; day: number; category: string }`
- `Route = 'month' | 'event-detail' | 'create' | 'categories'`
- `Theme = 'light' | 'dark'`
- `DAYS_IN_MONTH = 31`, `FIRST_WEEKDAY = 3` (Wed), `CATEGORIES = ['work','social','personal']`.

`day` is a 1-based day number in `1..31`.

## Shared state — `components/AppStateProvider.tsx`
A React Context provider plus a `useApp()` hook that throws if used outside the provider.
It exposes:

- `events: EventItem[]`, `theme: Theme`, `route: Route`, `filter: string` (a category or
  `'all'`), `selectedDay: number | null`
- `selectDay(day)` — sets `selectedDay` and navigates to `event-detail`.
- `setFilter(category)` — sets the active category filter.
- `visibleEvents` — events matching the current `filter` (`'all'` shows everything).
- `eventsOn(day)` — visible events for a given day (respects the filter).
- `addEvent(title, day, category)` — appends an `EventItem` with a fresh id (`v4`, `v5`, …)
  **only if** `title` is non-blank and `day` is an integer in `1..31`. Returns the new id, or
  `null`.
- `setTheme`, `navigate(route)`

Seed data (3 events):

| event | id | day | category |
|---|---|---|---|
| Standup | `v1` | 2 | work |
| Lunch | `v2` | 2 | social |
| Gym | `v3` | 15 | personal |

The first added event gets id `v4`. Day 2 has two events (one work, one social).

## Optional helper — `hooks/useCalendar.ts`
Derived selectors: `cells` (an array of `number | null` for the month grid — `FIRST_WEEKDAY`
leading `null`s, then `1..DAYS_IN_MONTH`), `countByCategory` (a record category→count over
**all** events), and `categories` (the `CATEGORIES` list). Pure helper `buildCells(firstWeekday,
daysInMonth)`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">` showing the
active page. Starts on `month`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `data-testid="nav-month" |
"nav-event-detail" | "nav-create" | "nav-categories"` (labels Month / Day / Create /
Categories). Clicking calls `navigate`. The current route's button has `aria-current="page"`;
others must **not**.

## Pages
### `app/month/page.tsx` — `data-testid="page-month"`
A `category-filter` select with options `all` plus each `CATEGORIES` value. The grid is
`<div data-testid="month-grid">` containing one cell per entry of `cells`: blank leading cells
are `<div data-testid="cell-blank-<index>">` and day cells are
`<button data-testid="day-<n>">` that call `selectDay(n)`. Each day cell shows
`<span data-testid="day-<n>-count">` = the number of **visible** (filtered) events on that day.

### `app/event-detail/page.tsx` — `data-testid="page-event-detail"`
If `selectedDay` is null, render `<p data-testid="no-day">`. Otherwise show
`<h1 data-testid="day-heading">` containing the day number, and the visible events on that day
as `<li data-testid="event-<id>">` with `event-<id>-title` and `event-<id>-category`, wrapped
in `<ul data-testid="day-events">`. If there are none, render `<p data-testid="no-events">`.

### `app/create/page.tsx` — `data-testid="page-create"`
A `<form data-testid="create-form">` with `title-input`, `day-input` (number), a
`category-select` (one option per `CATEGORIES`), and `submit-create`. On submit: if title is
blank or the day is out of `1..31`, render `<p data-testid="form-error">` and stay; otherwise
call `addEvent(...)` and navigate to `month`.

### `app/categories/page.tsx` — `data-testid="page-categories"`
Lists each category as `<li data-testid="cat-<category>">` with `cat-<category>-count` (the
number of events in that category across all events).

## Presentational components
- `components/DayCell.tsx` — `{ day, count, onSelect }` → a `day-<n>` button.
- `components/EventRow.tsx` — one event row for the day detail.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`. Independent of
the client Context state.

### `app/api/events/route.ts`
Web `Request`/`Response`. re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ events: EventItem[] }`. Optional `?category=<c>` and `?day=<n>` filters
  (combine with AND).
- **POST** — body `{ title, day, category }`. 201 with the created event (ids continue `v4`,
  `v5`, …). If `title` is blank or `category` is blank → 400 `{ error: "invalid event" }`.
  If `day` is not an integer in `1..31` → 422 `{ error: "bad day" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
