# Calorie Burn Estimator

Build a single-page React app that estimates calories burned from workout activities.

## Seed Data

Calorie burn rates (calories per minute per activity):

```
"Running":     10
"Cycling":     8
"Swimming":    9
"Jump Rope":   12
"Walking":     4
"Yoga":        3
```

Pre-loaded workout log entries:

```
id: 1, activity: "Running",  duration: 30, date: "2024-03-01"
id: 2, activity: "Cycling",  duration: 45, date: "2024-03-03"
id: 3, activity: "Swimming", duration: 20, date: "2024-03-05"
```

## Calorie Calculation

calories = duration (minutes) × rate (cal/min for that activity)

## UI Layout

### Add Workout Form
- Select dropdown labeled "Activity" with the 6 activities listed above
- Number input labeled "Duration (minutes)" (min 1)
- Date input labeled "Date"
- Button "Add Workout" — always enabled as long as duration > 0

### Workout Log
- Each entry has data-testid="workout-entry"
- Each entry shows: activity name (data-testid="entry-activity"), duration (data-testid="entry-duration", e.g. "30 min"), calories (data-testid="entry-calories", e.g. "300 cal"), date (data-testid="entry-date"), and a "Remove" button
- Entries listed in order added (newest last)

### Summary
- data-testid="total-workouts": "Workouts: N"
- data-testid="total-calories": "Total calories burned: N" (sum of all entry calories)
- data-testid="total-minutes": "Total minutes: N" (sum of all durations)

## Behaviors

- Adding a workout appends it with calories computed at add time; resets duration to empty; keeps activity and date
- Removing a workout removes it and updates all summary stats
- If no entries, show "No workouts logged." with data-testid="empty-message"
