# Weather Notes

Build a single-page React app for logging daily weather observations.

## Seed Data

```
const OBSERVATIONS = [
  { id: 1, date: "2024-01-15", tempC: 12, condition: "sunny", humidity: 45, notes: "Perfect gardening day" },
  { id: 2, date: "2024-01-14", tempC: 8, condition: "cloudy", humidity: 70, notes: "Too cold to work outside" },
  { id: 3, date: "2024-01-13", tempC: 5, condition: "rainy", humidity: 90, notes: "Heavy rain, soil saturated" },
  { id: 4, date: "2024-01-10", tempC: 15, condition: "sunny", humidity: 40, notes: "Watered plants in the evening" },
]
```

## UI Layout

- `<h1>` with text "Weather Notes"
- An "Add Observation" form (data-testid="obs-form") with:
  - Date input (data-testid="obs-date-input")
  - Temperature (°C) number input (data-testid="obs-temp-input")
  - Condition select: "sunny", "cloudy", "rainy", "windy", "snowy" (data-testid="obs-condition-select")
  - Humidity (%) number input, range 0-100 (data-testid="obs-humidity-input")
  - Notes textarea (data-testid="obs-notes-input")
  - Submit button "Add Observation" (data-testid="add-obs-btn")
- A condition filter (data-testid="condition-filter") select with all conditions + "All"
- An observations list (data-testid="obs-list") sorted by date descending
- Each observation row (data-testid="obs-row-{id}") shows date, temperature, condition, humidity, notes, and a "Delete" button (data-testid="delete-obs-{id}")
- A statistics panel (data-testid="stats-panel") showing:
  - Average temperature "Avg Temp: X.X°C" (data-testid="avg-temp")
  - Average humidity "Avg Humidity: X.X%" (data-testid="avg-humidity")
  - Most common condition (data-testid="common-condition")

## Behaviors

1. On load, all 4 observations are shown sorted by date descending.
2. Submitting the form adds a new observation. Date, temperature, and humidity are required.
3. Humidity must be 0-100. Invalid humidity prevents submission.
4. Temperature can be negative (below zero is valid).
5. The form clears after submission (condition resets to "sunny").
6. Filtering by condition shows only matching observations.
7. Deleting an observation removes it immediately.
8. Statistics panel always reflects ALL observations regardless of active filter.
9. Average temp and humidity are rounded to 1 decimal place.
10. Most common condition is the condition appearing most frequently. If tied, show the one that appears first alphabetically.
11. If no observations exist, show "No observations yet" (data-testid="no-obs-msg") and hide stats.

## Edge Cases

- Notes field is optional
- Humidity exactly 0 or 100 is valid
- Temperature of -10 is valid
- Duplicate dates are allowed (two observations on the same day)
