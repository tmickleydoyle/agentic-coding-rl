> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Subscription Tracker app

Build a small multi-route app for tracking recurring subscriptions, their normalized monthly
cost, and renewals due soon. Routing is **in-app** (React state — no `next` imports). Four
routes, a shared Context, and one API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Cycle = 'monthly' | 'annual'`
- `Subscription = { id: string; name: string; cost: number; cycle: Cycle; nextRenewal:
  string; active: boolean }`
- `Route = 'dashboard' | 'subscriptions' | 'add' | 'upcoming'`
- `Theme = 'light' | 'dark'`
- `TODAY = '2026-05-29'` and `DUE_SOON_DAYS = 14` — fixed constants so date math is
  deterministic in tests.

## Shared state — `components/SubsProvider.tsx`
A React Context provider plus a `useSubs()` hook that throws if used outside the provider.
Exposes:

- `subscriptions: Subscription[]`, `theme: Theme`, `route: Route`
- `addSubscription({ name, cost, cycle, nextRenewal })` — appends a new active `Subscription`
  (fresh id `s5`, `s6`, …)
- `cancelSubscription(id)` — sets `active: false` (keeps the row)
- `removeSubscription(id)` — drops the row entirely
- `setTheme`, `navigate(route)`

Seed data (4 subscriptions):

| name | id | cost | cycle | nextRenewal | active |
|---|---|---|---|---|---|
| Netflix      | `s1` | 15  | monthly | 2026-06-05 | true  |
| Spotify      | `s2` | 10  | monthly | 2026-06-20 | true  |
| Amazon Prime | `s3` | 120 | annual  | 2026-06-02 | true  |
| Old Gym      | `s4` | 30  | monthly | 2026-06-01 | false |

The first added subscription gets id `s5`.

## Derived helpers — `hooks/useSubs.ts`
- `monthlyCost(sub)` — `cost` for monthly, `cost / 12` for annual.
- `daysUntil(dateIso, today=TODAY)` — whole days between today and the date.
- `isDueSoon(sub)` — active and `0 <= daysUntil(nextRenewal) <= DUE_SOON_DAYS`.
- `summarize(subs)` → `{ monthlyTotal, annualTotal, activeCount, dueSoonCount }` over the
  **active** subscriptions (`annualTotal = monthlyTotal * 12`).
- `upcomingRenewals(subs)` → active, due-soon subs sorted by days until renewal ascending.
- `useSubsSummary()` returns `{ summary, upcoming }` from context.

With the seed: monthlyTotal = 15 + 10 + 10 = 35, annualTotal = 420, activeCount = 3,
dueSoonCount = 2 (Netflix in 7 days, Amazon Prime in 4). Upcoming order: Amazon Prime, Netflix.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<SubsProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`dashboard`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with buttons `nav-dashboard | nav-subscriptions | nav-add |
nav-upcoming`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/dashboard/page.tsx` — `data-testid="page-dashboard"`
`StatCard`s with value testids `stat-monthly-value`, `stat-annual-value`,
`stat-active-value`, `stat-duesoon-value`. Also `<p data-testid="current-theme">` and a
`theme-toggle` button flipping light/dark (persists on `app-root`'s `data-theme`).

### `app/subscriptions/page.tsx` — `data-testid="page-subscriptions"`
An `active-only` checkbox that, when checked, hides cancelled subs. `<ul
data-testid="sub-list">` of `<li data-testid="sub-<id>" data-active="true|false">` with
`sub-<id>-name`, `-cycle`, `-cost`, `-monthly` (normalized), `-renewal`, and either a
`cancel-<id>` button (active) or a `sub-<id>-cancelled` marker (cancelled). `<p
data-testid="empty-subscriptions">` when the visible list is empty.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="sub-form">` with `name-input`, `cost-input`, `cycle-select`
(monthly/annual), `renewal-input` (type date) and `submit-sub`. On submit validate: blank
name, empty/non-positive cost, or blank renewal → `<p data-testid="form-error">` and stay.
Otherwise add the subscription and `navigate('subscriptions')`.

### `app/upcoming/page.tsx` — `data-testid="page-upcoming"`
`<ul data-testid="upcoming-list">` of `<li data-testid="upcoming-<id>">` (due-soon, sorted by
days ascending) with `upcoming-<id>-name`, `-renewal`, `-days`. `<p
data-testid="empty-upcoming">` when nothing is due soon.

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/SubItem.tsx` — one subscription row (see Subscriptions page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`.

### `app/api/subscriptions/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ subscriptions: Subscription[] }`. Optional `?active=true|false` filter.
- **POST** — body `{ name, cost, cycle, nextRenewal }`. 201 with the created subscription
  (`s5`, …). Blank name → 400 `{ error: "name required" }`; non-positive cost → 400
  `{ error: "cost must be positive" }`; blank nextRenewal → 400
  `{ error: "nextRenewal required" }`. Unknown cycle defaults to `monthly`.
- **PUT** — `?id=<id>`. Cancels (sets `active: false`) and returns the updated sub. Unknown
  id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
