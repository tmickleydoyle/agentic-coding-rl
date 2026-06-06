# Expense Form

A single-page expense tracker where users can add and delete expense entries, with a running total.

## Seed Data (3 entries, hardcoded)

| id | description     | category    | amount |
|----|-----------------|-------------|--------|
| 1  | Coffee          | Food        | 4.50   |
| 2  | Bus ticket      | Transport   | 2.75   |
| 3  | Notebook        | Supplies    | 8.99   |

## Form Fields

- Description (text input, aria-label="Description")
- Category (select with options: Food, Transport, Supplies, Entertainment, Other)
- Amount (number input, aria-label="Amount", must be > 0)

## Interactions

- "Add Expense" button: validates that description is non-empty and amount > 0; if valid appends to list and clears the form inputs back to defaults (description="", category="Food", amount="")
- Invalid submissions (empty description or amount ≤ 0) do nothing (no new entry added)
- Each expense row has a "Delete" button that removes that entry
- The total is recalculated after every add/delete

## Display

- Each expense row rendered with data-testid="expense-row"
- Each row shows: description, category, amount formatted to 2 decimal places
- Total displayed as data-testid="total" showing "Total: $XX.XX"
- Category filter: a select (aria-label="Filter by category") with options: All, Food, Transport, Supplies, Entertainment, Other
  - When a category is selected (not "All"), only matching rows are shown; total still reflects ALL expenses regardless of filter
