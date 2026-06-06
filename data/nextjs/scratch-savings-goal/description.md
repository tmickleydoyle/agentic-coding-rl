# Savings Goal Calculator

## Overview
A single-page savings goal calculator. The user enters a savings target, current savings, a monthly contribution amount, and an annual interest rate. The app calculates how many months to reach the goal and the total interest earned.

## Form Fields
- **Goal Amount ($)** (number input, aria-label="Goal Amount"): target savings amount. Must be positive.
- **Current Savings ($)** (number input, aria-label="Current Savings"): amount already saved. Must be >= 0. Default: 0.
- **Monthly Contribution ($)** (number input, aria-label="Monthly Contribution"): amount added each month. Must be > 0.
- **Annual Interest Rate (%)** (number input, aria-label="Annual Interest Rate"): yearly interest rate applied monthly. Must be >= 0. Default: 0.

## Derived Values (data-testid)
- `data-testid="months-to-goal"`: integer number of months to reach or exceed the goal. Show "--" if inputs are invalid or goal already reached.
- `data-testid="total-contributed"`: total amount personally contributed (initial savings + monthly contributions * months). Formatted as "$X.XX". Show "$0.00" if invalid.
- `data-testid="total-interest"`: total interest earned over the saving period. Formatted as "$X.XX". Show "$0.00" if invalid.
- `data-testid="final-amount"`: projected amount at end of saving period. Formatted as "$X.XX". Show "$0.00" if invalid.

## Calculation Algorithm
Compound interest applied monthly:
- r = annualRate / 100 / 12
- Each month: balance = balance * (1 + r) + monthlyContribution
- Count months until balance >= goalAmount
- If current savings >= goal: months = 0, show a message (or 0 in months-to-goal).
- Cap iterations at 1200 months (100 years) to avoid infinite loop.

## Interactions
- Outputs update live as any input changes.
- A **Reset** button (role="button", name=/reset/i) clears all inputs to empty and resets all outputs to "--" / "$0.00".
- If current savings already meet or exceed goal: show 0 in months-to-goal, and display actual values.

## Edge Cases
- No monthly contribution entered → show "--" for months (cannot reach goal with 0 contribution unless already met).
- Goal = 0 → show 0 months, $0.00 interest, final = current savings.
- Very high interest rate should still compute correctly.
- If goal is unreachable within 1200 months, show ">1200" in months-to-goal.
