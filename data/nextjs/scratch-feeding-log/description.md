# Feeding Log

A single-page React app for logging a baby's feeding sessions, tracking amount consumed, feeding method, and duration.

## Seed Data

```
[
  { id: 1, method: "breast", startTime: "06:30", durationMinutes: 20, amountOz: 0, notes: "Left side" },
  { id: 2, method: "bottle", startTime: "10:00", durationMinutes: 15, amountOz: 4, notes: "Formula" },
  { id: 3, method: "breast", startTime: "13:00", durationMinutes: 18, amountOz: 0, notes: "Both sides" },
  { id: 4, method: "bottle", startTime: "17:00", durationMinutes: 10, amountOz: 3, notes: "Breast milk" },
  { id: 5, method: "solid", startTime: "19:30", durationMinutes: 25, amountOz: 0, notes: "Pureed carrots" },
]
```

## Fields

- **method**: "breast", "bottle", or "solid"
- **startTime**: HH:MM (24-hour)
- **durationMinutes**: positive integer
- **amountOz**: number >= 0 (0 for breast/solid)
- **notes**: free text

## UI Elements

- Page heading: "Feeding Log"
- A form with:
  - A `<select>` labeled "Method" with options: Breast, Bottle, Solid
  - A time `<input>` labeled "Start Time"
  - A number `<input>` labeled "Duration (min)"
  - A number `<input>` labeled "Amount (oz)"
  - A text `<input>` labeled "Notes"
  - A button "Add Feeding"
- A list of feeding entries, each with `data-testid="feeding-item"` containing:
  - `data-testid="feeding-method"` showing the method
  - `data-testid="feeding-time"` showing the start time
  - `data-testid="feeding-duration"` showing duration in minutes
  - `data-testid="feeding-amount"` showing amount in oz
  - `data-testid="feeding-notes"` showing notes
  - A "Remove" button
- Summary section:
  - `data-testid="total-feedings"` — total number of feeding entries
  - `data-testid="total-oz"` — total oz consumed across all bottle entries
  - `data-testid="total-duration"` — total minutes across all entries

## Behaviors

1. **Add feeding**: Filling out the form and clicking "Add Feeding" adds a new entry at the top. Form resets.
2. **Validation**: If startTime, durationMinutes, or notes is empty/zero, do NOT add. Duration must be > 0.
3. **Remove**: Clicking "Remove" deletes that entry.
4. **Summary updates**: total-feedings, total-oz, and total-duration update after every add/remove.
5. **total-oz**: sums amountOz across ALL entries (bottle entries typically have > 0 oz).
6. **Newest first**: list renders newest-added entry at the top.

## Edge Cases

- Removing all entries brings totals to 0.
- Breast/solid feedings with amountOz=0 do not increase total-oz.
- Duration of 0 fails validation.
