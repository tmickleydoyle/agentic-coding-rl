# Recipe Manager App

Build a multi-route React application for managing cooking recipes.

## Routes
- `/` — Dashboard: shows total recipe count, list of all recipe names, and a "Add Recipe" button
- `/add-recipe` — Form to add a new recipe (name, ingredients textarea, instructions textarea, category dropdown)
- `/view-recipe` — View a selected recipe's full details (name, category, ingredients, instructions)
- `/dashboard` — Same as `/` (alias)

## Data Model (lib/types.ts)
```ts
interface Recipe {
  id: string;
  name: string;
  ingredients: string;   // newline-separated list
  instructions: string;
  category: "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
  createdAt: string;     // ISO date string
}
```

## State (lib/store.ts)
- `getRecipes(): Recipe[]` — returns current list
- `addRecipe(r: Omit<Recipe, "id"|"createdAt">): Recipe` — assigns uuid-style id, sets createdAt
- `deleteRecipe(id: string): void`
- `__reset(): void` — clears to seed data

## Seed Data (3 recipes on reset)
1. id:"r1", name:"Pancakes", category:"breakfast", ingredients:"Flour\nEggs\nMilk\nButter", instructions:"Mix and cook on griddle.", createdAt:"2024-01-01T00:00:00.000Z"
2. id:"r2", name:"Caesar Salad", category:"lunch", ingredients:"Romaine\nCroutons\nParmesan\nDressing", instructions:"Toss and serve.", createdAt:"2024-01-02T00:00:00.000Z"
3. id:"r3", name:"Spaghetti Bolognese", category:"dinner", ingredients:"Pasta\nGround Beef\nTomato Sauce\nOnion", instructions:"Cook meat, add sauce, serve over pasta.", createdAt:"2024-01-03T00:00:00.000Z"

## API Route (app/api/recipes/route.ts)
- GET /api/recipes — returns { recipes: Recipe[] }
- POST /api/recipes — body { name, ingredients, instructions, category } — returns created recipe

## UI Behaviors
- Dashboard lists all recipe names with data-testid="recipe-item"
- Clicking a recipe name navigates to /view-recipe and shows its details
- Add Recipe form validates: name required; shows data-testid="error-message" if submitted empty
- Category dropdown options: breakfast, lunch, dinner, snack, dessert
- After successful add, navigate back to dashboard
- Delete button on view-recipe page with data-testid="delete-btn"

## data-testid attributes (required)
- "nav-dashboard", "nav-add-recipe"
- "recipe-item" (each recipe in list)
- "recipe-count" (shows total number)
- "add-recipe-form", "input-name", "input-ingredients", "input-instructions", "select-category"
- "submit-btn", "error-message"
- "recipe-name", "recipe-category", "recipe-ingredients", "recipe-instructions"
- "delete-btn"
