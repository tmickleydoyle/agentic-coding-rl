# Scratch Meal Prep — Weekly Meal Planner

Build a single-page React app for planning meals across a 7-day week.

## Seed Data

Days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

Pre-loaded meals:
- id:1, day:"Monday", meal:"Oatmeal", type:"breakfast", completed:false
- id:2, day:"Monday", meal:"Grilled Chicken Salad", type:"lunch", completed:false
- id:3, day:"Tuesday", meal:"Scrambled Eggs", type:"breakfast", completed:true
- id:4, day:"Wednesday", meal:"Pasta Bolognese", type:"dinner", completed:false
- id:5, day:"Friday", meal:"Avocado Toast", type:"breakfast", completed:false

## Fields

Each meal entry has:
- id (number)
- day (string — one of the 7 days)
- meal (string — name of the meal)
- type (string — "breakfast" | "lunch" | "dinner")
- completed (boolean)

## Layout

- Page heading: "Weekly Meal Planner"
- A form at the top with:
  - A text input labeled "Meal Name" (data-testid="meal-name-input")
  - A select for Day (data-testid="day-select") with options for each of the 7 days
  - A select for Type (data-testid="type-select") with options: breakfast, lunch, dinner
  - A submit button labeled "Add Meal" (data-testid="add-meal-btn")
- A summary bar showing:
  - Total meals planned (data-testid="total-count")
  - Meals completed (data-testid="completed-count")
- A list of meal cards. Each card has:
  - data-testid="meal-card-{id}" on the outer wrapper
  - data-testid="meal-name-{id}" showing the meal name
  - data-testid="meal-day-{id}" showing the day
  - data-testid="meal-type-{id}" showing the type
  - A checkbox (data-testid="meal-checkbox-{id}") to toggle completed state
  - A delete button (data-testid="delete-meal-{id}") labeled "Delete"
- A filter row with buttons: "All", "Breakfast", "Lunch", "Dinner" (data-testid="filter-all", "filter-breakfast", "filter-lunch", "filter-dinner")

## Behaviors

1. Add Meal: Filling in the form and clicking "Add Meal" appends a new entry to the list. Meal Name must be non-empty (trim). Day defaults to Monday, type defaults to breakfast. After adding, clear the Meal Name input (day/type retain their value).
2. Delete: Clicking "Delete" on a card removes it from the list.
3. Toggle completed: Clicking the checkbox flips the completed boolean. The completed count updates immediately.
4. Filter: Clicking a filter button shows only meals of that type (or all). Active filter persists until changed.
5. Summary counts reflect currently visible data (total = filtered count, completed = filtered completed count). Wait — on second thought, summary counts always reflect the FULL dataset regardless of filter.
6. Completed meals render with a strikethrough style on the meal name (the element has className containing "line-through" when completed).

## Edge Cases

- Adding a meal with only whitespace does nothing (no entry added).
- Deleting the last card of a type while that type filter is active leaves an empty list (no crash).
- The completed count never exceeds total count.
