# Coin Counter

Build a single-page US coin counter. Users enter quantities of each coin denomination and the app computes the total value.

## Coin Denominations

| Name    | Value (cents) |
|---------|---------------|
| Pennies | 1             |
| Nickels | 5             |
| Dimes   | 10            |
| Quarters| 25            |
| Half Dollars | 50       |
| Dollar Coins | 100      |

## Seed Data

Start with all coin quantities at 0.

## UI Layout

- Page heading: "Coin Counter"
- A row for each denomination containing:
  - Label with the coin name
  - Number input for quantity (min 0, integer)
  - Display of the subtotal value for that denomination in cents, e.g. "= 50¢"
- Total section showing:
  - Total in cents: "Total Cents: N"
  - Total in dollars and cents: "Total: $X.YY" (e.g. $1.75)
- A "Reset" button that sets all quantities back to 0.
- A "Count Coins" button that recalculates totals (totals should also update live on input change).

## Behaviors

### Live Update
- Whenever any quantity input changes, recompute all subtotals and the grand total immediately.

### Count Coins Button
- Clicking "Count Coins" triggers recalculation (same result as live update). It is a manual recalculate trigger.

### Reset
- Sets all coin quantities to 0.
- Resets total to $0.00.

### Subtotal Display
- For each denomination: subtotal = quantity * coinValue (in cents).
- Display as "= Nc" where N is the cent value, e.g. "= 75¢".

### Total Display
- Sum all subtotals in cents.
- Display as integer cents: "Total Cents: N"
- Display as dollars: "Total: $X.YY" — divide cents by 100, format with 2 decimal places.

## data-testid attributes
- Each quantity input: `data-testid="input-{denomination}"` where denomination is lowercase, e.g. `pennies`, `nickels`, `dimes`, `quarters`, `half-dollars`, `dollar-coins`.
- Each subtotal span: `data-testid="subtotal-{denomination}"`
- Total cents display: `data-testid="total-cents"`
- Total dollars display: `data-testid="total-dollars"`
- Reset button: `data-testid="reset-btn"`
- Count button: `data-testid="count-btn"`

## Edge Cases
- Negative quantities: treat as 0 (use Math.max(0, value)).
- Non-integer input: floor to integer.
- All zeros: show "Total: $0.00".
