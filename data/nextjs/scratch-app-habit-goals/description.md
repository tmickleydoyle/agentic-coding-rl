> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Habit Goals app

Build a small multi-route goal-tracking app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context, and an API route handler backed by a
separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`) — no `for...of` over Map/Set iterators; use `.forEach`/`Array.from`/index.

A fixed `TODAY = '2026-05-28'` constant is used (no real clock).

## Types — `lib/types.ts`
- `Milestone = { id: string; title: string; done: boolean }`
- `Goal = { id: string; name: string; targetDate: string; milestones: Milestone[] }`
- `Route = 'goals' | 'goal-detail' | 'add' | 'completed'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/GoalProvider.tsx`
Context provider + `useGoals()` hook that throws if used outside the provider. Exposes:
- `goals: Goal[]`, `theme`, `route`, `today: string`, `selectedId: string | null`
- `selectGoal(id)` — set `selectedId` and navigate to `goal-detail`.
- `toggleMilestone(goalId, milestoneId)` — flip that milestone's `done`.
- `addGoal({ name, targetDate })` — append a goal (fresh id `g3`, `g4`, …) with a single
  seeded milestone `{ id: '<goalId>-m1', title: 'Get started', done: false }`. Blank name or
  blank targetDate is ignored.
- `removeGoal(id)`, `setTheme`, `navigate`

Seed goals (`today` is `'2026-05-28'`):
- `g1` "Run a 5K" target `2026-06-30`, milestones:
  `g1-m1` "Buy shoes" done, `g1-m2` "Run 1K" done, `g1-m3` "Run 3K" not done, `g1-m4`
  "Run 5K" not done. (2/4 → 50%)
- `g2` "Read 12 books" target `2026-12-31`, milestones:
  `g2-m1` "Pick list" done, `g2-m2` "Read 6" done, `g2-m3` "Read 12" done. (3/3 → 100%,
  **completed**)
The first newly-created goal gets id `g3`.

## Helper — `hooks/useGoalProgress.ts`
- `progressOf(goal)` — percent of milestones done, rounded; 0 if a goal has no milestones.
- `isComplete(goal)` — has milestones AND all are done.
- `daysLeft(goal, today)` — whole days from `today` to `targetDate` (can be negative if past).
- `useGoalProgress()` returns `{ active, completed, overallProgress }` where `active` are
  goals not complete, `completed` are complete goals, and `overallProgress` is the rounded
  average of every goal's `progressOf` (0 if no goals).

For the seed: g1 progress 50, g2 progress 100 (complete). `active` = [g1],
`completed` = [g2], `overallProgress` 75. `daysLeft(g1)` = 33.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps in `<GoalProvider>`. Renders `<div data-testid="app-root" data-theme={theme}>` with
`<NavBar/>` and `<main data-testid="page-content">`. Starts on `goals`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with `nav-goals | nav-goal-detail | nav-add | nav-completed`.
Current route's button has `aria-current="page"`.

## Pages
### `app/goals/page.tsx` — `data-testid="page-goals"`
`goal-list` of `GoalCard`s for **active** goals; each card shows name, progress, and a
`view-<id>` button (calls `selectGoal`). Empty active → `<p data-testid="empty-state">`.

### `app/goal-detail/page.tsx` — `data-testid="page-goal-detail"`
If no goal selected → `<p data-testid="no-selection">`. Otherwise show `detail-name`,
`detail-progress`, `detail-days-left`, and a `milestone-list` of `<li data-testid="ms-<id>"
data-done>` each with a `toggle-ms-<id>` button.

### `app/add/page.tsx` — `data-testid="page-add"`
A `<form data-testid="add-form">` with `name-input`, `date-input`, and `submit-goal`. Blank
name or date → `<p data-testid="form-error">` and stay; otherwise `addGoal`, clear, navigate
to `goals`.

### `app/completed/page.tsx` — `data-testid="page-completed"`
`completed-list` of completed goal names (`completed-<id>`); count in `completed-count`.
Empty → `<p data-testid="empty-state">`.

## Presentational components
- `components/GoalCard.tsx` — `<li data-testid="goal-<id>">` with `goal-<id>-name`,
  `goal-<id>-progress`, and a `view-<id>` button.
- `components/StatBadge.tsx` — `{ label, value, testid }` → `stat-<testid>-value`.

## API — separate in-memory store (`lib/store.ts` with `__reset()`)
### `app/api/goals/route.ts`
Web `Request`/`Response`; re-export `__reset`. JSON sets `content-type: application/json`.
- **GET** — `{ goals }`.
- **POST** — body `{ name, targetDate }`. 201 with the new goal (id `g3`, …, one seeded
  milestone `<id>-m1`). Blank name → 400 `{ error: "name required" }`. Blank targetDate →
  400 `{ error: "targetDate required" }`.
- **PUT** — body `{ goalId, milestoneId }`. Toggle that milestone. 200 with the goal.
  Unknown goal → 404 `{ error: "goal not found" }`. Unknown milestone → 404
  `{ error: "milestone not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
