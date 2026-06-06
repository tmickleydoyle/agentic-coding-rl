# Studio Reviews

A single-page React app for tracking tattoo and piercing studio reviews. Users can add studios with a star rating and review text, filter by minimum rating, and delete entries.

## Seed Data

Start with these 4 studio reviews pre-loaded:

| id | studio | city | rating | review | type |
|----|--------|------|--------|--------|------|
| 1 | Ink & Iron | Portland | 5 | Incredible artists, super clean | Tattoo |
| 2 | Sacred Skin | Seattle | 4 | Great vibe, minor wait time | Piercing |
| 3 | Blackout Tattoo | Austin | 3 | Average work, good price | Tattoo |
| 4 | Body Canvas | Denver | 5 | Best piercer I have visited | Piercing |

## Fields

- **studio** (string): name of the studio
- **city** (string): city where the studio is located
- **rating** (number): 1–5 integer star rating
- **review** (string): written review text
- **type** (string): "Tattoo" or "Piercing"

## UI Behaviors

### Add Form
- Inputs for studio name, city, review text.
- A rating selector: five clickable stars or a number input 1–5 with `data-testid="rating-input"`.
- A type dropdown: "Tattoo" or "Piercing".
- "Add Review" button submits. Clear all fields after submission.
- If studio, city, or review is empty, do not submit.

### Filter by Minimum Rating
- A select/dropdown with `data-testid="min-rating-filter"` with options: "All", "2+", "3+", "4+", "5".
- Default is "All".
- Filters the list to only show reviews with `rating >= selected minimum`.

### Filter by Type
- A select/dropdown with `data-testid="type-filter"` with options: "All", "Tattoo", "Piercing".
- Default is "All".
- Both filters combine (AND logic).

### List
- Each review is a card with `data-testid="review-card"`.
- Display studio name, city, type, star rating as `data-testid="star-rating"` (e.g. "★★★★★"), and review text.
- Each card has a delete button.

### Average Rating
- Display `data-testid="average-rating"` showing the average rating of currently visible reviews, rounded to 1 decimal place. E.g. "Avg: 4.3".
- If no reviews visible, show "Avg: N/A".

## Edge Cases

- Submitting with empty studio, city, or review is a no-op.
- Filtering to a high minimum with no matching reviews shows empty list and "Avg: N/A".
- Rating must be between 1 and 5 inclusive; default to 5 if not changed.
- Both type and rating filters apply simultaneously.
