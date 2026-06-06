# Energy Usage Tracker

A single-page app for tracking monthly household energy usage across multiple sources.

## Seed Data

Pre-load these 5 entries on mount:

| Month   | Source      | kWh  | Cost ($) |
|---------|-------------|------|----------|
| 2024-01 | Electricity | 320  | 48.00    |
| 2024-01 | Gas         | 150  | 22.50    |
| 2024-02 | Electricity | 295  | 44.25    |
| 2024-02 | Gas         | 130  | 19.50    |
| 2024-03 | Electricity | 310  | 46.50    |

## Fields

- **Month** (month input `type="month"`, required)
- **Source** (select: "Electricity" | "Gas" | "Solar" | "Water", required)
- **kWh** (number input, required, min 0)
- **Cost** (number input, required, min 0, represents dollars)

## Behaviors

### Add Entry
- Form with Month, Source, kWh, Cost and "Add Entry" button.
- On submit: validate all fields are filled; if invalid show error "All fields are required".
- kWh and Cost must be >= 0; if either is negative show "Values must be non-negative".
- On valid submit: append entry to list, clear form (Source resets to "Electricity").

### Entry List
- Display all entries sorted by month descending then by source alphabetically.
- Each row shows: month, source, kWh, cost formatted as "$XX.XX".
- Each entry has a "Delete" button.

### Summary Panel
- Total kWh across all entries (1 decimal).
- Total cost across all entries formatted as "$X.XX" (2 decimal places).
- Number of entries.

### Source Filter
- A select dropdown (including "All" option) to filter displayed entries by source.
- Stats always reflect all entries regardless of filter.

## Edge Cases
- Zero kWh and zero cost are valid entries.
- Duplicate month + source combinations are allowed.
- Deleting all entries shows empty list and zeroed stats ("$0.00").
