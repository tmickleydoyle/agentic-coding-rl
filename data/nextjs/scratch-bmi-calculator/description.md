# BMI Calculator

## Overview
A single-page BMI (Body Mass Index) calculator that supports metric and imperial units and classifies the result into standard WHO categories.

## Unit Toggle
- Two radio buttons (or toggle buttons) to switch between **Metric** and **Imperial** modes.
- aria-label or role="radio" with accessible names "Metric" and "Imperial".
- Default mode: **Metric**.

## Form Fields — Metric mode
- **Weight (kg)** (number input, aria-label="Weight (kg)"): weight in kilograms.
- **Height (cm)** (number input, aria-label="Height (cm)"): height in centimeters.

## Form Fields — Imperial mode
- **Weight (lbs)** (number input, aria-label="Weight (lbs)"): weight in pounds.
- **Height (ft)** (number input, aria-label="Height (ft)"): height feet portion.
- **Height (in)** (number input, aria-label="Height (in)"): height inches portion (0–11).

## Derived Values (data-testid)
- `data-testid="bmi-value"`: computed BMI rounded to 1 decimal place (e.g. "22.5"). Show "--" if inputs are invalid or empty.
- `data-testid="bmi-category"`: WHO classification string. Show "--" if BMI not available.

## BMI Formula
- Metric: BMI = weight(kg) / (height(m))^2
- Imperial: BMI = 703 * weight(lbs) / (totalInches)^2
  where totalInches = feet * 12 + inches

## WHO Categories (inclusive lower bound, exclusive upper bound)
- BMI < 18.5 → "Underweight"
- 18.5 <= BMI < 25.0 → "Normal weight"
- 25.0 <= BMI < 30.0 → "Overweight"
- BMI >= 30.0 → "Obese"

## Interactions
- All outputs update live as inputs change.
- Switching between Metric and Imperial clears all weight/height inputs and resets bmi-value to "--" and bmi-category to "--".
- A **Reset** button (role="button", name=/reset/i) clears all inputs and resets to Metric mode; bmi-value and bmi-category show "--".

## Edge Cases
- Zero or negative inputs → show "--".
- Non-numeric or empty inputs → show "--".
- Height (in) defaults to 0 if empty (so user can enter just feet).
