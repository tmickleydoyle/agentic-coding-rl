# Baby Tracker

A single-page React app for tracking a baby's daily activities including feedings, diaper changes, and sleep sessions.

## Seed Data

The app starts with the following activity log:

```
[
  { id: 1, type: "feeding", time: "07:00", note: "Breast milk, 4 oz" },
  { id: 2, type: "diaper", time: "08:30", note: "Wet" },
  { id: 3, type: "sleep", time: "09:00", note: "Nap, 1.5 hours" },
  { id: 4, type: "feeding", time: "11:00", note: "Formula, 5 oz" },
  { id: 5, type: "diaper", time: "12:00", note: "Dirty" },
]
```

## Fields

- **type**: activity type, one of "feeding", "diaper", "sleep"
- **time**: time in HH:MM format (24-hour)
- **note**: free-text description

## UI Elements

- Page heading: "Baby Tracker"
- A form with:
  - A `<select>` labeled "Activity Type" with options: Feeding, Diaper, Sleep
  - A time `<input>` labeled "Time"
  - A text `<input>` labeled "Note"
  - A submit button labeled "Log Activity"
- An activity list showing all entries, each with:
  - `data-testid="activity-item"` on the container
  - `data-testid="activity-type"` showing the type
  - `data-testid="activity-time"` showing the time
  - `data-testid="activity-note"` showing the note
  - A "Delete" button per entry
- A summary section with:
  - `data-testid="count-feeding"` showing the count of feeding entries
  - `data-testid="count-diaper"` showing the count of diaper entries
  - `data-testid="count-sleep"` showing the count of sleep entries
- A filter `<select>` labeled "Filter by Type" with options: All, Feeding, Diaper, Sleep

## Behaviors

1. **Add activity**: Filling out the form and clicking "Log Activity" adds a new entry to the list. The form resets after submission.
2. **Validation**: If time or note is empty, the entry is NOT added. The form stays as-is.
3. **Delete**: Clicking "Delete" on an entry removes it from the list.
4. **Filter**: Selecting a type from the filter dropdown shows only entries of that type. Selecting "All" shows all entries.
5. **Summary counts**: The counts update dynamically based on the full list (not the filtered view).
6. **List order**: Entries appear newest-first (most recently added at top).

## Edge Cases

- Deleting all entries of a type sets that type's count to 0.
- Filter persists when new items are added.
- Adding an entry while a filter is active: the new entry appears in the filtered list only if it matches the filter.
