# Travel Itinerary Planner

Build a small multi-route travel itinerary app. Routing is **in-app** (React state — no
`next` imports anywhere). The app has four routes, a shared Context holding all
cross-route state, and an API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Activity = { id: string; tripId: string; day: number; title: string; cost: number }`
- `Trip = { id: string; name: string; destination: string; days: number }`
- `Route = 'trips' | 'trip-detail' | 'add-activity' | 'budget'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/ItineraryProvider.tsx`
A React Context provider plus a `useItinerary()` hook that throws if used outside the
provider. It exposes:

- `trips: Trip[]`, `activities: Activity[]`, `theme: Theme`, `route: Route`,
  `selectedTripId: string | null`
- `addActivity({ tripId, day, title, cost })` — appends a new `Activity` (fresh id `a5`,
  `a6`, …)
- `removeActivity(id)` — drops the activity
- `moveActivityUp(id)` / `moveActivityDown(id)` — reorder an activity **within its own
  trip+day group** (swap with the neighbor in that group; preserve everyone else's order).
  No-op at the group edge.
- `selectTrip(id)` — sets `selectedTripId` and navigates to `trip-detail`
- `setTheme`, `navigate(route)`

Seed data (2 trips, 4 activities):

| trip | id | destination | days |
|---|---|---|---|
| Japan Spring | `tr1` | Tokyo | 3 |
| Italy Tour | `tr2` | Rome | 2 |

| activity | id | trip | day | cost |
|---|---|---|---|---|
| Shibuya walk | `a1` | `tr1` | 1 | 0 |
| Sushi dinner | `a2` | `tr1` | 1 | 60 |
| Mt Fuji tour | `a3` | `tr1` | 2 | 120 |
| Colosseum | `a4` | `tr2` | 1 | 25 |

The first added activity gets id `a5`.

## Helper — `hooks/useItineraryData.ts`
Pure helpers `tripTotal(activities, tripId)` (sum of costs) and `groupByDay(activities,
tripId, days)` returning `{ day, activities, cost }[]` for days `1..days`. A
`useTripDetail(tripId)` hook returns `{ trip, groups, total }`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<ItineraryProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` showing
the active page. Starts on `trips`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons:
`nav-trips | nav-trip-detail | nav-add-activity | nav-budget`. Clicking navigates. The
current route's button has `aria-current="page"`; others must not.

## Pages
### `app/trips/page.tsx` — `data-testid="page-trips"`
List trips. Each row `trip-<id>` shows `trip-<id>-name`, `trip-<id>-destination`,
`trip-<id>-cost` (total cost via `tripTotal`), and an `open-<id>` button that calls
`selectTrip`. Empty list → `empty-state`.

### `app/trip-detail/page.tsx` — `data-testid="page-trip-detail"`
If no trip is selected, render `no-trip` and a `back-to-trips` button. Otherwise show
`detail-name`, `detail-total` (total cost), and one block per day `1..days` as
`day-<n>` containing `day-<n>-label`, `day-<n>-cost`, and either a `day-<n>-list` `<ul>`
of activities or `day-<n>-empty`. Each activity renders via `ActivityItem` as
`<li data-testid="activity-<id>">` with `activity-<id>-title`, `activity-<id>-cost`, an
`up-<id>` button (disabled when first in its day group), a `down-<id>` button (disabled
when last), and a `remove-<id>` button. Also an `add-activity-link` button → navigate to
`add-activity`.

### `app/add-activity/page.tsx` — `data-testid="page-add-activity"`
`<form data-testid="add-activity-form">` with `trip-select` (defaults to `selectedTripId`
or the first trip), `day-input` (number), `title-input`, `cost-input` (number), and
`submit-activity`. On submit: blank title → `form-error`, stay on the page. Otherwise add
the activity and `navigate('trip-detail')`.

### `app/budget/page.tsx` — `data-testid="page-budget"`
StatCards `stat-trips-value`, `stat-activities-value`, `stat-grand-total-value` (sum of all
activity costs). Then a `trip-budgets` list: per trip a `budget-<id>-cost`.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/ActivityItem.tsx` — one activity row (see Detail page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus `__reset()`. Independent of
the client Context state.

### `app/api/trips/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — no params → `{ trips }` where each trip includes a `cost` field. With
  `?tripId=<id>` → `{ trip, activities, cost }`, or 404 `{ error: "not found" }` for an
  unknown id.
- **POST** — if the body has a `tripId` string, create an **activity** for that trip from
  `{ tripId, day?, title, cost? }`: 404 if the trip is missing, 400 `{ error: "title
  required" }` if title blank, else 201 with the activity (ids `a5`, `a6`, …). Otherwise
  create a **trip** from `{ name, destination?, days? }`: 400 `{ error: "name required" }`
  if blank, else 201 with the trip (ids `tr3`, `tr4`, …).
- **DELETE** — `?activityId=<id>`. 200 `{ ok: true }`, or 404 `{ error: "not found" }`.
