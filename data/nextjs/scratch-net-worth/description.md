# Net Worth Tracker

Build a net worth calculator where users manage assets and liabilities to see their net worth.

## Seed Data

Pre-load these assets:

| Name             | Value      |
|------------------|------------|
| Checking Account |  5000.00   |
| Savings Account  | 20000.00   |
| Investment Portfolio | 45000.00 |

Pre-load these liabilities:

| Name           | Value     |
|----------------|-----------|
| Car Loan       | 8000.00   |
| Student Loans  | 25000.00  |

## Sections

### Assets Section
- Heading "Assets"
- List of assets; each item has data-testid="asset-row"
  - Displays name and `$X.XX` value
  - Delete button per row
- Total Assets: sum of all asset values (data-testid="total-assets")
- Add Asset form:
  - Text input (aria-label="Asset Name")
  - Number input (aria-label="Asset Value")
  - **Add Asset** button — disabled if name is empty

### Liabilities Section
- Heading "Liabilities"
- List of liabilities; each item has data-testid="liability-row"
  - Displays name and `$X.XX` value
  - Delete button per row
- Total Liabilities: sum of all liability values (data-testid="total-liabilities")
- Add Liability form:
  - Text input (aria-label="Liability Name")
  - Number input (aria-label="Liability Value")
  - **Add Liability** button — disabled if name is empty

### Net Worth Summary
- Net Worth = Total Assets - Total Liabilities (data-testid="net-worth")
- Display as `$X.XX` (may be negative, shown as `-$X.XX`)
- Status label: "Positive Net Worth" if net worth >= 0, "Negative Net Worth" otherwise (data-testid="net-worth-status")

## Behaviors

- Adding an asset/liability appends to the respective list and recalculates all totals.
- Deleting recalculates all totals.
- After adding, form inputs clear.
- All values display with exactly two decimal places and `$` prefix.

## Edge Cases

- If all assets and liabilities are deleted, net worth = $0.00, status = "Positive Net Worth".
- Values default to 0 if not entered.
