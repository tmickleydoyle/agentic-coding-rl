# Sleep Schedule

A single-page React app for tracking a baby's sleep sessions, showing sleep/wake times, duration, and quality.

## Seed Data

```
[
  { id: 1, date: "2024-01-15", sleepTime: "20:00", wakeTime: "06:00", durationHours: 10, quality: "good", notes: "Slept through the night" },
  { id: 2, date: "2024-01-16", sleepTime: "20:30", wakeTime: "02:00", durationHours: 5.5, quality: "poor", notes: "Night waking" },
  { id: 3, date: "2024-01-16", sleepTime: "14:00", wakeTime: "15:30", durationHours: 1.5, quality: "good", notes: "Afternoon nap" },
  { id: 4, date: "2024-01-17", sleepTime: "21:00", wakeTime: "07:00", durationHours: 10, quality: "good", notes: "Great night" },
  { id: 5, date: "2024-01-17", sleepTime: "13:30", wakeTime: "14:30", durationHours: 1, quality: "fair", notes: "Short nap" },
]
```

## Fields

- **date**: YYYY-MM-DD
- **sleepTime**: HH:MM (24-hour)
- **wakeTime**: HH:MM (24-hour)
- **durationHours**: positive number
- **quality**: "good", "fair", or "poor"
- **notes**: free text

## UI Elements

- Page heading: "Sleep Schedule"
- A form with:
  - A date `<input>` labeled "Date"
  - A time `<input>` labeled "Sleep Time"
  - A time `<input>` labeled "Wake Time"
  - A number `<input>` labeled "Duration (hours)"
  - A `<select>` labeled "Quality" with options: Good, Fair, Poor
  - A text `<input>` labeled "Notes"
  - A button "Add Sleep Session"
- A list of sleep entries, each with `data-testid="sleep-item"` containing:
  - `data-testid="sleep-date"` showing the date
  - `data-testid="sleep-time"` showing sleep time
  - `data-testid="wake-time"` showing wake time
  - `data-testid="sleep-duration"` showing duration in hours
  - `data-testid="sleep-quality"` showing quality
  - `data-testid="sleep-notes"` showing notes
  - A "Delete" button
- Summary section:
  - `data-testid="avg-duration"` — average sleep duration (rounded to 1 decimal place)
  - `data-testid="count-good"` — count of "good" quality sessions
  - `data-testid="count-poor"` — count of "poor" quality sessions

## Behaviors

1. **Add session**: Valid form submission adds entry at top. Form resets.
2. **Validation**: date, sleepTime, wakeTime, and durationHours (> 0) all required. Missing any prevents add.
3. **Delete**: removes entry from list.
4. **Average duration**: recalculates after add/delete, shown to 1 decimal (e.g., "5.6").
5. **Quality counts**: update after add/delete.
6. **Newest-first**: most recently added entry appears at top.

## Edge Cases

- With 0 entries, avg-duration shows "0.0".
- Only "good" and "poor" counts are displayed; "fair" is not shown separately.
- Duration of 0 fails validation.
