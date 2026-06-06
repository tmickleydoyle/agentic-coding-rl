# Rent Calculator

A single-page React app that calculates total monthly housing costs and affordability.

## Seed Data

Pre-filled defaults on load:

| Field | Default |
|-------|---------|
| Monthly Income | 5000 |
| Base Rent | 1400 |
| Utilities | 150 |
| Parking | 75 |
| Pet Fee | 0 |
| Renters Insurance | 20 |

## UI Layout

- `<h1>` with text "Rent Calculator"
- A form section with labeled inputs:
  - "Monthly Income" (number)
  - "Base Rent" (number)
  - "Utilities" (number)
  - "Parking" (number)
  - "Pet Fee" (number)
  - "Renters Insurance" (number)
- A "Calculate" button
- Results section (shown after calculate is clicked):
  - `data-testid="total-cost"` — "Total Monthly Cost: $N" where N is sum of all expense fields (no income)
  - `data-testid="income-ratio"` — "Rent-to-Income Ratio: X%" where X is (base rent / monthly income * 100) rounded to 1 decimal
  - `data-testid="affordability"` — "Affordability: [status]"
    - "Affordable" if rent-to-income ratio <= 30%
    - "Borderline" if > 30% and <= 40%
    - "Unaffordable" if > 40%
  - `data-testid="monthly-remaining"` — "Monthly Remaining: $N" where N is monthly income minus total monthly cost
- A "Reset" button that restores all fields to defaults and hides the results section

## Behaviors

- Results are hidden on initial load; shown after clicking "Calculate".
- All inputs accept numbers >= 0.
- If monthly income is 0, ratio shows "N/A" and affordability shows "N/A".
- Clicking "Calculate" updates results immediately.
- "Reset" clears results and restores defaults.
