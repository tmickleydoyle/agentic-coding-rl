# Recipe Box

A multi-route recipe management application.

## Routes
- `/home` — Shows total recipe count, featured (first) recipe, link to browse all
- `/recipes` — List all recipes with title, cuisine, prep time; click to view detail; add new recipe
- `/ingredients` — Browse all unique ingredients across all recipes
- `/favorites` — List recipes marked as favorite; toggle favorite from recipe list

## Data Model

### Recipe
```ts
{ id: string; title: string; cuisine: string; prepTime: number; ingredients: string[]; instructions: string; favorite: boolean }
```

## Seed Data
```
{id:"r1", title:"Pasta Carbonara", cuisine:"Italian", prepTime:20, ingredients:["pasta","eggs","bacon","parmesan"], instructions:"Boil pasta...", favorite:true}
{id:"r2", title:"Chicken Stir Fry", cuisine:"Asian", prepTime:15, ingredients:["chicken","broccoli","soy sauce","ginger"], instructions:"Heat oil...", favorite:false}
{id:"r3", title:"Caesar Salad", cuisine:"American", prepTime:10, ingredients:["lettuce","croutons","parmesan","caesar dressing"], instructions:"Toss greens...", favorite:true}
```

## Behaviors
- Add recipe: title (required), cuisine (required), prepTime (positive integer), ingredients (comma-separated string parsed into array), instructions (required)
- Toggle favorite: flips favorite boolean on a recipe
- Ingredients page: lists all unique ingredient strings across all recipes, sorted alphabetically
- Favorites page: shows only recipes where favorite === true
- Home: shows count of all recipes

## Edge Cases
- Cannot add recipe with empty title, cuisine, or instructions
- prepTime must be a positive integer
- Ingredients page de-duplicates across recipes
- If no favorites, favorites page shows empty state message

## UI Requirements
- NavBar: data-testid `nav-home`, `nav-recipes`, `nav-ingredients`, `nav-favorites`
- Recipe rows: `data-testid="recipe-row-{id}"`
- Favorite toggle: `data-testid="toggle-favorite-{id}"`
- Add recipe form: `data-testid="recipe-title"`, `data-testid="recipe-cuisine"`, `data-testid="recipe-preptime"`, `data-testid="recipe-ingredients"`, `data-testid="recipe-instructions"`, `data-testid="add-recipe-btn"`
- Home count: `data-testid="recipe-count"`
- Ingredients list: `data-testid="ingredient-list"`
- Ingredient items: `data-testid="ingredient-item-{name}"` (lowercase, spaces replaced with dashes)
- Favorites list: `data-testid="favorites-list"`
- Empty favorites: `data-testid="no-favorites"`
