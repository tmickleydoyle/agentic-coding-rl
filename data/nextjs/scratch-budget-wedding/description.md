# Wedding Budget Tracker

A single-page React app for tracking wedding budget categories with spending limits and over-budget detection.

## Seed Data

Total wedding budget: $30,000

Expense categories:

| id | category      | budgeted | spent |
|----|---------------|----------|-------|
| 1  | Venue         | 10000    | 9500  |
| 2  | Catering      | 8000     | 8200  |
| 3  | Photography   | 3000     | 2800  |
| 4  | Flowers       | 2000     | 1800  |
| 5  | Music         | 2000     | 1500  |
| 6  | Attire        | 3000     | 3100  |

## Fields

Each category has:
- id (number)
- category (string)
- budgeted (number)
- spent (number)

## UI Layout

- Page heading: "Wedding Budget"
- Overall budget summary with data-testid="overall-summary":
  "Total Budget: $30000 | Total Spent: $X | Remaining: $Y"
  (X = sum of all spent, Y = 30000 - X)
- Progress bar showing percentage of total budget spent, data-testid="overall-progress"
  - Shows "X%" text inside or next to bar
- List of category rows, each with data-testid="category-row-{id}":
  - Category name
  - "Budgeted: $X | Spent: $Y | Remaining: $Z" where Z = budgeted - spent
    data-testid="category-detail-{id}"
  - If spent > budgeted: show "Over Budget!" warning, data-testid="over-budget-{id}"
  - Progress bar for this category (spent/budgeted), data-testid="category-progress-{id}"
- "Add Expense" button, data-testid="add-expense-btn"
- Inline form with: Category (select of existing categories), Amount (number input)
  data-testid="expense-form"
  - "Save" and "Cancel" buttons
- "Add Category" button, data-testid="add-category-btn"
- Inline add-category form with: Category Name (text input), Budget Amount (number input)
  data-testid="category-form"
  - "Save" and "Cancel" buttons

## Behaviors

- "Add Expense" form: selecting a category and entering an amount, then saving, adds that amount to the category's spent
- "Add Category" form: adds a new category row with spent = 0
- Over-budget warning appears immediately when spent > budgeted
- Overall progress bar value = Math.round((totalSpent / 30000) * 100)
- Category progress bar value = Math.min(Math.round((spent / budgeted) * 100), 100)
- Both forms cancel independently
- Category name required to add category; amount > 0 required to add expense
- Overall remaining can be negative if total spent exceeds $30000

## Edge Cases

- New category id = max existing id + 1
- Adding expense to a category that was already over-budget keeps showing the warning
- Category progress bar caps at 100% display even if over budget
- Amount field should accept decimal values for expense (store as-is)
