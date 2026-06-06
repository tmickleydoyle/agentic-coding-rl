# Player Ratings

A single-page React app where coaches and analysts can submit performance ratings (1–5 stars) for players, view each player's average rating, and sort players by their average.

## Seed Data

Five players with initial ratings pre-loaded:

| Name            | Position | Ratings (submitted) |
|-----------------|----------|---------------------|
| Jordan Blake    | Forward  | [4, 5, 3]           |
| Riley Chen      | Midfielder | [3, 3, 4]         |
| Morgan Davis    | Defender | [5, 4, 5]           |
| Casey Kim       | Forward  | [2, 3, 2]           |
| Taylor Nguyen   | Goalkeeper | [4, 4, 3]         |

Initial averages: Jordan = 4.0, Riley = 3.33, Morgan = 4.67, Casey = 2.33, Taylor = 3.67

## Fields

- **Name**: player name (string)
- **Position**: string (Goalkeeper, Defender, Midfielder, Forward)
- **Ratings**: array of 1–5 integer ratings
- **Average**: computed as sum / count, displayed to 2 decimal places

## UI Elements

- Page heading: "Player Ratings"
- A sort control: `<select>` with label "Sort by" — options: Default, Highest Rated, Lowest Rated — `data-testid="sort-select"`
- A list of player rating cards; each has `data-testid="rating-card"`
- Within each card:
  - `data-testid="card-player-name"`: player name
  - `data-testid="card-position"`: position
  - `data-testid="card-average"`: average rating (e.g., "4.00")
  - `data-testid="card-count"`: number of ratings submitted (e.g., "3 ratings")
  - Five star buttons labeled "1", "2", "3", "4", "5" — each with `data-testid="star-N"` (N = 1..5)
- A "Submit Rating" button per card: `data-testid="btn-submit-rating"`
- An overall team average display: `data-testid="team-average"` showing average across all ratings

## Behaviors

1. **Initial render**: 5 players shown with their pre-loaded ratings and computed averages.
2. **Team average**: computed from all individual ratings across all players. Initial = (4+5+3+3+3+4+5+4+5+2+3+2+4+4+3) / 15 = 3.73 (displayed as "3.73").
3. **Submit rating**: clicking a star (1–5) then "Submit Rating" adds that rating to the player's list, recalculates average and count.
4. **Average updates**: card average and count update immediately on submit.
5. **Team average updates**: recalculated after each rating submission.
6. **Sort Highest Rated**: sorts cards by average descending.
7. **Sort Lowest Rated**: sorts cards by average ascending.
8. **Sort Default**: restores seed order.
9. **Selected star**: clicking a star highlights it (or at minimum tracks it as the selected rating for that player). Only one star active per player at a time.
10. **Submit with no star selected**: does nothing (no rating added).

## Edge Cases

- Submitting a rating resets the selected star for that card to none.
- Player with no new rating selected cannot submit.
- Average is shown to exactly 2 decimal places.
