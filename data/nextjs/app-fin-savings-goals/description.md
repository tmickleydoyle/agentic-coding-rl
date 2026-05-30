# Savings Goals app

Build a small multi-route app for tracking savings goals, contributions, percent progress,
and projected completion. Routing is **in-app** (React state — no `next` imports). Four
routes (one is a detail view of the selected goal), a shared Context, and two API route
handlers backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Goal = { id: string; name: string; target: number; saved: number; monthlyContribution:
  number }`
- `Contribution = { id: string; goalId: string; amount: number }`
- `Route = 'goals' | 'goal-detail' | 'add-goal' | 'settings'`
- `Theme = 'light' | 'dark'`
- `TODAY = '2026-05'` — fixed reference month so projected-completion math is deterministic.

## Shared state — `components/GoalsProvider.tsx`
A React Context provider plus a `useGoals()` hook that throws if used outside the provider.
Exposes:

- `goals: Goal[]`, `contributions: Contribution[]`, `theme: Theme`, `route: Route`,
  `selectedGoalId: string | null`
- `addGoal({ name, target, monthlyContribution })` — appends a new `Goal` with `saved: 0`
  (fresh id `g4`, `g5`, …)
- `removeGoal(id)` — drops the goal and its contributions
- `contribute(goalId, amount)` — appends a `Contribution` (fresh id `c4`, …) and increases
  that goal's `saved`
- `selectGoal(id)` — sets `selectedGoalId` and navigates to `goal-detail`
- `setTheme`, `navigate(route)`

Seed data (3 goals, 3 contributions):

| goal | id | target | saved | monthly |
|---|---|---|---|---|
| Emergency Fund | `g1` | 10000 | 4000 | 1000 |
| Vacation       | `g2` | 3000  | 3000 | 200  |
| New Laptop     | `g3` | 2000  | 500  | 250  |

| contribution | id | goal | amount |
|---|---|---|---|
| `c1` | `g1` | 1000 |
| `c2` | `g1` | 3000 |
| `c3` | `g3` | 500  |

The first added goal gets id `g4`; the first added contribution `c4`.

## Derived helpers — `hooks/useGoals.ts`
- `progressPercent(goal)` — `round(saved/target*100)`, capped at 100.
- `remainingAmount(goal)` — `max(0, target - saved)`.
- `isComplete(goal)` — `saved >= target`.
- `monthsToGoal(goal)` — 0 if complete, else `ceil(remaining/monthlyContribution)`
  (Infinity if the contribution is 0).
- `addMonths(yearMonth, months)` — add whole months to a `YYYY-MM` string.
- `projectedCompletion(goal, today=TODAY)` — `'Complete'` when done, `'Never'` when the
  contribution is 0, otherwise the `YYYY-MM` it will be reached.
- `totalsOf(goals)` → `{ totalTarget, totalSaved, completedCount, overallPercent }`.
- `useGoalsSummary()` returns `{ totals }` from context.

With the seed: totalSaved 7500, totalTarget 15000, completedCount 1 (Vacation),
overallPercent 50. g1 projected completion `2026-11`; g2 `Complete`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<GoalsProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`goals`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with buttons `nav-goals | nav-goal-detail | nav-add-goal |
nav-settings`. The current route's button has `aria-current="page"`; others must not.

## Pages
### `app/goals/page.tsx` — `data-testid="page-goals"`
`StatCard`s with value testids `stat-saved-value`, `stat-target-value`,
`stat-completed-value`, `stat-percent-value`. `<ul data-testid="goal-list">` of `GoalCard`s
(`<li data-testid="goal-<id>" data-complete="true|false">` with `goal-<id>-name`, `-saved`,
`-target`, `-percent` and a `select-<id>` button). `<p data-testid="empty-goals">` when none.

### `app/goal-detail/page.tsx` — `data-testid="page-goal-detail"`
For the selected goal: `detail-name`, `detail-saved`, `detail-target`, `detail-percent`,
`detail-remaining`, `detail-completion`, and a `detail-complete` marker when reached. A
`contribute-form` with `amount-input` and `submit-contribution` (empty/non-positive amount →
`<p data-testid="form-error">`); on success it contributes and the saved/percent update.
A `<ul data-testid="contribution-list">` of `<li data-testid="contribution-<id>">` with
`contribution-<id>-amount`. When no goal is selected, render `<p
data-testid="no-goal-selected">`.

### `app/add-goal/page.tsx` — `data-testid="page-add-goal"`
`<form data-testid="goal-form">` with `name-input`, `target-input`, `monthly-input` and
`submit-goal`. Validate: blank name or empty/non-positive target → `<p
data-testid="form-error">` and stay. Otherwise add the goal and `navigate('goals')`.

### `app/settings/page.tsx` — `data-testid="page-settings"`
`<p data-testid="current-theme">` and a `theme-toggle` button flipping light/dark (persists
on `app-root`'s `data-theme`).

## Presentational components
- `components/StatCard.tsx` — `{ label, value, testid }` → renders `stat-<testid>-value`.
- `components/GoalCard.tsx` — one goal row (see Goals page).

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids) plus a `__reset()`. Posting a
contribution also increases that goal's `saved`.

### `app/api/goals/route.ts`
- **GET** — `{ goals: Goal[] }`.
- **POST** — body `{ name, target, monthlyContribution? }`. 201 with the created goal
  (`g4`, …). Blank name → 400 `{ error: "name required" }`; non-positive target → 400
  `{ error: "target must be positive" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.

### `app/api/contributions/route.ts`
Re-export `__reset`. All JSON responses set `content-type: application/json`.
- **GET** — `{ contributions: Contribution[] }`. Optional `?goalId=<id>` filter.
- **POST** — body `{ goalId, amount }`. 201 with the created contribution (`c4`, …).
  Unknown goal → 400 `{ error: "invalid goal" }`; non-positive amount → 400
  `{ error: "amount must be positive" }`.
