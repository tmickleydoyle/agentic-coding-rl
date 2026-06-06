# Debt Tracker

Build a debt tracker where users manage debts, record payments, and monitor payoff progress.

## Seed Data

Pre-load these debts:

| Name           | Balance  | Interest Rate | Min Payment |
|----------------|----------|---------------|-------------|
| Credit Card    | 3500.00  | 19.99         | 75.00       |
| Car Loan       | 12000.00 | 5.50          | 250.00      |
| Medical Bill   | 1200.00  | 0.00          | 50.00       |

## Fields

- **Debt list**: each debt row has data-testid="debt-row"
  - Name, Balance (`$X.XX`), Interest Rate (`X.XX%`), Min Payment (`$X.XX`)
  - **Make Payment** button opens an inline payment input for that row
  - Payment amount input (aria-label="Payment for {debtName}") and **Confirm** button
  - Confirming subtracts payment from balance (minimum 0); closes input
  - If balance reaches 0, show "Paid Off" badge (data-testid="paid-off-badge") on that row
  - data-testid="debt-balance" on the balance display per row

- **Add Debt form**:
  - Text input (aria-label="Debt Name")
  - Number input (aria-label="Balance")
  - Number input (aria-label="Interest Rate")
  - Number input (aria-label="Min Payment")
  - **Add Debt** button — disabled if name is empty

- **Summary**:
  - Total Debt: sum of all current balances (data-testid="total-debt")
  - Total Min Payment: sum of all min payments (data-testid="total-min-payment")
  - Debts Remaining: count of debts with balance > 0 (data-testid="debts-remaining")

## Behaviors

- Making a payment reduces the balance by the entered amount, floored at 0.
- After confirming, payment input hides and amount clears.
- Adding a debt appends it and recalculates summary.
- All currency values shown as `$X.XX`; interest rates as `X.XX%`.
- Total debt and min payment recalculate after every payment.
- "Debts Remaining" counts only debts with balance > 0.

## Edge Cases

- Payment larger than balance sets balance to 0 (not negative).
- Empty payment input (or 0) does nothing when confirmed — balance unchanged.
- Adding a debt with empty name is prevented (button disabled).
