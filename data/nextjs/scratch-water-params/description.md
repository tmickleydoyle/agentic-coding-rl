# Water Parameter Recorder

Build a single-page water parameter recorder where users log water chemistry readings per tank and see safe/warning status indicators.

## Seed Data

Pre-populate with these readings on load:

| id | tank       | ph  | ammonia | nitrite | nitrate | date       |
|----|------------|-----|---------|---------|---------|------------|
| 1  | Reef Tank  | 8.2 | 0.0     | 0.0     | 5.0     | 2024-01-10 |
| 2  | Freshwater | 7.0 | 0.25    | 0.0     | 20.0    | 2024-01-11 |
| 3  | Reef Tank  | 8.3 | 0.0     | 0.05    | 2.0     | 2024-01-12 |

## Safe Ranges (used for status indicators)

| Parameter | Safe range        |
|-----------|-------------------|
| pH        | 6.5 – 8.5         |
| Ammonia   | 0.0 – 0.25 ppm    |
| Nitrite   | 0.0 – 0.1 ppm     |
| Nitrate   | 0.0 – 40.0 ppm    |

A reading is "safe" if ALL parameters are within their safe ranges, otherwise "warning".

## Fields

Each reading has:
- **id**: unique number (auto-increment)
- **tank**: string (selected from dropdown)
- **ph**: number
- **ammonia**: number (ppm)
- **nitrite**: number (ppm)
- **nitrate**: number (ppm)
- **date**: string YYYY-MM-DD

## Available Tanks
- Reef Tank
- Freshwater
- Quarantine
- Planted

## UI Layout

1. **Heading**: "Water Parameters" as an `<h1>`
2. **Add Reading form**:
   - Label "Tank" + `<select>`, `data-testid="tank-select"`
   - Label "pH" + `<input type="number" step="0.1">`, `data-testid="ph-input"`
   - Label "Ammonia (ppm)" + `<input type="number" step="0.01">`, `data-testid="ammonia-input"`
   - Label "Nitrite (ppm)" + `<input type="number" step="0.01">`, `data-testid="nitrite-input"`
   - Label "Nitrate (ppm)" + `<input type="number" step="0.1">`, `data-testid="nitrate-input"`
   - Label "Date" + `<input type="date">`, `data-testid="date-input"`
   - Submit `<button>` "Record Reading", `data-testid="record-button"`
3. **Filter by tank**: `<select>` with "All" + tank names, `data-testid="filter-select"`
4. **Readings list**: `data-testid="readings-list"` — one item per reading matching filter:
   - `data-testid="reading-{id}"` wrapping each
   - `data-testid="reading-tank-{id}"` — tank name
   - `data-testid="reading-ph-{id}"` — pH value
   - `data-testid="reading-ammonia-{id}"` — ammonia value
   - `data-testid="reading-nitrite-{id}"` — nitrite value
   - `data-testid="reading-nitrate-{id}"` — nitrate value
   - `data-testid="reading-date-{id}"` — date
   - `data-testid="reading-status-{id}"` — shows "safe" or "warning"
   - Delete button `data-testid="delete-{id}"`

## Behaviors

- **Status**: compute per-reading — "safe" if all 4 params in range, else "warning".
- **Add**: all numeric fields required (non-empty); if any are empty/invalid do not add. Clears numeric inputs after success.
- **Filter**: filter dropdown restricts visible readings.
- **Delete**: removes the reading.
- **Count**: `data-testid="reading-count"` shows visible count e.g. "3 readings".

## Edge Cases

- Boundary values (e.g. ammonia = 0.25) are considered safe (inclusive).
- Filtering then adding a reading for a hidden tank: count reflects only visible items.
- All inputs remain after a failed submission attempt.
