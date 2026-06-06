# Allowance Tracker

Build a single-page allowance tracker for tracking weekly earnings and spending with a running balance.

## Seed Data

Start with these transactions pre-loaded:

| ID | Date       | Description         | Type    | Amount |
|----|------------|---------------------|---------|--------|
| 1  | 2024-01-07 | Weekly allowance    | earning | 10.00  |
| 2  | 2024-01-08 | Candy               | spending| 2.50   |
| 3  | 2024-01-14 | Weekly allowance    | earning | 10.00  |
| 4  | 2024-01-15 | Comic book          | spending| 4.00   |
| 5  | 2024-01-21 | Weekly allowance    | earning | 10.00  |

## UI Layout

- Page heading: "Allowance Tracker"
- Summary cards at top:
  - "Total Earned: $X.XX"
  - "Total Spent: $X.XX"
  - "Balance: $X.XX"
- Add Transaction form with fields:
  - "Date" date input
  - "Description" text input
  - "Type" select with options: "earning" | "spending"
  - "Amount" number input
  - "Add Transaction" submit button
- Transaction table with columns: Date | Description | Type | Amount | Running Balance | Actions
- Each row shows:
  - Date (as entered, YYYY-MM-DD)
  - Description
  - Type badge ("Earning" or "Spending")
  - Amount: "+$X.XX" for earnings, "-$X.XX" for spending
  - Running balance at that point in the transaction list
  - "Delete" button
- Filter controls:
  - "All" | "Earnings" | "Spending" filter buttons
  - When filtered, the table shows only matching rows

## Behaviors

### Add Transaction
- Date, Description must be non-empty. Amount must be > 0.
- Assign id = max existing id + 1.
- Append to end of transaction list (do not sort by date).
- Clear form after successful add.

### Delete
- Remove the transaction from the list.
- Recalculate running balances and summary totals.

### Running Balance
- Computed row by row in list order (not sorted by date).
- Running balance for row N = sum of signed amounts for rows 1..N.
- Earnings add to balance, spending subtracts.

### Summary Totals
- Total Earned = sum of all earning amounts.
- Total Spent = sum of all spending amounts.
- Balance = Total Earned - Total Spent.

### Filter
- "All": show all transactions.
- "Earnings": show only type === "earning".
- "Spending": show only type === "spending".
- Filter does not affect running balance calculation (still computed over full list).
- Active filter button should appear visually distinct (use aria-pressed or a class).

## data-testid attributes
- Total earned display: `data-testid="total-earned"`
- Total spent display: `data-testid="total-spent"`
- Balance display: `data-testid="balance"`
- Date input: `data-testid="date-input"`
- Description input: `data-testid="desc-input"`
- Type select: `data-testid="type-select"`
- Amount input: `data-testid="amount-input"`
- Add button: `data-testid="add-btn"`
- Filter all button: `data-testid="filter-all"`
- Filter earnings button: `data-testid="filter-earnings"`
- Filter spending button: `data-testid="filter-spending"`
- Table body: `data-testid="transaction-table"`
- Each row: `data-testid="row-{id}"`
- Running balance cell: `data-testid="running-balance-{id}"`
- Delete button per row: `data-testid="delete-btn-{id}"`

## Edge Cases
- Deleting a transaction recalculates all running balances.
- Filter shows empty table when no matching transactions.
- Amount = 0 or negative: do nothing.
- Empty description or date: do nothing.
