# Loan Calculator

## Overview
A single-page loan/mortgage calculator. The user enters loan parameters and the app computes the monthly payment, total amount paid, and total interest charged.

## Form Fields
- **Loan Amount ($)** (number input, aria-label="Loan Amount"): principal in dollars. Must be positive.
- **Annual Interest Rate (%)** (number input, aria-label="Annual Interest Rate"): yearly rate as a percentage (e.g. 5 for 5%). Must be non-negative. Zero interest is valid.
- **Loan Term (years)** (number input, aria-label="Loan Term"): duration in whole years. Must be a positive integer.

## Derived Values (data-testid)
- `data-testid="monthly-payment"`: monthly payment formatted as "$X,XXX.XX" (use toLocaleString or manual formatting). Show "$0.00" when inputs are invalid.
- `data-testid="total-payment"`: monthly payment * total months, same format.
- `data-testid="total-interest"`: total payment minus principal, same format.

## Formula
Standard amortization formula:
- r = annualRate / 100 / 12  (monthly rate)
- n = years * 12  (number of payments)
- If r > 0: monthly = principal * r * (1+r)^n / ((1+r)^n - 1)
- If r == 0: monthly = principal / n

## Interactions
- Outputs update live as user changes any input.
- A **Calculate** button (role="button", name=/calculate/i) exists but live update should also occur without it (both approaches valid; tests click the button then check results).
- A **Reset** button (role="button", name=/reset/i) clears all inputs and shows $0.00 for all derived values.

## Formatting
Use `toFixed(2)` with dollar sign prefix. Commas for thousands are not required but the "$" prefix is required.

## Edge Cases
- Missing or zero loan amount → $0.00 for all values.
- Negative interest → treat as invalid, show $0.00.
- Term of 0 → show $0.00.
- Very large loan amounts should compute correctly.
