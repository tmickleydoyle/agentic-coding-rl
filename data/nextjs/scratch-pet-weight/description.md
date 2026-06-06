# Pet Weight Tracker

A single-page React app for tracking the weight of multiple pets over time.

## Seed Data

Three pets pre-loaded with weight history (date, weight in lbs):
- **Whiskers** (Cat):
  - 2024-01-01: 9.2
  - 2024-02-01: 9.5
  - 2024-03-01: 9.8
- **Rex** (Dog):
  - 2024-01-01: 45.0
  - 2024-02-01: 46.5
  - 2024-03-01: 44.0
- **Peanut** (Rabbit):
  - 2024-01-01: 3.1
  - 2024-02-01: 3.0
  - 2024-03-01: 3.2

## UI Layout

### Pet Selector
- A row of buttons, one per pet, labeled with the pet's name.
- Clicking selects that pet and shows their weight history.
- Active pet button is visually distinct (bold font weight).
- Show selected pet's name and species below buttons (data-testid="pet-name", data-testid="pet-species").

### Weight History Table
- Columns: Date | Weight (lbs) | Trend
- data-testid="weight-table"
- Each row: data-testid="weight-row-<index>" (0-based)
- Trend column: shows "↑" if weight increased from previous entry, "↓" if decreased, "—" if same or first entry.
- data-testid="trend-<index>" for each trend cell.

### Trend Summary
- Below the table, show: "Latest: X lbs" (data-testid="latest-weight") and "Trend: [Up/Down/Stable/No data]" (data-testid="trend-summary").
- Trend is based on comparing the last two entries. "Up" if latest > previous, "Down" if latest < previous, "Stable" if equal. "No data" if fewer than 2 entries.

### Add Weight Entry Form
- Label "Date" — date input (data-testid="weight-date-input")
- Label "Weight (lbs)" — number input with step="0.1" (data-testid="weight-value-input")
- Submit button "Add Entry"
- On submit: append new entry to selected pet's history (sorted by date ascending). Clear the form.
- If date or weight is empty/invalid (weight <= 0), do not add.

### Delete Entry
- Each row has a "Delete" button (data-testid="delete-weight-<index>").
- Clicking removes that entry from the pet's history.

## Behaviors & Edge Cases

- Entries are always displayed sorted by date ascending.
- Adding an entry with the same date as an existing entry is allowed (appears as separate entry).
- Deleting all entries shows an empty table with data-testid="no-weight-msg" "No weight entries yet".
- Switching pets shows that pet's history; does not affect other pets' data.
- All state managed with useState.
