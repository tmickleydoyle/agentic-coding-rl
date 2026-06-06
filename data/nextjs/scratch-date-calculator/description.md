# Date Calculator

## Overview
A two-mode date utility app:
1. **Difference** mode: compute the number of days (and optionally weeks/months/years) between two dates.
2. **Add/Subtract** mode: add or subtract a number of days from a given date and show the result.

## Mode Toggle
- Two buttons to switch modes: "Difference" and "Add / Subtract" (role="button").
- Default mode: **Difference**.

## Mode 1: Difference
### Fields
- **Start Date** (date input, aria-label="Start Date"): first date.
- **End Date** (date input, aria-label="End Date"): second date.

### Derived Values
- `data-testid="diff-days"`: absolute difference in days (integer). Show "--" if either date is empty/invalid.
- `data-testid="diff-weeks"`: Math.floor(days / 7), with remainder shown as "X weeks Y days". Show "--" if not available.
- `data-testid="diff-summary"`: human-readable string: e.g. "42 days (6 weeks, 0 days)". Show "--" if not available.

End date can be before start date — always show absolute value.

## Mode 2: Add / Subtract
### Fields
- **Base Date** (date input, aria-label="Base Date"): the starting date.
- **Days** (number input, aria-label="Days"): number of days to add (positive) or subtract (negative).

### Derived Values
- `data-testid="result-date"`: resulting date formatted as "Month DD, YYYY" (e.g. "January 15, 2025"). Show "--" if base date is empty or days is not a valid integer.

## Interactions
- All outputs update live as inputs change.
- Switching modes clears all inputs and resets all output displays to "--".
- A **Reset** button (role="button", name=/reset/i) clears all inputs in the current mode and resets outputs to "--". Does NOT change mode.

## Edge Cases
- Same start and end date → 0 days.
- Adding 0 days → result is same as base date.
- Negative days in Add/Subtract mode → subtracts from base date.
- Leap year dates should work correctly via Date arithmetic.
