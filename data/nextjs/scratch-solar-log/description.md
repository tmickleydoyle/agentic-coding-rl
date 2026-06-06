# Solar Log

A single-page app for logging daily solar panel energy production readings.

## Seed Data

Pre-load these 4 entries on mount:

| Date       | kWh   | Notes              |
|------------|-------|--------------------|
| 2024-06-01 | 22.5  | Sunny all day      |
| 2024-06-02 | 18.3  | Partly cloudy      |
| 2024-06-03 | 5.1   | Overcast           |
| 2024-06-04 | 25.0  | Perfect conditions |

## Fields

- **Date** (date input, required)
- **kWh Produced** (number input, required, min 0)
- **Notes** (text input, optional)

## Behaviors

### Add Entry
- Form at top with Date, kWh Produced, Notes fields and an "Add Entry" button.
- On submit: validate Date and kWh are filled; if invalid show error message "Date and kWh are required".
- On valid submit: append entry to list, clear the form.
- kWh must be >= 0; if negative show "kWh must be non-negative".

### Entry List
- Display entries sorted by date descending (newest first).
- Each entry shows: date (formatted as YYYY-MM-DD), kWh value, notes (or "—" if empty).
- Each entry has a "Delete" button that removes it.

### Summary Stats
- Show total kWh produced across all entries (sum, 1 decimal).
- Show average kWh per entry (sum / count, 1 decimal; show "0.0" if no entries).
- Show count of entries.

### Filter
- A text input labeled "Filter by notes" that filters displayed entries by notes (case-insensitive substring match).
- Filtering does not affect summary stats (stats always reflect all entries).

## Edge Cases
- Deleting all entries shows an empty list and zeroed stats.
- Adding an entry with empty notes stores it as empty string and displays "—".
- Duplicate dates are allowed.
