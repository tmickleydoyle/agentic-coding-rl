# Meal Planner App

A multi-route meal planner for managing recipes, planning weekly meals, and generating shopping lists.

## Routes
- **Home** (`/`): Shows total recipes, planned meals this week, and a "Plan This Week" button.
- **Recipes** (`/recipes`): CRUD for recipes. Each recipe: id, name, ingredients (string[]), servings (number), prepMinutes, tags (string[]).
- **Planner** (`/planner`): Assign recipes to days of the week (Mon-Sun). Each plan entry: id, day ("Mon"|"Tue"|"Wed"|"Thu"|"Fri"|"Sat"|"Sun"), recipeId, mealType ("breakfast"|"lunch"|"dinner"). Can remove planned meals.
- **Shopping** (`/shopping`): Auto-generates a combined shopping list from all planned meals' ingredients (deduplicated). Can also add custom items to the list and check/uncheck items.

## Seed Data
Recipes: `[{ id: "rc1", name: "Oatmeal", ingredients: ["oats", "milk", "honey"], servings: 1, prepMinutes: 5, tags: ["breakfast"] }, { id: "rc2", name: "Pasta", ingredients: ["pasta", "tomato sauce", "cheese"], servings: 2, prepMinutes: 20, tags: ["dinner"] }]`

## Behaviors
- Adding a recipe requires non-empty name and at least one ingredient.
- Planner: one recipe per (day, mealType) slot — adding to same slot replaces existing.
- Shopping list: collect all ingredients from planned recipes, deduplicate by string equality.
- Custom shopping items can be added and toggled (checked/unchecked).
- Deleting a recipe also removes it from the planner.

## API
`GET /api/recipes` → returns `{ recipes: Recipe[] }`
`POST /api/recipes` body `{ name, ingredients, servings, prepMinutes, tags }` → returns `{ recipe: Recipe }`
`DELETE /api/recipes?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Empty ingredients list: show error "At least one ingredient required".
- Planning with no recipes selected: no-op.
- Shopping list with no planned meals: show "No ingredients — plan some meals first".
