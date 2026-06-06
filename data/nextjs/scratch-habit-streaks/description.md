# Habit Streaks

A single-page React app for tracking daily habits and their consecutive day streaks.

## Seed Data

Start with these 3 habits:

```
[
  { id: 1, name: "Morning Run", streak: 5, completedToday: false },
  { id: 2, name: "Read 30 Minutes", streak: 3, completedToday: true },
  { id: 3, name: "Drink Water", streak: 12, completedToday: false }
]
```

## UI Elements

- Page heading: "Habit Streaks"
- A list of habits. Each habit displays:
  - The habit name
  - Current streak count (e.g. "5 days")
  - A "Complete" button (disabled if already completed today, text changes to "Done" when completed)
  - A `data-testid="habit-item"` on the habit row element
  - A `data-testid="streak-count"` on the streak display
- An input (aria-label: "New habit name") and an "Add Habit" button to add new habits
- A `data-testid="habit-count"` element showing total number of habits (e.g. "Habits: 3")
- A `data-testid="completed-today"` element showing how many habits are completed today (e.g. "Completed today: 1")

## Behaviors

1. **Add habit**: Typing a name and clicking "Add Habit" adds a new habit with streak=0 and completedToday=false. Clears the input. Ignores blank/whitespace input.
2. **Complete habit**: Clicking "Complete" on an incomplete habit marks it as completedToday=true and increments its streak by 1. The button becomes disabled and shows "Done".
3. **Counts update**: `habit-count` and `completed-today` update reactively.
4. **Streak display**: Shows current streak as "{n} days".
5. **Duplicate names**: Allowed — no uniqueness enforcement.
