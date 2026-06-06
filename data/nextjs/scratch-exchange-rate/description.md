# Exchange Rate Table

Build a single-page exchange rate manager. Users view a table of currency pairs with rates, can add new rates, edit existing rates, and delete entries.

## Seed Data

Pre-load these 5 exchange rate entries:

| ID | From | To  | Rate    |
|----|------|-----|---------|
| 1  | USD  | EUR | 0.9200  |
| 2  | USD  | GBP | 0.7900  |
| 3  | USD  | JPY | 149.50  |
| 4  | EUR  | GBP | 0.8587  |
| 5  | GBP  | JPY | 189.24  |

## UI Layout

- Page heading: "Exchange Rate Table"
- Add Rate form with fields:
  - "From Currency" text input (3-letter code, uppercase enforced)
  - "To Currency" text input (3-letter code, uppercase enforced)
  - "Rate" number input (decimal)
  - "Add Rate" submit button
- A table with columns: From | To | Rate | Last Updated | Actions
- Each row has:
  - From currency code
  - To currency code
  - Rate value (display 4 decimal places)
  - Last Updated timestamp (date string, e.g. "2024-01-15")
  - "Edit" button and "Delete" button
- Summary below table: "Showing N rates"

## Behaviors

### Add Rate
- From and To must be non-empty strings (trim whitespace). Rate must be > 0.
- Enforce uppercase on From/To inputs (convert to uppercase on change).
- Prevent duplicate pair (same From+To already exists): do nothing if duplicate.
- New entry gets current date as Last Updated (format: YYYY-MM-DD using `new Date().toISOString().slice(0,10)`).
- Assign id = max existing id + 1.
- Clear form inputs after successful add.

### Edit Rate
- Clicking "Edit" on a row enters inline edit mode for that row.
- The Rate cell becomes a number input pre-filled with current rate.
- "Edit" button changes to "Save" button. A "Cancel" button appears.
- Clicking "Save" validates rate > 0, updates the rate and Last Updated date, exits edit mode.
- Clicking "Cancel" discards changes and exits edit mode.
- Only one row can be in edit mode at a time (editing another auto-cancels current).

### Delete
- Remove the row immediately.
- Update the count summary.

### Seed Last Updated dates
Use these static strings for seed data:
- ID 1: "2024-01-10"
- ID 2: "2024-01-10"
- ID 3: "2024-01-11"
- ID 4: "2024-01-12"
- ID 5: "2024-01-15"

## data-testid attributes
- From input: `data-testid="from-input"`
- To input: `data-testid="to-input"`
- Rate input (add form): `data-testid="rate-input"`
- Add button: `data-testid="add-btn"`
- Table body: `data-testid="rates-table"`
- Each row: `data-testid="row-{id}"`
- Rate display cell per row: `data-testid="rate-cell-{id}"`
- Edit button per row: `data-testid="edit-btn-{id}"`
- Delete button per row: `data-testid="delete-btn-{id}"`
- Save button (edit mode): `data-testid="save-btn-{id}"`
- Cancel button (edit mode): `data-testid="cancel-btn-{id}"`
- Rate edit input: `data-testid="rate-edit-{id}"`
- Summary count: `data-testid="rate-count"`

## Edge Cases
- Adding with empty From or To: no-op.
- Adding with rate <= 0 or NaN: no-op.
- Duplicate pair (From+To): no-op.
- Save with rate <= 0: no-op (stay in edit mode).
