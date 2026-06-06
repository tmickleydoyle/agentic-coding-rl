# Unit Converter

Build a single-page unit converter app that supports three categories of unit conversion.

## Categories and Units

### Length
- Millimeter (mm)
- Centimeter (cm)
- Meter (m)
- Kilometer (km)
- Inch (in)
- Foot (ft)
- Mile (mi)

### Weight
- Milligram (mg)
- Gram (g)
- Kilogram (kg)
- Ounce (oz)
- Pound (lb)

### Temperature
- Celsius (°C)
- Fahrenheit (°F)
- Kelvin (K)

## Layout

- A tab bar at the top with three tabs: "Length", "Weight", "Temperature". The active tab is highlighted.
- Below the tabs, a conversion form with:
  - A numeric input labeled "Value" for the input value
  - A select labeled "From" with all units for the active category
  - A select labeled "To" with all units for the active category
  - A "Convert" button
- A result display area showing the converted value (data-testid="result") formatted to 4 decimal places.
- A "Swap" button that swaps the From and To units without clearing the value.
- A history list at the bottom (data-testid="history-item" on each entry) showing the last 5 conversions in format: "X unit → Y unit = Z result". Newest entries appear at the top.

## Seed State
- Active category: "Length"
- From unit: "m", To unit: "ft"
- Value: ""
- Result: "" (empty until Convert is clicked)
- History: empty

## Conversion Logic

### Length (base: meter)
- mm: 0.001
- cm: 0.01
- m: 1
- km: 1000
- in: 0.0254
- ft: 0.3048
- mi: 1609.344

### Weight (base: kilogram)
- mg: 0.000001
- g: 0.001
- kg: 1
- oz: 0.0283495
- lb: 0.453592

### Temperature (special formulas)
- Celsius to Fahrenheit: (C × 9/5) + 32
- Celsius to Kelvin: C + 273.15
- Fahrenheit to Celsius: (F − 32) × 5/9
- Fahrenheit to Kelvin: (F − 32) × 5/9 + 273.15
- Kelvin to Celsius: K − 273.15
- Kelvin to Fahrenheit: (K − 273.15) × 9/5 + 32
- Same unit: identity

## Behaviors

- Clicking a different tab resets From/To to the first two units of that category and clears the result (not the value).
- Clicking "Convert" with an empty or non-numeric value does nothing.
- Clicking "Convert" appends to history (max 5 entries; oldest entry is dropped when full).
- Clicking "Swap" exchanges From and To units; if a result is already shown, clicking Convert again recalculates.
- Same-unit conversion returns the same number.
