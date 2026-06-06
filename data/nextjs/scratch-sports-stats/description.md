# Sports Stats Dashboard

A single-page React app that displays a table of player statistics for a basketball team, with filtering by position and sorting by any stat column.

## Seed Data

Six players pre-loaded:

| Name            | Position | Games | Points | Rebounds | Assists | FG%  |
|-----------------|----------|-------|--------|----------|---------|------|
| Marcus Jordan   | Guard    | 32    | 24.5   | 3.2      | 7.8     | 48.2 |
| Devon Williams  | Forward  | 30    | 18.3   | 8.1      | 3.4     | 51.6 |
| Chris Okafor    | Center   | 29    | 12.7   | 11.4     | 1.2     | 55.3 |
| Layla Thompson  | Guard    | 31    | 21.0   | 4.5      | 6.3     | 44.7 |
| Sam Reyes       | Forward  | 28    | 15.6   | 7.9      | 2.8     | 49.1 |
| Tony Kowalski   | Center   | 27    | 9.4    | 13.2     | 0.9     | 58.8 |

## Fields

- **Name**: player full name (string)
- **Position**: Guard | Forward | Center
- **Games**: integer, games played
- **Points**: decimal, points per game
- **Rebounds**: decimal, rebounds per game
- **Assists**: decimal, assists per game
- **FG%**: decimal, field-goal percentage

## UI Elements

- Page heading: "Sports Stats"
- A `<select>` with label "Filter by Position" containing options: All, Guard, Forward, Center
- A stats table with columns: Name, Position, Games, Points, Rebounds, Assists, FG%
- Each column header is a clickable button that sorts by that column
- Clicking a column header sorts ascending; clicking same header again sorts descending
- An active sort indicator (▲ or ▼) appears next to the active sort column header
- Each data row has `data-testid="player-row"`
- Each cell in a row has `data-testid` matching: `cell-name`, `cell-position`, `cell-games`, `cell-points`, `cell-rebounds`, `cell-assists`, `cell-fg`
- The position filter `<select>` has `data-testid="position-filter"`
- The table has `data-testid="stats-table"`

## Behaviors

1. **Initial render**: all 6 players displayed, unsorted (seed order).
2. **Position filter**: selecting "Guard" shows only Guard players (Marcus Jordan, Layla Thompson). Selecting "All" restores all players.
3. **Sort ascending**: clicking "Points" sorts all currently-visible rows by Points ascending.
4. **Sort descending**: clicking "Points" again reverses to descending.
5. **Filter + sort combine**: filter by "Forward" then sort by Rebounds descending — shows Devon Williams (8.1) above Sam Reyes (7.9).
6. **Numeric sort**: numbers sorted numerically, not lexicographically.
7. **Default sort column**: none (seed order) until user clicks a header.

## Edge Cases

- FG% column sorts numerically.
- Switching filter resets displayed rows but preserves active sort column and direction.
- Switching sort column resets direction to ascending for the new column.
