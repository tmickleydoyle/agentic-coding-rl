# Age Calculator

## Overview
A single-page age calculator. The user enters a birthdate and optionally a "calculate as of" date. The app computes the exact age in years, months, and days.

## Form Fields
- **Birth Date** (date input, aria-label="Birth Date"): the person's date of birth. Format: YYYY-MM-DD.
- **As Of Date** (date input, aria-label="As Of Date"): the reference date for age calculation. Defaults to today's date on mount. User can change it.

## Derived Values (data-testid)
- `data-testid="age-years"`: integer number of complete years.
- `data-testid="age-months"`: remaining months after full years (0–11).
- `data-testid="age-days"`: remaining days after full months (0–30).
- `data-testid="age-summary"`: human-readable string, e.g. "25 years, 3 months, 12 days".

Show "--" in all fields if birth date is empty or invalid, or if birth date is after the as-of date.

## Age Calculation Algorithm
1. Start with birthYear, birthMonth (1-indexed), birthDay.
2. Compute years = asOfYear - birthYear.
3. If (asOfMonth, asOfDay) < (birthMonth, birthDay): subtract 1 from years.
4. Compute the "last birthday" date.
5. Months: difference in months from last birthday to as-of date, modulo 12.
6. Days: remaining days from the month-adjusted date to the as-of date.

Simpler implementation acceptable as long as tests pass with realistic dates.

## Interactions
- Outputs update live as either date input changes.
- A **Reset** button (role="button", name=/reset/i) clears birth date and resets as-of date to today. All derived values show "--" (since birth date is empty).
- Birth date in the future (after as-of date) → show "--" for all values.

## Additional Display
- Show the **next birthday** date as a formatted string (e.g. "June 15, 2026") in `data-testid="next-birthday"`. If today is the birthday, show "Today!". Show "--" if birth date is invalid.
