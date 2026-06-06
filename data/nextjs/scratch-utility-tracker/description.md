# Utility Tracker

A single-page React app for tracking monthly utility bills and viewing spending summaries.

## Seed Data

Pre-loaded utility entries:

| id | month | utility | amount | paid |
|----|-------|---------|--------|------|
| 1 | Jan 2024 | Electric | 85 | true |
| 2 | Jan 2024 | Gas | 60 | true |
| 3 | Jan 2024 | Water | 45 | false |
| 4 | Feb 2024 | Electric | 90 | true |
| 5 | Feb 2024 | Gas | 55 | false |
| 6 | Feb 2024 | Water | 42 | true |

## UI Layout

- `<h1>` with text "Utility Tracker"
- Summary section:
  - `data-testid="total-unpaid"` — "Unpaid Total: $N" (sum of amount where paid=false)
  - `data-testid="total-all"` — "All Bills Total: $N" (sum of all amounts)
  - `data-testid="bill-count"` — "Bills: N" (total number of entries)
- Month filter: a select labeled "Filter by Month" with options "All" plus each unique month from entries in order they first appear
- A table of entries with columns: Month, Utility, Amount, Status, Actions
  - Each row has `data-testid="bill-row"`
  - Amount shown as "$N" (no decimals)
  - Status column shows "Paid" or "Unpaid"
  - Actions: a "Mark Paid" button (disabled if already paid), and a "Delete" button
- Add bill form:
  - Text input labeled "Month" (e.g. "Mar 2024")
  - Select labeled "Utility" with options: Electric, Gas, Water, Internet, Other
  - Number input labeled "Amount"
  - Checkbox labeled "Paid" (unchecked by default)
  - "Add Bill" button

## Behaviors

- "Mark Paid" sets the entry's paid status to true.
- Deleting removes the entry.
- Adding a bill appends it; clears month and amount inputs; resets paid checkbox to unchecked; keeps utility selection.
- Adding with empty month or amount <= 0 does nothing.
- Month filter shows only rows matching selected month; "All" shows everything.
- Summary counts/totals reflect all entries regardless of month filter.
