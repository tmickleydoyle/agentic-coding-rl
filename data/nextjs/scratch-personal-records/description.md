# Personal Records Tracker

Build a single-page React app for tracking personal records (PRs) in strength exercises.

## Seed Data

Start with these 4 records pre-loaded:

```
id: 1, exercise: "Bench Press", weight: 185, unit: "lbs", date: "2024-01-15"
id: 2, exercise: "Squat",       weight: 225, unit: "lbs", date: "2024-02-20"
id: 3, exercise: "Deadlift",    weight: 275, unit: "lbs", date: "2024-03-10"
id: 4, exercise: "Overhead Press", weight: 115, unit: "lbs", date: "2024-01-28"
```

## UI Layout

### Add Record Form
- Text input labeled "Exercise"
- Number input labeled "Weight" (min 1)
- Select dropdown labeled "Unit" with options: lbs, kg
- Date input labeled "Date"
- Button "Save Record" — disabled if exercise is empty or weight is not positive

### Records Table / List
- Each record row has data-testid="record-row"
- Each row shows: exercise name (data-testid="record-exercise"), weight+unit (data-testid="record-weight"), date (data-testid="record-date"), and a "Delete" button
- Records are sorted by date descending (most recent first)

### Stats Panel
- data-testid="record-count": "Records: N"
- data-testid="heaviest-lift": "Heaviest: X lbs" or "Heaviest: X kg" — the single heaviest weight across all records (if multiple units exist, show the one with the highest weight value regardless of unit; show the unit of that record). If no records: "Heaviest: —"
- data-testid="latest-date": "Latest: YYYY-MM-DD" — date of the most recent record. If no records: "Latest: —"

## Behaviors

- Adding a record appends it, clears the exercise input, resets weight to empty, keeps unit/date as-is
- Deleting a record removes it from the list
- Stats update immediately after every add/delete
- Records list is always sorted by date descending
- If no records exist, show text "No records yet." with data-testid="empty-message"
