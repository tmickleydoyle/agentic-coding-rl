# Rep Counter

Build a single-page React app for counting reps during a workout session.

## Seed Data

Start with these 3 exercises pre-loaded:

```
id: 1, name: "Push-ups",  target: 20, done: 0
id: 2, name: "Sit-ups",   target: 30, done: 0
id: 3, name: "Burpees",   target: 10, done: 0
```

## UI Layout

### Exercise List
Each exercise is displayed as a card with:
- Exercise name (data-testid="exercise-name")
- Current rep count display: e.g. "12 / 20" (data-testid="rep-display")
- A "+" button (aria-label should include the exercise name, e.g. "+ Push-ups") to increment by 1
- A "Reset" button to reset done count to 0
- When done >= target, show a "Complete!" badge with data-testid="complete-badge"

### Add Exercise Form
- Text input labeled "Exercise Name"
- Number input labeled "Target Reps" (min 1, default 10)
- Button "Add" — disabled if name is empty

### Session Summary
- data-testid="completed-count": "Completed: X / Y" where X = exercises where done >= target, Y = total exercises
- data-testid="total-reps-done": "Total reps done: N" (sum of all done counts)

## Behaviors

- Clicking "+" on an exercise increments its done count by 1 (cannot exceed target — button becomes disabled when done >= target)
- Clicking "Reset" sets done to 0 for that exercise
- Adding an exercise appends it with done=0 and clears the form
- Summary stats update immediately on every interaction
- Each exercise card has data-testid="exercise-card"
