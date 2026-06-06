# Listen Log

A single-page app for logging podcast listening sessions with date, rating, and thoughts.

## Seed Data

Start with the following log entries pre-loaded:

| id | show | episode | date | rating | thoughts |
|----|------|---------|------|--------|----------|
| 1 | "The Daily" | "The Election Results" | "2024-11-06" | 5 | "Excellent breakdown of the results" |
| 2 | "Stuff You Should Know" | "How Caves Work" | "2024-11-04" | 4 | "Very informative" |
| 3 | "My Favorite Murder" | "Mini Morbid Update" | "2024-11-01" | 3 | "Lighter episode, still fun" |

## Fields

Each log entry has:
- **id**: unique number
- **show**: podcast show name (string)
- **episode**: episode title (string)
- **date**: date listened in YYYY-MM-DD format (string)
- **rating**: 1–5 star rating (number)
- **thoughts**: brief listener thoughts (string)

## UI Layout

- Heading: "Listen Log"
- A form with labeled inputs: "Show", "Episode", "Date", "Rating" (number 1-5), "Thoughts"
- A "Log Episode" button to submit
- A list of log entry cards, each displaying all fields
- Each card has a "Delete" button
- A summary line: `data-testid="log-count"` showing "X entries"
- An average rating display: `data-testid="avg-rating"` showing "Avg: X.X" (one decimal, or "Avg: 0.0" when empty)

## Behaviors

1. **Log episode**: fill all fields, click "Log Episode" — new card appears, form clears.
2. **Validation**: if any field is empty, or rating is not a number between 1 and 5, show error "Invalid input" with `data-testid="error-message"`. Do not add.
3. **Delete**: removes the entry; updates count and average.
4. **Average rating**: computed from all current entries, displayed to one decimal place.

## data-testid Attributes

- `data-testid="log-card"` on each entry card
- `data-testid="log-show"` for the show name
- `data-testid="log-episode"` for the episode title
- `data-testid="log-date"` for the date
- `data-testid="log-rating"` for the rating value
- `data-testid="log-thoughts"` for the thoughts text
- `data-testid="log-count"` for total entries
- `data-testid="avg-rating"` for average rating
- `data-testid="error-message"` for validation error

## Edge Cases

- Whitespace-only fields count as empty.
- Rating must be integer 1–5 inclusive; reject 0, 6, or non-numeric.
- Average updates immediately after add or delete.
- With no entries, average is "Avg: 0.0".
