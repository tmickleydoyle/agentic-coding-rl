# Calorie Counter App

Build a single-page calorie tracking app with a daily goal, food search from a preset database, and a progress indicator.

## Seed Food Database

| Name             | Calories (per serving) |
|------------------|------------------------|
| Apple            | 95                     |
| Banana           | 105                    |
| Boiled Egg       | 78                     |
| Brown Rice (cup) | 216                    |
| Cheddar Cheese   | 113                    |
| Greek Yogurt     | 100                    |
| Grilled Chicken  | 165                    |
| Milk (cup)       | 149                    |
| Peanut Butter    | 188                    |
| Whole Wheat Bread| 69                     |

## UI Layout

- Page heading: "Calorie Counter"
- A daily goal input (number, labeled "Daily Goal (cal)") pre-filled with 2000
- A search input labeled "Search Food" that filters the food database list in real time
- A list of food database results; each item shows name, calories, and an "Add" button
- A consumed foods list showing added items (data-testid="consumed-item" per row) with a "Remove" button each
- Summary section:
  - Total calories consumed (data-testid="consumed-total")
  - Remaining calories = goal minus consumed (data-testid="remaining")
  - A status message (data-testid="status"):
    - "Under goal" when consumed < goal
    - "Goal reached!" when consumed === goal
    - "Over goal" when consumed > goal

## Interactions

1. **Search**: Typing in the search box filters the food list (case-insensitive substring match). Empty search shows all 10 foods.
2. **Add food**: Clicking "Add" on a food appends it to the consumed list. Same food can be added multiple times.
3. **Remove**: Clicking "Remove" on a consumed item removes it from the list.
4. **Daily goal**: Changing the goal number updates remaining and status immediately.
5. **Remaining**: Can be negative if over goal.

## Edge Cases

- When consumed list is empty, consumed-total is 0 and remaining equals the goal.
- Goal of 0 with any food consumed shows "Over goal".
