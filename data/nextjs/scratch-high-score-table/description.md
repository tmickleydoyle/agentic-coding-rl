# High Score Table

A single-page React app displaying an arcade game high score table. Users can add new scores, which are automatically ranked. The table shows the top 10 scores. Users can filter by player name and remove entries.

## Seed Data

Five pre-loaded entries (displayed sorted by score descending):

| player  | score | game      |
|---------|-------|-----------|
| Alice   | 9500  | SpaceRun  |
| Dave    | 8800  | SpaceRun  |
| Bob     | 7200  | SpaceRun  |
| Carol   | 6500  | SpaceRun  |
| Eve     | 5100  | SpaceRun  |

## Fields

- **player** (text input, label "Player Name") — required
- **score** (number input, label "Score") — required, must be >= 0
- **game** (text input, label "Game") — required

## Behaviors

### Add Score
- Form with inputs for player, score, game.
- Submit button labeled "Add Score".
- On submit: validate all fields non-empty and score >= 0; if invalid show error "Please fill all fields with valid data"; otherwise insert the entry and re-sort; clear form.

### Display
- Entries sorted by score descending.
- Each entry rendered as `<div data-testid="score-row">`.
- Inside: `<span data-testid="score-rank">` (1-based rank, e.g. "#1"), `<span data-testid="score-player">`, `<span data-testid="score-value">` (just the number), `<span data-testid="score-game">`.
- Top entry (rank 1) also gets `<span data-testid="top-badge">TOP</span>`.
- Total entries: `<span data-testid="score-count">{N} scores</span>`.

### Filter
- Text input labeled "Search player" (data-testid="search-input").
- Filters displayed entries to those whose player name contains the search string (case-insensitive).
- Ranks are based on global sort (not recalculated after filter).

### Delete
- Each entry has a "Remove" button (data-testid="remove-score").
- Clicking removes that entry and recalculates ranks.

### Top 10 Cap
- Only the top 10 entries by score are displayed (but all are stored; after deletion more may appear if previously hidden).
- Actually for simplicity: display at most 10 entries. If there are more than 10, show only the top 10 by score.

## Edge Cases
- Score of 0 is valid.
- After adding a score higher than Alice's 9500, the new entry becomes rank 1 and gets the TOP badge.
- After deleting rank 1, the next entry becomes rank 1 and gets TOP badge.
- Filter with no match shows 0 scores.
- Negative score shows error.
