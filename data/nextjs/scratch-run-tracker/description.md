# Run Tracker

Build a single-page React app for logging and reviewing running workouts.

## Seed Data

Start with these 3 runs pre-loaded:

```
id: 1, date: "2024-03-01", distance: 3.1,  duration: 28,  notes: "Easy morning run"
id: 2, date: "2024-03-05", distance: 6.2,  duration: 58,  notes: "Long run"
id: 3, date: "2024-03-08", distance: 2.0,  duration: 20,  notes: "Recovery run"
```

Distance is in miles, duration is in minutes.

## UI Layout

### Add Run Form
- Date input labeled "Date"
- Number input labeled "Distance (miles)" (min 0.1, step 0.1)
- Number input labeled "Duration (minutes)" (min 1)
- Text input labeled "Notes" (optional)
- Button "Log Run" — disabled if distance <= 0 or duration <= 0

### Run List
- Each run has data-testid="run-item"
- Each run shows: date (data-testid="run-date"), distance (data-testid="run-distance", e.g. "3.1 mi"), duration (data-testid="run-duration", e.g. "28 min"), pace (data-testid="run-pace", e.g. "9:02 /mi"), and a "Delete" button
- Pace = duration / distance; format as "M:SS /mi" (e.g. 28/3.1 = 9.032... min/mi → "9:01 /mi")
- Runs are shown most recent date first

### Summary Bar
- data-testid="total-runs": "Runs: N"
- data-testid="total-distance": "Distance: X.X mi" (one decimal place, sum of all runs)
- data-testid="avg-pace": "Avg pace: M:SS /mi" (total duration / total distance, formatted same as pace); if no runs: "Avg pace: —"

## Behaviors

- Logging a run appends it, clears notes, resets distance/duration to empty, keeps date
- Deleting a run removes it from the list and updates stats
- If no runs, show "No runs logged." with data-testid="empty-message"
- Pace formatting: floor the minutes, round the seconds (use Math.floor for both parts after computing total seconds)
