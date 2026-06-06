# Filament Stock Tracker

A single-page app for tracking 3D printer filament inventory. Users can view current stock, add new filament spools, update remaining weight, and remove spools.

## Seed Data

Start with these 4 filament spools:

| id | brand    | material | color     | weight_g (total) | remaining_g | price_usd |
|----|----------|----------|-----------|------------------|-------------|-----------|
| 1  | Hatchbox | PLA      | Black     | 1000             | 800         | 22.99     |
| 2  | eSUN     | PETG     | Clear     | 1000             | 450         | 24.99     |
| 3  | Prusament| PLA      | Galaxy Silver | 1000         | 1000        | 29.99     |
| 4  | Hatchbox | ABS      | White     | 1000             | 200         | 21.99     |

## Fields

- **brand** (string, required)
- **material** (string, required) — e.g. PLA, PETG, ABS
- **color** (string, required)
- **weight_g** (number, required) — total spool weight in grams (positive integer)
- **remaining_g** (number, required) — grams remaining (0 to weight_g)
- **price_usd** (number, required) — price in USD (positive)

## UI Layout

- Heading: "Filament Stock"
- Form to add a new spool: inputs for brand, material, color, weight (g), remaining (g), price (USD), and an "Add Spool" button
- List of spools. Each spool row shows:
  - `data-testid="spool-brand-{id}"` — brand name
  - `data-testid="spool-material-{id}"` — material
  - `data-testid="spool-color-{id}"` — color
  - `data-testid="spool-remaining-{id}"` — remaining grams
  - `data-testid="spool-percent-{id}"` — percentage remaining rounded to nearest integer (e.g. "80%")
  - A number input for updating remaining grams: `data-testid="spool-remaining-input-{id}"`
  - "Update" button: `data-testid="spool-update-{id}"` — sets remaining_g to the input value (clamp between 0 and weight_g)
  - "Remove" button: `data-testid="spool-remove-{id}"` — removes the spool
- Summary: `data-testid="stock-summary"` showing "X spools, Y brands" (count distinct brands)
- Low stock warning: `data-testid="low-stock-warning"` — visible only when any spool has remaining_g < 200. Text: "Low stock alert"

## Behaviors

1. **Add Spool**: Clicking "Add Spool" appends the spool with the entered values. Form resets. All fields required; remaining_g must be >= 0 and <= weight_g; weight_g and price must be > 0.
2. **Update Remaining**: User edits the number input next to a spool and clicks "Update". The remaining_g is set to the input value clamped to [0, weight_g]. The displayed remaining and percent update.
3. **Remove Spool**: Removes the spool from the list.
4. **Summary**: Counts total spools and distinct brands.
5. **Low Stock Warning**: Appears whenever at least one spool has remaining_g < 200 (strictly less).

## Edge Cases

- If remaining_g input exceeds weight_g on update, clamp to weight_g.
- If remaining_g input is negative, clamp to 0.
- Adding a spool where remaining_g > weight_g should do nothing (invalid).
- Empty brand/material/color fields prevent adding.
- Removing all spools: summary shows "0 spools, 0 brands"; no low stock warning if all removed.
