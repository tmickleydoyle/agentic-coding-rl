# Workout Plan Builder

Build a single-page React app that lets users create and manage a weekly workout plan.

## Seed Data

Start with these 3 exercises pre-loaded:

```
id: 1, name: "Push-ups", sets: 3, reps: 15, day: "Monday"
id: 2, name: "Squats",   sets: 4, reps: 12, day: "Monday"
id: 3, name: "Pull-ups", sets: 3, reps: 8,  day: "Wednesday"
```

## UI Layout

### Add Exercise Form
- Text input labeled "Exercise Name"
- Number input labeled "Sets" (min 1)
- Number input labeled "Reps" (min 1)
- Select dropdown labeled "Day" with options: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- Button "Add Exercise" — disabled if name is empty

### Exercise List
- Group exercises by day (show day as heading)
- Each exercise row shows: name, sets × reps (e.g. "3 × 15"), and a "Remove" button
- Each exercise row has data-testid="exercise-item"
- Each exercise name span has data-testid="exercise-name"
- Each exercise sets×reps display has data-testid="exercise-sets-reps"

### Summary
- Display total exercise count: data-testid="total-count" — e.g. "Total exercises: 3"
- Display total sets across all exercises: data-testid="total-sets" — e.g. "Total sets: 10"

## Behaviors

- Adding an exercise appends it to the list for the selected day and clears the name input (sets/reps/day reset to defaults: 3, 10, Monday)
- Removing an exercise deletes it from the list
- Summary stats update immediately on add/remove
- Days with no exercises are not shown in the grouped list
- If no exercises exist, show a paragraph with text "No exercises yet." with data-testid="empty-message"
