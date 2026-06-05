> Build this entire application **from scratch** in `app/page.tsx` plus any `components/`, `hooks/`, `lib/`, and `app/api/*/route.ts` files it needs. Use only `react` and `react-dom` (no Next.js APIs; routing is in-app state). The starter is an empty page.

# Recipe Book app

Build a small multi-route recipe app. Routing is **in-app** (React state — no `next`
imports anywhere). Four routes, a shared Context holding all cross-route state, and one API
route handler backed by a separate in-memory store.

Use only `react` + `react-dom`. strict TypeScript. The tsconfig `lib` is `["ES2022","DOM"]`
(no `DOM.Iterable`), so do **not** `for...of` over Map/Set iterators — use `.forEach`,
`Array.from`, or index loops.

## Types — `lib/types.ts`
- `Recipe = { id: string; title: string; cuisine: string; minutes: number; ingredients: string[]; steps: string[]; favorite: boolean }`
- `CuisineFilter = 'all' | string`
- `Route = 'recipes' | 'recipe-detail' | 'add' | 'favorites'`
- `Theme = 'light' | 'dark'`

## Shared state — `components/AppStateProvider.tsx`
A React Context provider holding the whole client state, plus a `useRecipes()` hook that
throws if used outside the provider. It exposes:

- `recipes: Recipe[]`, `theme: Theme`, `route: Route`, `selectedId: string | null`
- `cuisineFilter: CuisineFilter`, `query: string`
- `addRecipe({ title, cuisine, minutes, ingredients, steps })` — appends a `Recipe`
  (`favorite: false`, fresh id like `r5`, `r6`, …)
- `toggleFavorite(id)` — flips `favorite`
- `selectRecipe(id)` — sets `selectedId` and navigates to `recipe-detail`
- `setCuisineFilter`, `setQuery`, `setTheme`, `navigate(route)`

Seed data (4 recipes):

| recipe | id | cuisine | minutes | favorite |
|---|---|---|---|---|
| Margherita Pizza | `r1` | Italian | 30 | false |
| Chicken Tacos    | `r2` | Mexican | 25 | true  |
| Pad Thai         | `r3` | Thai    | 40 | false |
| Spaghetti Carbonara | `r4` | Italian | 20 | false |

The first added recipe gets id `r5`.

## Optional helper — `hooks/useRecipeViews.ts`
Derived selectors over shared state: `cuisines` (sorted unique cuisine list), `filtered`
(recipes matching the current cuisine filter AND case-insensitive title query), and
`favorites` (recipes where `favorite` is true). Pure helpers `filterRecipes` and
`uniqueCuisines` are convenient but not required by name.

## Routing shell — `app/page.tsx` (entry, default export `App`)
Wraps everything in `<AppStateProvider>`. Renders `<div data-testid="app-root"
data-theme={theme}>` containing `<NavBar/>` and `<main data-testid="page-content">` showing
the active page. Starts on `recipes`.

## NavBar — `components/NavBar.tsx`
`<nav data-testid="navbar">` with four buttons: `nav-recipes | nav-recipe-detail | nav-add
| nav-favorites` (labels Recipes / Detail / Add / Favorites). Clicking calls `navigate`. The
current route's button has `aria-current="page"`; others must not. Show a
`data-testid="fav-badge"` with the count of favorited recipes.

## Pages
### `app/recipes/page.tsx` — `data-testid="page-recipes"`
A search input `data-testid="search-input"` (bound to `query`), a `<Filters>` cuisine
select, then the list. Each recipe renders `<li data-testid="recipe-<id>">` with a
`recipe-<id>-title`, `recipe-<id>-cuisine`, a `view-<id>` button (calls `selectRecipe`), and
a `fav-<id>` button (calls `toggleFavorite`). The `<li>` has `data-favorite="true|false"`.
When nothing matches, render `<p data-testid="empty-state">` and **no** `recipe-list`.
Otherwise wrap rows in `<ul data-testid="recipe-list">`.

### `app/recipe-detail/page.tsx` — `data-testid="page-recipe-detail"`
Shows the selected recipe. If `selectedId` is null or unknown render
`<p data-testid="no-selection">`. Otherwise show `detail-title`, `detail-cuisine`,
`detail-minutes`, a `<ul data-testid="ingredient-list">` of `ingredient-<i>` items, a
`<ol data-testid="step-list">` of `step-<i>` items, and a `detail-fav-toggle` button.

### `app/add/page.tsx` — `data-testid="page-add"`
`<form data-testid="add-recipe-form">` with `title-input`, `cuisine-input`,
`minutes-input` (type number), `ingredients-input` and `steps-input` (textareas, one item
per line), and `submit-recipe`. On submit: if the title is empty/whitespace, render
`<p data-testid="form-error">` and stay. Otherwise split ingredients/steps by newline
(dropping blank lines), add the recipe, and `navigate('recipes')`.

### `app/favorites/page.tsx` — `data-testid="page-favorites"`
Lists only favorited recipes as `<li data-testid="fav-recipe-<id>">` (title + an
`unfav-<id>` button that toggles favorite). When none, render
`<p data-testid="no-favorites">`.

## Presentational components
- `components/RecipeCard.tsx` — one recipe row on the recipes page (see above).
- `components/Filters.tsx` — a `cuisine-filter` `<select>` with an `all` → "All cuisines"
  option plus one per cuisine.

## API — separate in-memory store
`lib/store.ts` holds its **own** seed data (same shape/ids as above) plus a `__reset()` that
re-seeds. Independent of the client Context state.

### `app/api/recipes/route.ts`
Web `Request`/`Response` handlers; re-export `__reset`. All JSON responses set
`content-type: application/json`.
- **GET** — `{ recipes: Recipe[] }`. Optional `?cuisine=<name>` and `?favorite=true|false`
  filters (combine with AND).
- **POST** — body `{ title, cuisine?, minutes?, ingredients?, steps? }`. 201 with the
  created recipe. Missing/blank `title` → 400 `{ error: "title required" }`. New ids
  continue `r5`, `r6`, …
- **PUT** — `?id=<id>`. With body `{ favorite: boolean }` set it; with no `favorite` key,
  toggle. Returns the updated recipe. Unknown id → 404 `{ error: "not found" }`.
- **DELETE** — `?id=<id>`. 200 `{ ok: true }`. Unknown id → 404 `{ error: "not found" }`.
