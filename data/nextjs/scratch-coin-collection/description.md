# Coin Collection Tracker

Build a single-page React app for tracking a coin collection.

## Seed Data

Start with these coins pre-loaded:

| id | name | country | era | year | faceValue | estimatedValue | graded |
|----|------|---------|-----|------|-----------|----------------|--------|
| 1 | Morgan Dollar | United States | Modern | 1889 | 1.00 | 85 | true |
| 2 | Roman Denarius | Rome | Ancient | 100 | 0.00 | 420 | false |
| 3 | Gold Sovereign | United Kingdom | Colonial | 1890 | 1.00 | 350 | true |
| 4 | Spanish Doubloon | Spain | Colonial | 1700 | 0.00 | 1200 | false |
| 5 | Lincoln Penny | United States | Modern | 1943 | 0.01 | 45 | false |

## Fields

Each coin has:
- `id` (number, auto-increment)
- `name` (string)
- `country` (string)
- `era` (string: Ancient | Medieval | Colonial | Modern)
- `year` (number)
- `faceValue` (number, USD)
- `estimatedValue` (number, USD)
- `graded` (boolean)

## UI Layout

1. **Header**: "Coin Collection" heading (`data-testid="heading"`)
2. **Add Coin Form** (`data-testid="add-form"`):
   - Text input for name (`data-testid="input-name"`)
   - Text input for country (`data-testid="input-country"`)
   - Select for era (`data-testid="select-era"`)
   - Number input for year (`data-testid="input-year"`)
   - Number input for estimated value (`data-testid="input-estimated-value"`)
   - Submit button labeled "Add Coin" (`data-testid="btn-add"`)
3. **Filter Bar**:
   - Select to filter by era (`data-testid="filter-era"`), default "All"
   - Checkbox to show only graded coins (`data-testid="filter-graded"`)
4. **Coin List** (`data-testid="coin-list"`):
   - Each coin rendered as a row/card with `data-testid="coin-{id}"`
   - Shows name (`data-testid="coin-name-{id}"`), country, era, year
   - Shows estimated value formatted as "$X.XX" (`data-testid="coin-value-{id}"`)
   - Shows "GRADED" badge when graded=true (`data-testid="coin-graded-{id}"`)
   - "Toggle Grade" button (`data-testid="btn-grade-{id}"`) — toggles graded true/false
   - "Remove" button (`data-testid="btn-remove-{id}"`)
5. **Summary** (`data-testid="summary"`):
   - Total coins in collection (all items)
   - Total estimated value of all coins (`data-testid="total-value"`) formatted as "$X.XX"

## Behaviors

- **Add Coin**: filling form and clicking "Add Coin" appends coin; form clears; graded defaults to false; id auto-increments.
- **Validation**: name and country must be non-empty; estimated value must be >= 0. Show error (`data-testid="form-error"`) on violation.
- **Toggle Grade**: clicking "Toggle Grade" flips graded boolean; badge appears/disappears accordingly.
- **Remove**: removes coin permanently.
- **Filter by Era**: shows only coins of selected era; "All" shows all.
- **Filter Graded**: when checked, shows only graded=true coins.
- **Filters combine**: era and graded filters apply simultaneously.
- **Summary**: reflects ALL coins regardless of filters.

## Edge Cases

- Empty name shows error "Name is required".
- Empty country shows error "Country is required".
- Negative estimated value shows error "Estimated value must be 0 or greater".
- Total value updates immediately when a coin is removed.
- A coin with estimatedValue=0 displays "$0.00".
