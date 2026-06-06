# Recipe Finder

A single-page React app for browsing and filtering recipes by category and search term.

## Seed Data

Six recipes:

| id | name                    | category   | time (min) | ingredients count |
|----|-------------------------|------------|------------|-------------------|
| 1  | Spaghetti Bolognese     | Dinner     | 45         | 8                 |
| 2  | Caesar Salad            | Lunch      | 15         | 6                 |
| 3  | Pancakes                | Breakfast  | 20         | 5                 |
| 4  | Grilled Chicken         | Dinner     | 35         | 7                 |
| 5  | Avocado Toast           | Breakfast  | 10         | 4                 |
| 6  | Tomato Soup             | Lunch      | 25         | 6                 |

## UI Layout

- Page heading: "Recipe Finder"
- A search input labeled "Search recipes" — filters by recipe name (case-insensitive substring)
- A category filter: a `<select>` with aria-label "Filter by category" with options: All, Breakfast, Lunch, Dinner
- A list of matching recipes; each shown as a card with:
  - `data-testid="recipe-card"` on the card element
  - Recipe name (text)
  - Category badge: `data-testid="recipe-category"`
  - Cook time: `data-testid="recipe-time"` — "{N} min"
  - Ingredients count: `data-testid="recipe-ingredients"` — "{N} ingredients"
- `data-testid="recipe-count"` showing "Showing X recipes" where X is the current filtered count

## Filtering Behavior

- Filters are applied simultaneously (AND logic)
- Search filters on name; category filter (if not "All") restricts to that category
- If no recipes match, show `data-testid="no-results"` with text "No recipes found"
- Default: category = "All", search = "" → all 6 recipes shown

## Add Recipe Form

Below the list, a form with:
- Text input labeled "Recipe Name"
- Select labeled "Category" with options: Breakfast, Lunch, Dinner
- Number input labeled "Cook Time (min)" (positive integer)
- Number input labeled "Ingredients Count" (positive integer)
- Button labeled "Add Recipe"

On submit:
- All fields required; time and count must be positive integers
- Validation failure: do nothing
- On success: add recipe to list, clear form fields
