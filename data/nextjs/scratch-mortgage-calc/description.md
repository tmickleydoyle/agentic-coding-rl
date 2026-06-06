# Mortgage Calculator

A single-page app that calculates monthly mortgage payments and shows an amortization schedule.

## Inputs

| Field | Label | Type | Default | Notes |
|-------|-------|------|---------|-------|
| Home Price | "Home Price ($)" | number | 400000 | Must be > 0 |
| Down Payment | "Down Payment ($)" | number | 80000 | Must be >= 0 and < home price |
| Annual Interest Rate | "Annual Interest Rate (%)" | number | 6.5 | Must be > 0 |
| Loan Term | "Loan Term (years)" | select | 30 | Options: 10, 15, 20, 30 |

## Calculated Results (data-testid attributes)

- **loan-amount** — Home Price minus Down Payment, formatted $XXX,XXX
- **monthly-payment** — computed monthly P&I payment, formatted $X,XXX.XX
- **total-payment** — monthly payment * total months, formatted $XXX,XXX.XX
- **total-interest** — total payment minus loan amount, formatted $XXX,XXX.XX

Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
where P = loan amount, r = annual rate / 12 / 100, n = term years * 12.

## Amortization Table

- data-testid="amortization-table"
- Shows first 12 months (year 1) by default.
- Toggle button "Show Full Schedule" / "Hide Full Schedule" (data-testid="toggle-schedule") shows/hides all rows.
- Columns: Month, Payment, Principal, Interest, Balance.
- Each row data-testid="amort-row-{month}" (1-indexed).
- All money columns formatted to 2 decimal places.

## Behaviors

- Results recalculate immediately when any input changes.
- Down payment cannot exceed or equal home price — if it does, show "Down payment must be less than home price" (data-testid="input-error") and hide results.
- Interest rate of 0 is invalid — show same error message.
- Home price of 0 is invalid — show same error message.

## Edge Cases

- 15-year term recalculates correctly to 180 months.
- Changing interest rate updates all outputs immediately.
- Default values produce a valid calculation on load.
