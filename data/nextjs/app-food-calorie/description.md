# Calorie tracker app

Build a small multi-route calorie-tracking app. Routing is **in-app** (React state — no
`next` imports anywhere). Four routes, a shared Context holding cross-route state, and an
API route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is
`["ES2022","DOM"]` (no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators —
use `.forEach`, `Array.from`, or index loops.

## Types — `lib/types.ts`
- `Meal = { id: string; name: string; date: string; calories: number; protein: number; carbs: number; fat: number }`
- `Goal = { calories: number; protein: number; carbs: number; fat: number }`
- `Route = 'today' | 'history' | 'add-meal' | 'goals'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A Context provider holding the client app state, plus a `useApp()` hook that throws if used
outside the provider. Export `TODAY = '2026-05-29'`. It exposes:

- `meals: Meal[]`, `goal: Goal`, `theme: Theme`, `route: Route`, `today: string`
- `addMeal({ name, date?, calories, protein?, carbs?, fat? })` — appends a `Meal` with a
  fresh id like `m4`, `m5`, … (date defaults to `today`, macros default to 0)
- `removeMeal(id)` — drops the meal
- `setGoal`, `setTheme`, `navigate(route)`

Seed meals: `m1` Oatmeal (2026-05-29, 320 cal, 12p/54c/6f), `m2` Chicken salad
(2026-05-29, 450 cal, 38p/20c/22f), `m3` Apple (2026-05-28, 95 cal, 0p/25c/0f). The first
added meal gets id `m4`. Seed goal: `{ calories: 2000, protein: 120, carbs: 250, fat: 65 }`.

## Helper — `hooks/useNutrition.ts`
Derived selectors: `todayMeals` (meals on `today`), `todayTotals` (summed macros/calories),
`remaining` (goal.calories − today calories), `days` (meals grouped by date, newest first).
Pure helpers `sumMeals`, `mealsForDate`, `groupByDate`.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Root element
`<div data-testid="app-root" data-theme={theme}>` with `<NavBar/>` and
`<main data-testid="page-content">`. Starts on `today`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons
`nav-today | nav-history | nav-add-meal | nav-goals`. Clicking calls `navigate`; the current
route's button has `aria-current="page"`, others must not.

## Pages
### `app/today/page.tsx` — `data-testid="page-today"`
Today's totals vs goal: `calorie-total-value`, `calorie-goal-value`,
`calorie-remaining-value`, and `calorie-status` (`data-ontrack` true when remaining ≥ 0,
text on-track/over). Macro bars (`MacroBar`) for protein/carbs/fat. Then today's meals as a
`meal-list` of `MealItem`s with a `remove-<id>` button, or `empty-state` when none.

### `app/history/page.tsx` — `data-testid="page-history"`
A `day-list` grouped by date (newest first). Each `day-<date>` shows `day-<date>-date`,
`day-<date>-calories` (day total) and `day-<date>-count`, plus the day's meals.

### `app/add-meal/page.tsx` — `data-testid="page-add-meal"`
`<form data-testid="add-meal-form">` with `name-input`, `calories-input`, `protein-input`,
`carbs-input`, `fat-input`, `submit-meal`. On submit validate name (non-empty) and calories
(non-negative number) → `form-error` and stay; else `addMeal(...)` and `navigate('today')`.

### `app/goals/page.tsx` — `data-testid="page-goals"`
`current-goal-calories` shows the goal. `goals-form` with `goal-calories-input`,
`goal-protein-input`, `goal-carbs-input`, `goal-fat-input`, `save-goal`; saving updates the
goal in context (`saved-msg`). Also a `current-theme` + `theme-toggle` reflected on
`app-root`'s `data-theme`.

## Presentational components
- `components/MacroBar.tsx` — `{ label, value, goal, testid }` → `macro-<testid>` with
  `-value`/`-goal` and `data-ontrack` (value ≤ goal).
- `components/MealItem.tsx` — one meal row with name/calories/macros and an optional
  `onRemove`.

## API — separate in-memory store
`lib/store.ts` holds its own seed meals (same ids) + `__reset()` re-seed. Independent of the
client Context.

### `app/api/meals/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. JSON responses set
`content-type: application/json`.
- **GET** — `{ meals: Meal[] }`. Optional `?date=<YYYY-MM-DD>` filter.
- **POST** — body `{ name, calories, date?, protein?, carbs?, fat? }`. 201 with the created
  meal. Blank `name` → 400 `{ error: "name required" }`. Missing/negative `calories` → 400
  `{ error: "calories required" }`. New ids continue `m4`, `m5`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
