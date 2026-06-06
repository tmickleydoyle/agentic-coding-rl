# Carbon Footprint Tracker

A single-page app for logging personal carbon-emitting activities and tracking total emissions.

## Seed Data

Pre-load these 5 entries on mount:

| Date       | Category    | Activity               | kg CO2 |
|------------|-------------|------------------------|--------|
| 2024-05-01 | Transport   | Car commute 30 km      | 5.4    |
| 2024-05-03 | Food        | Beef meal              | 6.0    |
| 2024-05-05 | Home        | AC for 8 hours         | 3.2    |
| 2024-05-07 | Transport   | Short-haul flight      | 90.0   |
| 2024-05-10 | Food        | Vegetarian meal        | 0.8    |

## Fields

- **Date** (date input, required)
- **Category** (select: "Transport" | "Food" | "Home" | "Shopping" | "Other", required)
- **Activity** (text input, description of the activity, required)
- **kg CO2** (number input, required, min 0)

## Behaviors

### Add Entry
- Form with Date, Category, Activity, kg CO2 and "Add Entry" button.
- On submit: validate all fields filled; if any missing show "All fields are required".
- kg CO2 must be >= 0; if negative show "kg CO2 must be non-negative".
- On valid submit: add entry to list, clear form (Category resets to "Transport").

### Entry List
- Display entries sorted by date descending.
- Each row shows: date, category, activity description, kg CO2 value.
- Each entry has a "Delete" button.

### Summary Panel
- Total kg CO2 across all entries (1 decimal).
- Average kg CO2 per entry (1 decimal; "0.0" if no entries).
- Count of entries.
- Highest-emission category label (the category with the most total kg CO2; "None" if no entries).

### Category Filter
- A select dropdown (including "All") to filter displayed entries by category.
- Stats always use all entries regardless of filter.

## Edge Cases
- Zero kg CO2 is a valid entry (e.g. walking).
- Deleting all entries shows "None" for highest-emission category.
- If two categories tie for highest, either is acceptable.
