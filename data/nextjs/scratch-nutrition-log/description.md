# Scratch Nutrition Log — Daily Macro Tracker

Build a single-page React app for logging daily meals with nutritional macros.

## Seed Data

Pre-loaded log entries (all for today's date placeholder "2026-06-06"):
- id:1, meal:"Oatmeal with Berries", calories:320, protein:10, carbs:58, fat:6, mealType:"breakfast"
- id:2, meal:"Grilled Chicken Wrap", calories:480, protein:38, carbs:42, fat:14, mealType:"lunch"
- id:3, meal:"Greek Yogurt", calories:150, protein:15, carbs:12, fat:3, mealType:"snack"
- id:4, meal:"Salmon & Veggies", calories:520, protein:42, carbs:28, fat:22, mealType:"dinner"

## Fields

Each log entry:
- id (number)
- meal (string — name of food/meal)
- calories (number)
- protein (number — grams)
- carbs (number — grams)
- fat (number — grams)
- mealType (string — "breakfast" | "lunch" | "snack" | "dinner")

Daily goals (fixed constants):
- calorieGoal: 2000
- proteinGoal: 150 (grams)
- carbGoal: 250 (grams)
- fatGoal: 65 (grams)

## Layout

- Page heading: "Nutrition Log"
- Add entry form:
  - Text input "Meal Name" (data-testid="meal-name-input")
  - Number input "Calories" (data-testid="calories-input")
  - Number input "Protein (g)" (data-testid="protein-input")
  - Number input "Carbs (g)" (data-testid="carbs-input")
  - Number input "Fat (g)" (data-testid="fat-input")
  - Select "Meal Type" (data-testid="meal-type-select") options: breakfast, lunch, snack, dinner
  - Button "Log Meal" (data-testid="log-meal-btn")
- Daily totals summary:
  - data-testid="total-calories" — sum of all entry calories
  - data-testid="total-protein" — sum of all protein grams
  - data-testid="total-carbs" — sum of all carb grams
  - data-testid="total-fat" — sum of all fat grams
- Goal progress indicators (one per macro):
  - data-testid="calories-progress" — text like "1470 / 2000" (current / goal)
  - data-testid="protein-progress" — text like "105 / 150"
  - data-testid="carbs-progress" — text like "140 / 250"
  - data-testid="fat-progress" — text like "45 / 65"
- Filter row: "All", "Breakfast", "Lunch", "Snack", "Dinner" (data-testid="filter-all", "filter-breakfast", "filter-lunch", "filter-snack", "filter-dinner")
- Entry list. Each card:
  - data-testid="entry-card-{id}"
  - data-testid="entry-meal-{id}" — meal name
  - data-testid="entry-calories-{id}" — calories number
  - data-testid="entry-protein-{id}" — protein grams
  - data-testid="entry-carbs-{id}" — carbs grams
  - data-testid="entry-fat-{id}" — fat grams
  - data-testid="entry-type-{id}" — mealType string
  - Delete button (data-testid="delete-entry-{id}") labeled "Delete"

## Behaviors

1. Add entry: meal name non-empty (trimmed). Calories, protein, carbs, fat must be >= 0. After adding, reset form.
2. Delete: removes entry; totals update immediately.
3. Filter: shows only entries of that mealType. "All" shows everything.
4. Totals and progress always reflect the FULL dataset (not filtered).
5. Progress format: "{current} / {goal}" (integer display, no decimals).
6. Over-goal is allowed (no cap).

## Edge Cases

- Adding with empty meal name does nothing.
- Adding with negative macro values does nothing.
- All values of 0 are valid (a zero-calorie entry is valid as long as meal name is non-empty).
- Deleting all entries shows all totals as 0.
