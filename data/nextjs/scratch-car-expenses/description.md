# Car Expenses

A single-page React app to track car-related expenses by category. Users can log expenses, filter by category, and see spending breakdowns.

## Seed Data

Start with these 4 expense records pre-loaded:

```
id: 1, date: "2024-01-08", category: "Fuel", amount: 45.00, description: "Gas fill-up"
id: 2, date: "2024-01-15", category: "Maintenance", amount: 120.00, description: "Oil change"
id: 3, date: "2024-02-03", category: "Insurance", amount: 95.00, description: "Monthly premium"
id: 4, date: "2024-02-10", category: "Fuel", amount: 42.50, description: "Gas fill-up"
```

## Fields

- **date** (date, required): Date of expense
- **category** (select, required): One of: Fuel, Maintenance, Insurance, Registration, Other
- **amount** (number, required): Amount in dollars (positive)
- **description** (text, required): Short description

## Behaviors

### Add Expense
- A form with inputs for all fields.
- Clicking "Add Expense" validates all fields are filled and amount > 0.
- If invalid, show "Please fill in all required fields".
- On success, append and clear form.
- Auto-increment ids.

### Display List
- Show all expenses in a table with columns: date, category, amount ($X.XX), description.
- Rows have data-testid="expense-row".

### Delete Expense
- Each row has data-testid="delete-btn-{id}".
- Clicking removes that expense.

### Category Filter
- A dropdown (data-testid="category-filter") with options: "All", "Fuel", "Maintenance", "Insurance", "Registration", "Other".
- Default: "All" (shows everything).
- Filtering changes visible rows only; stats always reflect ALL expenses.

### Summary Stats
- Total expenses count: data-testid="total-expenses"
- Total amount: data-testid="total-amount" formatted as "$X.XX"
- Breakdown by category shown as a list of items, each with:
  - data-testid="category-{category}" showing "$X.XX" for that category's total
  - Only show categories that have at least one expense
  - Categories: Fuel, Maintenance, Insurance, Registration, Other

### Edit Amount
- Each row has an "Edit" button (data-testid="edit-btn-{id}").
- Clicking it shows an inline input (data-testid="edit-input-{id}") pre-filled with the current amount.
- A "Save" button (data-testid="save-btn-{id}") confirms the edit.
- After saving, the row shows the new amount and stats update.
- Only one row can be in edit mode at a time.

## Edge Cases
- Deleting all expenses: empty table, stats all zero, no category items shown.
- Filter "All" shows everything.
- Editing to the same value is valid.
