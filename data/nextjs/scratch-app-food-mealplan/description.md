> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Weekly Meal Planner app

Build a small multi-route meal-planning app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding all cross-route state, and one API
route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Recipe = { id: string; title: string; ingredients: string[] }`
- `Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'`
- `Assignment = { id: string; day: Day; recipeId: string }`
- `GroceryItem = { name: string; count: number }`
- `Route = 'week' | 'day-detail' | 'recipes' | 'grocery'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client state, plus a `usePlan()` hook that throws
if used outside the provider. It exposes:

- `recipes: Recipe[]`, `assignments: Assignment[]`, `theme: Theme`, `route: Route`
- `selectedDay: Day` (defaults to `'Mon'`)
- `assign(day, recipeId)` — appends an `Assignment` (fresh id like `a3`, `a4`, …)
- `unassign(id)` — drops that assignment
- `selectDay(day)` — sets `selectedDay` and navigates to `day-detail`
- `setTheme`, `navigate(route)`

The 7 days are fixed (`DAYS` constant in order Mon..Sun).

Seed recipes (3):

| recipe | id | ingredients |
|---|---|---|
| Oatmeal     | `r1` | oats, milk, honey |
| Veggie Stir Fry | `r2` | rice, broccoli, soy sauce, garlic |
| Caesar Salad | `r3` | lettuce, croutons, parmesan, garlic |

Seed assignments (2):

| id | day | recipe |
|---|---|---|
| `a1` | Mon | `r1` (Oatmeal) |
| `a2` | Mon | `r2` (Veggie Stir Fry) |

The first added assignment gets id `a3`.

## Optional helper — `hooks/usePlanViews.ts`
Derived selectors: `assignmentsFor(day)` (assignments on a given day), `mealCount(day)`
(number of meals planned that day), and `grocery` (rolled-up `GroceryItem[]` across **all**
assignments — each assigned recipe contributes its ingredients; duplicates increment
`count`; sorted by name). Pure helper `rollupGrocery(recipes, assignments)` is convenient but
not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` with `<NavBar/>` and `<main data-testid="page-content">`. Starts on
`week`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-week | nav-day-detail | nav-recipes |
nav-grocery` (labels Week / Day / Recipes / Grocery). Clicking calls `navigate`. The current
route's button has `aria-current="page"`; others must not.

## Pages
### `app/week/page.tsx` — `data-testid="page-week"`
A grid with one cell per day: `<div data-testid="day-<Day>">` containing a
`day-<Day>-count` showing the meal count and an `open-<Day>` button that calls `selectDay`.

### `app/day-detail/page.tsx` — `data-testid="page-day-detail"`
Shows the `selectedDay` (`<h2 data-testid="day-title">`). Lists that day's assignments as
`<li data-testid="assignment-<id>">` with the recipe title and a `remove-<id>` button
(calls `unassign`). When the day has no meals, render `<p data-testid="day-empty">`. Also a
recipe `<select data-testid="assign-select">` (one option per recipe) and an
`assign-button` that assigns the chosen recipe to the selected day.

### `app/recipes/page.tsx` — `data-testid="page-recipes"`
Lists all recipes as `<li data-testid="recipe-<id>">` with the title and an
`ingredient-count-<id>` showing how many ingredients it has.

### `app/grocery/page.tsx` — `data-testid="page-grocery"`
Renders the rolled-up grocery list as `<li data-testid="grocery-<name>">` showing the name
and a `grocery-<name>-count`. When there are no assignments, render
`<p data-testid="grocery-empty">`.

## Presentational components
- `components/DayCell.tsx` — one day cell on the week grid.
- `components/AssignmentRow.tsx` — one assignment row on the day-detail page.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same recipes/assignments/ids as above) plus a
`__reset()` that re-seeds. Independent of the client Context state.

### `app/api/meals/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ assignments: Assignment[] }`. Optional `?day=<Day>` filter.
- **POST** — body `{ day, recipeId }`. 201 with the created assignment. Missing/blank `day`
  → 400 `{ error: "day required" }`. Missing/blank `recipeId` → 400
  `{ error: "recipeId required" }`. New ids continue `a3`, `a4`, …
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
