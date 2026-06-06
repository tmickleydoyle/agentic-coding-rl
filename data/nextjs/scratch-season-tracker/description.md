# Season Tracker

A single-page React app displaying a league standings table for a sports season. Teams are shown with their record (wins, losses, draws), goal difference, and points. Users can record new match results between two teams and the standings update automatically.

## Seed Data

Six teams pre-loaded with initial records:

| Team              | W  | L  | D  | GF | GA | Points |
|-------------------|----|----|----|----|----|--------|
| Summit City FC    | 8  | 2  | 2  | 26 | 12 | 26     |
| River Rovers      | 7  | 3  | 2  | 22 | 15 | 23     |
| Valley Athletic   | 6  | 3  | 3  | 18 | 14 | 21     |
| Eastport United   | 5  | 5  | 2  | 17 | 18 | 17     |
| Harbor Hawks      | 3  | 6  | 3  | 14 | 20 | 12     |
| Coastal Wanderers | 1  | 9  | 2  | 8  | 26 | 5      |

Points = W*3 + D*1. Goal Difference (GD) = GF - GA.

## Fields per Team

- **Team**: team name (string)
- **W**: wins (integer)
- **L**: losses (integer)
- **D**: draws (integer)
- **GF**: goals for (integer)
- **GA**: goals against (integer)
- **GD**: computed as GF - GA
- **Points**: computed as W*3 + D

## UI Elements

- Page heading: "Season Tracker"
- A `<select>` for "Home Team" — `data-testid="select-home"` (options: all 6 team names)
- A `<select>` for "Away Team" — `data-testid="select-away"` (options: all 6 team names)
- Home score number input `data-testid="input-home-score"`
- Away score number input `data-testid="input-away-score"`
- "Record Result" button `data-testid="btn-record"`
- A standings table with `data-testid="standings-table"`
- Table columns: Rank, Team, W, L, D, GF, GA, GD, Points
- Each table row has `data-testid="team-row"`
- Within each row: `data-testid="row-rank"`, `"row-team"`, `"row-wins"`, `"row-losses"`, `"row-draws"`, `"row-gf"`, `"row-ga"`, `"row-gd"`, `"row-points"`
- Table always sorted by Points descending; ties broken by GD descending

## Behaviors

1. **Initial render**: 6 teams shown sorted by points (Summit City FC first, Coastal Wanderers last).
2. **Ranks**: shown as 1–6 based on current sorted position.
3. **Record result**: selecting home team, away team, and scores then clicking "Record Result" updates both teams' records.
   - Home win (home score > away score): home W+1, away L+1
   - Away win: away W+1, home L+1
   - Draw: both D+1
   - GF/GA update for both teams
   - Points recalculated
4. **Standings re-sort**: table re-sorts after recording a result.
5. **Validation**: if home team equals away team, do nothing.
6. **Points formula**: W*3 + D (loss = 0 points).

## Edge Cases

- GD can be negative.
- After a draw result, both teams gain 1 point.
- After recording a result, inputs reset to 0 scores (teams keep their selected values).
