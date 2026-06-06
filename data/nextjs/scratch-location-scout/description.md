# Location Scout Tracker

A single-page app to log and rate potential photography locations.

## Seed Data

Start with these three locations pre-loaded:

| id | name             | address                  | access   | lighting        | rating |
|----|------------------|--------------------------|----------|-----------------|--------|
| 1  | Rooftop Garden   | 123 Main St, NYC         | Public   | Great at sunset | 5      |
| 2  | Old Railway Yard | 45 Industrial Ave, BK    | Permit   | Overcast only   | 3      |
| 3  | Waterfront Pier  | Pier 17, Manhattan       | Public   | Morning golden  | 4      |

## Fields

- **Name** (text input, required)
- **Address** (text input, required)
- **Access** (select: "Public" | "Permit" | "Private")
- **Lighting Notes** (textarea, optional)
- **Rating** (number input, 1–5, required)

## Behaviors

1. The page renders a heading "Location Scout".
2. All seed locations are displayed in a list on load.
3. Each location shows name, address, access type, lighting notes, and star rating.
4. A form allows adding new locations.
5. Submitting a valid form appends the location and clears inputs.
6. Name, address, and rating (1–5) are required. Rating outside 1–5 prevents submission.
7. Each location has a Delete button.
8. Locations can be sorted: a "Sort by Rating" button toggles between default order and sorted by rating descending.
9. A count shows "X locations".
10. The average rating is shown as "Avg rating: X.X" (one decimal place). If no locations, show "Avg rating: —".

## Edge Cases

- Rating of 0 or 6 should not submit.
- After deleting all locations, avg rating shows "Avg rating: —".
- Sort toggle should update button text: "Sort by Rating" ↔ "Sort by Default".
