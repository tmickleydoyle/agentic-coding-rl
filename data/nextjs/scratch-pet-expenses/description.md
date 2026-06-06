# Pet Expense Tracker

A single-page React app for tracking pet-related expenses by category.

## Seed Data

Two pets pre-loaded with expenses:
- **Charlie** (Dog):
  - { date: "2024-01-10", category: "Food", amount: 45.00, note: "Dog food bags" }
  - { date: "2024-02-05", category: "Vet", amount: 120.00, note: "Annual checkup" }
  - { date: "2024-02-20", category: "Toys", amount: 22.50, note: "Chew toys" }
- **Cleo** (Cat):
  - { date: "2024-01-15", category: "Food", amount: 30.00, note: "Cat food" }
  - { date: "2024-03-01", category: "Vet", amount: 85.00, note: "Vaccines" }

## UI Layout

### Pet Selector
- Buttons per pet (data-testid="pet-btn-<name-lowercase>"). Active pet is bold.
- Show selected pet name (data-testid="pet-name") and species (data-testid="pet-species").

### Summary Section
- data-testid="total-expenses" — "Total: $<amount>" (2 decimal places, sum of all expenses for selected pet)
- data-testid="category-breakdown" — lists each unique category with its subtotal.
  - Each category item: data-testid="category-<category-lowercase>" showing "<Category>: $<amount>"

### Expense Table
- data-testid="expense-table"
- Columns: Date | Category | Amount | Note | Actions
- Each row: data-testid="expense-row-<index>" (0-based, sorted by date ascending)
- Delete button per row: data-testid="delete-expense-<index>"
- If no expenses: data-testid="no-expenses-msg" "No expenses recorded"

### Add Expense Form
- data-testid="add-expense-form"
- "Date" — date input (data-testid="expense-date-input")
- "Category" — select with options: Food, Vet, Toys, Grooming, Other (data-testid="expense-category-select")
- "Amount ($)" — number input with step="0.01" (data-testid="expense-amount-input")
- "Note" — text input (data-testid="expense-note-input")
- Submit button: "Add Expense"
- On submit: add expense to selected pet's list. Clear the form.
- If date is empty or amount <= 0 or amount is not a valid number, do not add.

## Behaviors & Edge Cases

- Expenses are sorted by date ascending in the table.
- Total and category breakdown update immediately when expenses are added or deleted.
- Amounts displayed with 2 decimal places.
- Switching pets shows that pet's expenses only.
- All state managed with useState.
