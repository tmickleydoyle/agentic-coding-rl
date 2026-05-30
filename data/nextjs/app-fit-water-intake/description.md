# Water Intake app

Build a small multi-route water-intake tracking app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context, and an API route handler backed by
a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

## Types — `lib/types.ts`
- `Drink = { id: string; date: string; amount: number }`
- `DayTotal = { date: string; total: number }`
- `Route = 'today' | 'history' | 'goal' | 'settings'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/WaterProvider.tsx`
Context provider + `useWater()` hook that throws if used outside the provider. Exposes:
- `drinks: Drink[]`, `goal: number`, `reminders: number`, `theme`, `route`, `today: string`
- `addDrink({ amount, date? })` — appends a `Drink` (date defaults to `today`; fresh id
  `d4`, `d5`, …)
- `removeDrink(id)`, `setGoal(value)`, `setReminders(value)`, `setTheme`, `navigate`

Seed drinks: `d1` 2026-05-27 500, `d2` 2026-05-27 750, `d3` 2026-05-28 250. `goal` is `2000`,
`reminders` is `4`, `today` is `'2026-05-28'`. The first added drink gets id `d4`.

## Helper — `hooks/useIntake.ts`
- `totalFor(drinks, date)` — sum of amounts on a date.
- `percentOf(total, goal)` — `min(100, round(total/goal*100))` (0 when goal ≤ 0).
- `dayTotals(drinks)` — per-day totals, most-recent date first.
- `useIntake()` returns `{ todayDrinks, todayTotal, percent, remaining, met, totals }` where
  `remaining = max(0, goal - todayTotal)` and `met = todayTotal >= goal`.

For the seed: todayTotal `250`, percent `13`, remaining `1750`, met `false`; history totals
`[{2026-05-28: 250}, {2026-05-27: 1250}]`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<WaterProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-today | nav-history | nav-goal | nav-settings`.
Current route's button has `aria-current="page"`.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
`today-total`, `today-goal`, `today-percent`, `today-remaining`, `today-met` (`data-met`).
A `quick-add` block with `quick-250` and `quick-500` buttons (each adds that amount). A
`<form data-testid="add-form">` with `amount-input` and `submit-drink`: invalid/non-positive
→ `<p data-testid="form-error">` and stay; otherwise `addDrink`. Then today's `drink-list`
of `DrinkRow`s; empty → `<p data-testid="empty-state">`.

### `app/history/page.tsx` — `data-testid="page-history"`
`day-list` of per-day totals (most-recent first), each `<li data-testid="day-<date>"
data-met="true|false">` with `day-<date>-date` and `day-<date>-total`; empty → empty-state.

### `app/goal/page.tsx` — `data-testid="page-goal"`
`current-goal`, StatCards `stat-today-value`/`stat-percent-value`/`stat-remaining-value`, and
a `<form data-testid="goal-form">` with `goal-input` + `submit-goal` (non-positive → error).

### `app/settings/page.tsx` — `data-testid="page-settings"`
`reminders-count`, `reminders-inc`/`reminders-dec` buttons (dec floors at 0). `current-theme`
and a `theme-toggle` button that flips light/dark (reflected on `app-root`'s `data-theme`).

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.
- `components/DrinkRow.tsx` — `<li data-testid="drink-<id>">` with `drink-<id>-amount` and a
  `remove-<id>` button.

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/intake/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ drinks, goal, reminders }`. `?date=<date>` → `{ date, total }` for that date.
- **POST** — body `{ amount, date? }`. 201 with the drink. Bad amount → 400
  `{ error: "amount invalid" }`. Ids `d4`, …
- **PUT** — body `{ goal?, reminders? }` → `{ goal, reminders }`. Invalid goal → 400
  `{ error: "goal invalid" }`; invalid reminders → 400 `{ error: "reminders invalid" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
