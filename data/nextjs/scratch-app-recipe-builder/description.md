# Recipe Builder

A recipe management app where users can create recipes with ingredients, browse a library, manage a pantry ingredient list, and mark favorites.

## Routes
- `/` → Home: count of total recipes, count of favorites, recently added recipe name
- `/recipes` → Recipe list: all recipes with name, description, ingredient count, add new recipe form
- `/ingredients` → Ingredients: pantry ingredient list; add new ingredient form
- `/favorites` → Favorites: list of recipes marked as favorite

## Data Model

### Recipe
```ts
interface Recipe {
  id: string
  name: string
  description: string
  ingredients: string[]  // ingredient names
  favorite: boolean
  createdAt: string  // ISO string
}
```

### Ingredient
```ts
interface Ingredient {
  id: string
  name: string
  quantity: string
}
```

## Seed Data
Recipes:
- { id: "r1", name: "Pasta Carbonara", description: "Classic Italian pasta", ingredients: ["pasta", "eggs", "bacon"], favorite: true, createdAt: "2026-01-01T00:00:00Z" }
- { id: "r2", name: "Caesar Salad", description: "Crispy romaine salad", ingredients: ["romaine", "croutons", "dressing"], favorite: false, createdAt: "2026-01-02T00:00:00Z" }
- { id: "r3", name: "Avocado Toast", description: "Simple breakfast", ingredients: ["bread", "avocado"], favorite: true, createdAt: "2026-01-03T00:00:00Z" }

Ingredients:
- { id: "i1", name: "pasta", quantity: "500g" }
- { id: "i2", name: "eggs", quantity: "6" }

## Behaviors

### Home Page
- data-testid="total-recipes": count of all recipes
- data-testid="total-favorites": count of recipes where favorite=true
- data-testid="recent-recipe": name of recipe with latest createdAt

### Recipes Page
- Each recipe: data-testid="recipe-card-{id}"
- Shows name, description, ingredient count (e.g., "3 ingredients")
- Toggle favorite button: data-testid="toggle-fav-{id}", toggles favorite status
- Add recipe form: fields name, description, ingredients (comma-separated text)
- Submit: data-testid="add-recipe-btn"

### Ingredients Page
- Each ingredient: data-testid="ingredient-item-{id}"
- Shows name and quantity
- Add form: name, quantity inputs
- Submit: data-testid="add-ingredient-btn"

### Favorites Page
- Shows only recipes where favorite=true
- Each: data-testid="fav-card-{id}"

## API Routes
- GET /api/recipes → { recipes: Recipe[] }
- POST /api/recipes → body { name, description, ingredients: string[] } → created Recipe
- GET /api/recipes/ingredients → { ingredients: Ingredient[] }
- POST /api/recipes/ingredients → body { name, quantity } → created Ingredient

## Edge Cases
- Ingredients field accepts comma-separated string, stored as array
- Toggle favorite on recipes page reflects immediately in favorites count on home
- Missing name on recipe POST returns 400
