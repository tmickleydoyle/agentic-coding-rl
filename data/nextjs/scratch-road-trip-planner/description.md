# Road Trip Planner

A single-page React app to plan road trips by managing a list of stops, estimating driving distances, and calculating total trip cost.

## Seed Data

Start with these 3 stops pre-loaded (representing a California coast trip):

```
id: 1, city: "San Francisco", state: "CA", miles: 0, fuel: 0, hotel: 150, notes: "Start"
id: 2, city: "Monterey", state: "CA", miles: 120, fuel: 18, hotel: 130, notes: "17-Mile Drive"
id: 3, city: "Los Angeles", state: "CA", miles: 340, fuel: 51, hotel: 200, notes: "End"
```

## Fields

- **city** (text, required): City name
- **state** (text, required): State abbreviation (2 chars)
- **miles** (number, required): Miles from previous stop (0 for first stop, non-negative)
- **fuel** (number, required): Estimated fuel cost for leg in dollars (non-negative)
- **hotel** (number, required): Hotel cost for one night in dollars (non-negative)
- **notes** (text, optional): Any notes about this stop

## Behaviors

### Add Stop
- A form with inputs for all fields (notes optional).
- Clicking "Add Stop" validates required fields. Miles, fuel, hotel must be >= 0. City and state must be non-empty.
- If invalid, show "Please fill in all required fields".
- On success, append to list and clear form.
- Auto-increment ids.

### Display Itinerary
- Show all stops in order as a table/list.
- Columns: city, state, miles (to this stop), fuel cost, hotel cost, notes.
- Each row has data-testid="stop-row".
- Miles shown as "X mi" (e.g., "120 mi").
- Costs shown as "$X.XX".

### Delete Stop
- Each row has data-testid="delete-btn-{id}".

### Reorder Stops (Move Up / Move Down)
- Each row has "Move Up" (data-testid="move-up-{id}") and "Move Down" (data-testid="move-down-{id}") buttons.
- "Move Up" swaps with previous stop (disabled/no-op for first stop).
- "Move Down" swaps with next stop (disabled/no-op for last stop).

### Trip Summary
- Total miles: data-testid="total-miles" shown as "X mi"
- Total fuel cost: data-testid="total-fuel" shown as "$X.XX"
- Total hotel cost: data-testid="total-hotel" shown as "$X.XX"
- Total trip cost (fuel + hotel): data-testid="total-cost" shown as "$X.XX"
- Number of stops: data-testid="stop-count"

### Search/Filter
- A text input (data-testid="search-input") filters stops by city name (case-insensitive).
- Filtering changes visible rows only; summary stats always reflect all stops.

## Edge Cases
- With 0 stops: all totals show "$0.00" or "0 mi", stop-count = 0.
- First stop typically has 0 miles but any non-negative value is valid.
- Moving the only stop does nothing.
