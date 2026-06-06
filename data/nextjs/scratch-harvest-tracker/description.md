# Harvest Tracker

Build a single-page React app for tracking garden harvests.

## Seed Data

```
const HARVESTS = [
  { id: 1, crop: "Tomatoes", date: "2024-08-15", weightKg: 2.3, notes: "First big harvest of the season" },
  { id: 2, crop: "Zucchini", date: "2024-08-14", weightKg: 1.1, notes: "Getting large quickly" },
  { id: 3, crop: "Tomatoes", date: "2024-08-10", weightKg: 1.8, notes: "Mostly cherry tomatoes" },
  { id: 4, crop: "Basil", date: "2024-08-08", weightKg: 0.2, notes: "For pesto" },
  { id: 5, crop: "Zucchini", date: "2024-08-05", weightKg: 0.9, notes: "" },
]
```

## UI Layout

- `<h1>` with text "Harvest Tracker"
- A "Log Harvest" form (data-testid="harvest-form") with:
  - Crop name text input (data-testid="crop-input")
  - Date input (data-testid="harvest-date-input")
  - Weight (kg) number input with step 0.1 (data-testid="weight-input")
  - Notes textarea (data-testid="harvest-notes-input")
  - Submit button "Log Harvest" (data-testid="log-harvest-btn")
- A crop filter select showing all unique crop names plus "All Crops" (data-testid="crop-filter")
- A harvest list (data-testid="harvest-list") showing filtered harvests sorted by date descending
- Each harvest row (data-testid="harvest-row-{id}") shows crop, date, weight, notes, and a "Delete" button (data-testid="delete-harvest-{id}")
- A totals panel (data-testid="totals-panel") showing per-crop totals:
  - Each crop total row (data-testid="crop-total-{crop}") showing crop name and total kg
- Overall total "Total harvested: X.X kg" (data-testid="overall-total")

## Behaviors

1. On load, all 5 harvests are displayed sorted by date descending.
2. Submitting the form adds a new harvest entry. Crop, date, and weight are required.
3. Weight must be > 0. Invalid weight prevents submission.
4. The form clears after successful submission.
5. The crop filter updates dynamically to include any newly added crops.
6. Selecting a crop in the filter shows only that crop's harvests in the list.
7. The harvest list respects the active filter after adding or deleting entries.
8. Deleting a harvest removes it from the list.
9. The totals panel always shows ALL crops regardless of filter (totals are not filtered).
10. Crop totals are rounded to 1 decimal place.
11. Overall total sums all harvests and is shown rounded to 1 decimal place.

## Edge Cases

- Notes are optional
- Weight of 0 should be rejected
- Crop name is trimmed before saving (leading/trailing spaces removed)
- If all harvests are deleted, show "No harvests logged yet" (data-testid="no-harvests-msg")
