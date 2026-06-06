# Budget Categories

Build a monthly budget tracker where users manage spending categories, enter actual spend, and see variances.

## Seed Data

Pre-load these budget categories:

| Category    | Budget  | Spent  |
|-------------|---------|--------|
| Housing     | 1500.00 | 1450.00|
| Food        |  600.00 |  720.00|
| Transport   |  300.00 |  280.00|
| Entertainment| 200.00 |  350.00|

## Fields

- **Add Category form** with:
  - Text input for category name (aria-label="Category Name")
  - Number input for budget amount (aria-label="Budget Amount")
  - Number input for spent amount (aria-label="Spent Amount")
  - **Add Category** button
- **Category list**: each item shows:
  - Category name
  - Budget: `$X.XX`
  - Spent: `$X.XX`
  - Variance: `$X.XX` (budget minus spent; positive = under budget, negative = over)
  - Status badge: "Under Budget" if variance >= 0, "Over Budget" if variance < 0
  - **Delete** button to remove the category
  - data-testid="category-row" on each row
  - data-testid="variance" on the variance cell
  - data-testid="status" on the status badge
- **Summary section**:
  - Total Budget: sum of all budget amounts (data-testid="total-budget")
  - Total Spent: sum of all spent amounts (data-testid="total-spent")
  - Total Variance: total budget minus total spent (data-testid="total-variance")
  - Overall Status: "Under Budget" if total variance >= 0, "Over Budget" otherwise (data-testid="overall-status")

## Behaviors

- Adding a category appends it to the list and recalculates summary.
- Deleting a row recalculates summary.
- Variance is shown with a `$` prefix and two decimal places. Negative values show as e.g. `-$120.00` — format as `${variance < 0 ? '-' : ''}$${Math.abs(variance).toFixed(2)}`.
- The Add Category button is disabled (or does nothing) if the category name is empty.
- After adding, the form inputs are cleared.

## Edge Cases

- If all categories are deleted, all totals show `$0.00` and overall status is "Under Budget".
- Budget and spent amounts default to 0 if not entered.
