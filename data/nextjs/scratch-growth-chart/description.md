# Growth Chart

A single-page React app for tracking a baby's physical growth measurements over time, including weight, height, and head circumference.

## Seed Data

```
[
  { id: 1, date: "2024-01-01", ageMonths: 0, weightLbs: 7.5, heightIn: 20.0, headCircumIn: 13.5, notes: "Birth measurements" },
  { id: 2, date: "2024-02-01", ageMonths: 1, weightLbs: 9.2, heightIn: 21.5, headCircumIn: 14.2, notes: "1 month checkup" },
  { id: 3, date: "2024-04-01", ageMonths: 3, weightLbs: 12.8, heightIn: 23.5, headCircumIn: 15.5, notes: "3 month checkup" },
  { id: 4, date: "2024-07-01", ageMonths: 6, weightLbs: 16.4, heightIn: 26.0, headCircumIn: 16.8, notes: "6 month checkup" },
  { id: 5, date: "2024-10-01", ageMonths: 9, weightLbs: 19.1, heightIn: 28.0, headCircumIn: 17.5, notes: "9 month checkup" },
]
```

## Fields

- **date**: YYYY-MM-DD
- **ageMonths**: non-negative integer
- **weightLbs**: positive number
- **heightIn**: positive number
- **headCircumIn**: positive number
- **notes**: free text

## UI Elements

- Page heading: "Growth Chart"
- A form with:
  - A date `<input>` labeled "Date"
  - A number `<input>` labeled "Age (months)"
  - A number `<input>` labeled "Weight (lbs)"
  - A number `<input>` labeled "Height (in)"
  - A number `<input>` labeled "Head Circumference (in)"
  - A text `<input>` labeled "Notes"
  - A button "Add Measurement"
- A list of measurement entries, each with `data-testid="measurement-item"` containing:
  - `data-testid="measurement-date"` showing the date
  - `data-testid="measurement-age"` showing age in months
  - `data-testid="measurement-weight"` showing weight in lbs
  - `data-testid="measurement-height"` showing height in inches
  - `data-testid="measurement-head"` showing head circumference
  - `data-testid="measurement-notes"` showing notes
  - A "Delete" button
- Summary section:
  - `data-testid="latest-weight"` — weight from the most recently added entry (not by date, by insertion order)
  - `data-testid="latest-height"` — height from the most recently added entry
  - `data-testid="total-measurements"` — total count of measurements

## Behaviors

1. **Add measurement**: Valid submission adds a new entry at the top of the list. Form resets.
2. **Validation**: date, weightLbs (> 0), heightIn (> 0), and headCircumIn (> 0) all required. Missing/zero any of these prevents add.
3. **Delete**: removes the entry.
4. **Latest weight/height**: reflects the first entry in the list (newest-added). Updates after add/delete.
5. **Total measurements**: updates after add/delete.
6. **Newest-first**: most recently added entry appears at top.

## Edge Cases

- With 0 entries, latest-weight and latest-height show "—" (em dash).
- ageMonths of 0 is valid (newborn).
- Deleting the newest entry makes the next entry the "latest".
