# Trail Log

A single-page app for logging hiking trails that the user has completed. Users can view logged trails, add new ones, filter by difficulty, and see aggregate stats.

## Seed Data

Five trails pre-loaded:

| Name | Distance (mi) | Difficulty | Date | Rating (1-5) |
|------|--------------|------------|------|--------------|
| Eagle Peak | 6.2 | Hard | 2024-03-15 | 5 |
| River Loop | 3.1 | Easy | 2024-04-02 | 4 |
| Summit Trail | 9.8 | Hard | 2024-04-20 | 4 |
| Meadow Walk | 1.5 | Easy | 2024-05-01 | 3 |
| Ridge Line | 5.0 | Moderate | 2024-05-18 | 5 |

## Fields

- Trail name (string)
- Distance in miles (number, positive)
- Difficulty (Easy | Moderate | Hard)
- Date hiked (string, YYYY-MM-DD)
- Rating (integer 1–5)

## Behaviors

1. Display all logged trails in a list, each showing name, distance, difficulty, date, and rating (as stars: e.g. "★★★★☆" for 4).
2. A stats bar shows: total trails hiked, total miles, and average rating (rounded to 1 decimal).
3. Users can filter the list by difficulty via a dropdown with options: "All", "Easy", "Moderate", "Hard". Selecting a difficulty shows only matching trails.
4. Users can add a new trail via a form with fields for name, distance, difficulty, date, and rating. Clicking "Log Trail" appends it to the list.
5. Adding a trail with an empty name or zero/empty distance does nothing.
6. Stats (total trails, total miles, average rating) reflect only the currently filtered set.
7. Clicking "Delete" on a trail entry removes it.
8. The form is cleared after a successful add.

## Edge Cases

- If no trails match the current filter, show a message "No trails found."
- Stars display: filled stars (★) for the rating value, empty stars (☆) for the remainder up to 5.
- Distance is displayed with 1 decimal place (e.g. "6.2 mi").
- Average rating shows "—" when there are no trails in the filtered set.
