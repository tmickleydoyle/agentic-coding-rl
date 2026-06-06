# Movie Log

A single-page movie watchlist where users can log movies, rate them, and filter/sort the list.

## Seed Data (4 movies, hardcoded)

| id | title              | genre   | year | rating |
|----|--------------------|---------|------|--------|
| 1  | The Matrix         | Sci-Fi  | 1999 | 5      |
| 2  | Inception          | Sci-Fi  | 2010 | 4      |
| 3  | The Godfather      | Drama   | 1972 | 5      |
| 4  | Knives Out         | Mystery | 2019 | 4      |

## Form Fields

- Title (text input, aria-label="Title")
- Genre (select, aria-label="Genre", options: Sci-Fi, Drama, Action, Comedy, Horror, Mystery, Other)
- Year (number input, aria-label="Year", must be between 1888 and 2100 inclusive)
- Rating (select, aria-label="Rating", options: 1, 2, 3, 4, 5 — representing stars)
- "Add Movie" button

## Interactions

- "Add Movie": validates title non-empty AND year between 1888–2100; if valid appends movie and clears form (title="", genre="Sci-Fi", year="", rating="3")
- Invalid (empty title or out-of-range year) does nothing
- Each movie row has a "Remove" button that deletes it
- Genre filter select (aria-label="Filter genre") with options: All + the 7 genres; filters visible rows
- Sort select (aria-label="Sort by") with options: "Year (newest)", "Year (oldest)", "Rating (highest)", "Rating (lowest)", "Title (A-Z)"; default "Year (newest)"

## Display

- Each movie row has data-testid="movie-row"
- Each row shows: title, genre, year, rating as "★ X"
- Average rating shown as data-testid="avg-rating" with text "Avg: X.X ★" (computed over ALL movies, not just visible; formatted to 1 decimal)
- Total count shown as data-testid="movie-count" with text "X movies"  (count of visible movies)
