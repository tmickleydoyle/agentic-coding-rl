# scratch-app-nutrition-plan

A multi-route nutrition plan manager. Users can manage meals, food items, daily targets, and view a summary.

## Routes
- `/` — Meals: create/delete meals (name, time of day: breakfast/lunch/dinner/snack)
- `/foods` — Foods: add food items to a selected meal (name, calories, protein g, carbs g, fat g)
- `/daily` — Daily Targets: set daily calorie and macro targets
- `/summary` — Summary: totals across all meals (calories, protein, carbs, fat) vs targets

## Seed Data
Two initial meals:
1. { id: "m1", name: "Morning Bowl", time: "breakfast", foods: [{ id: "f1", name: "Oats", calories: 300, protein: 10, carbs: 55, fat: 6 }] }
2. { id: "m2", name: "Lunch Wrap", time: "lunch", foods: [{ id: "f2", name: "Chicken", calories: 250, protein: 30, carbs: 10, fat: 5 }, { id: "f3", name: "Tortilla", calories: 150, protein: 4, carbs: 28, fat: 3 }] }

Default targets: { calories: 2000, protein: 150, carbs: 200, fat: 65 }

## Behaviors
- Meals page: add meal (name, time select), delete meal; click meal to select as active
- Foods page: add food to active meal; show "No active meal" if none selected
- Daily targets: editable number inputs for calories/protein/carbs/fat; save button updates targets
- Summary: sums all food calories/protein/carbs/fat; shows target vs actual for each

## API
POST /api/meals — body { name, time } → adds meal, returns meal
GET /api/meals — returns all meals

## Edge Cases
- Meal name must be non-empty
- Food name must be non-empty; calories/protein/carbs/fat >= 0
- Targets must be > 0 to save (ignore invalid)
