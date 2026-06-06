# Food Log App

Build a single-page food diary app where users log food entries with name, meal type, and calories, and can view a daily summary.

## Seed Data

Start with these pre-loaded log entries:

| Name           | Meal      | Calories |
|----------------|-----------|----------|
| Oatmeal        | Breakfast | 300      |
| Orange Juice   | Breakfast | 110      |
| Caesar Salad   | Lunch     | 450      |
| Chicken Breast | Dinner    | 280      |

## UI Layout

- Page heading: "Food Log"
- A form with:
  - Text input labeled "Food Name"
  - Select dropdown labeled "Meal" with options: Breakfast, Lunch, Dinner, Snack
  - Number input labeled "Calories"
  - "Add Entry" button
- A list of log entries. Each entry shows:
  - Food name
  - Meal label
  - Calorie count
  - A "Remove" button (data-testid="remove-btn" on each)
- A summary section showing:
  - Total calories for the day (data-testid="total-calories")
  - Count of entries (data-testid="entry-count")
  - Calories broken down per meal type (data-testid="meal-breakdown"), showing each meal that has at least one entry

## Interactions

1. **Add Entry**: Filling in all three fields and clicking "Add Entry" appends the entry to the log and clears the form. If any field is empty/zero, the entry is not added.
2. **Remove Entry**: Clicking "Remove" on an entry removes it from the log.
3. **Total calories**: Sum of all entry calories (updates live).
4. **Entry count**: Number of entries in the log (updates live).
5. **Meal breakdown**: For each meal type present in the log, shows "MealType: X cal" (e.g., "Breakfast: 410 cal").

## Edge Cases

- Calories must be a positive number to add.
- When the log is empty, total-calories shows "0" and entry-count shows "0".
- Removing all entries of a meal removes that meal from the breakdown.
