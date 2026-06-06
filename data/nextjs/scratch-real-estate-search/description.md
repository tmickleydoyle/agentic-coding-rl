# Real Estate Search

A single-page app for searching and filtering real estate listings.

## Seed Data

Six listings pre-loaded:

| id | address | city | price | bedrooms | bathrooms | sqft | type |
|----|---------|------|-------|----------|-----------|------|------|
| 1 | 123 Maple St | Austin | 450000 | 3 | 2 | 1800 | House |
| 2 | 456 Oak Ave | Denver | 320000 | 2 | 1 | 1100 | Condo |
| 3 | 789 Pine Rd | Austin | 675000 | 4 | 3 | 2600 | House |
| 4 | 101 Elm Blvd | Seattle | 540000 | 3 | 2 | 1950 | Townhouse |
| 5 | 202 Cedar Ln | Denver | 280000 | 1 | 1 | 750 | Condo |
| 6 | 303 Birch Way | Seattle | 890000 | 5 | 4 | 3400 | House |

## Fields Displayed per Listing

- Address, city, price (formatted as $XXX,XXX), bedrooms, bathrooms, sqft, type

## Filter Controls

1. **City dropdown** — options: "All Cities", "Austin", "Denver", "Seattle". Filters listings by city.
2. **Min Bedrooms** — number input (min 1, default empty = no filter). Only shows listings with bedrooms >= value.
3. **Max Price** — number input (default empty = no filter). Only shows listings with price <= value.

## Behaviors

- Filters are applied simultaneously (all active filters AND together).
- When no listings match, show a message "No listings found" (data-testid="no-results").
- Listing count shown as "X listings" (data-testid="listing-count") where X is the number currently visible.
- Each listing card has data-testid="listing-card".
- Price displayed as formatted currency (e.g. $450,000).
- Clearing a filter (empty input / "All Cities") removes it.

## Edge Cases

- Max Price of 0 should show no listings.
- Min Bedrooms of 6 should show no listings ("No listings found").
- Setting city to Austin and max price 500000 shows only listing 1 (not listing 3 at $675k).
