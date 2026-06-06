# Tip Calculator

## Overview
A single-page tip calculator app that lets users enter a bill amount, choose a tip percentage, and split the total among multiple people.

## Form Fields
- **Bill Amount** (number input, aria-label="Bill Amount"): the pre-tax bill in dollars. Accepts decimals. Default value: empty.
- **Tip Percentage** (number input, aria-label="Tip Percentage"): tip as a whole-number percent. Default value: `15`.
- **Number of People** (number input, aria-label="Number of People"): how many people split the bill. Default value: `1`. Minimum: 1.

## Derived Values (shown with data-testid)
- `data-testid="tip-amount"`: total tip amount (bill * tip% / 100), formatted to 2 decimal places. Prefix with "$".
- `data-testid="total-amount"`: bill + tip, formatted to 2 decimal places. Prefix with "$".
- `data-testid="per-person"`: total-amount / number-of-people, formatted to 2 decimal places. Prefix with "$".

## Interactions
- All derived values update live as the user changes any input.
- A **Reset** button (role="button", name=/reset/i) clears bill to empty, resets tip to 15, resets people to 1, and all derived values revert accordingly (tip=$0.00, total=$0.00, per-person=$0.00).
- If bill is empty or not a positive number, show $0.00 for all derived values.
- If number of people is less than 1 or not a valid integer, treat as 1.
- Tip percentage of 0 is valid (no tip).

## Quick Tip Buttons
- Three preset buttons: **15%**, **20%**, **25%** (role="button").
- Clicking a preset sets the tip percentage input to that value and immediately updates derived values.

## Edge Cases
- Bill = 0 → all derived values are $0.00.
- Tip = 0 → tip amount is $0.00, total equals bill, per-person = bill / people.
- People = 1 → per-person equals total.
- Very large numbers should still display correctly (no special handling needed beyond toFixed(2)).
