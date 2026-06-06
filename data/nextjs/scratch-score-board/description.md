# Score Board

A single-page score board for a multi-player game where scores can be incremented, decremented, and reset.

## Seed Data (4 players, hardcoded)

| id | name    | score |
|----|---------|-------|
| 1  | Alice   | 0     |
| 2  | Bob     | 0     |
| 3  | Carol   | 0     |
| 4  | David   | 0     |

## Interactions

- Each player row shows their name and current score (data-testid="player-row")
- Each player row has:
  - "+" button to increment score by 1
  - "-" button to decrement score by 1 (score cannot go below 0)
  - Individual "Reset" button to reset that player's score to 0
- A "Reset All" button resets all scores to 0
- Add Player form:
  - Name input (aria-label="Player name")
  - "Add Player" button: adds player with score 0 if name is non-empty; clears input
- Each player row has a "Remove" button to remove them from the board

## Display

- Score displayed as data-testid="score" inside each player row
- Leader shown as data-testid="leader" with text "Leader: <name>" (the player with the highest score)
  - If all scores are 0 (tied at zero) or multiple players share the top score, show "Leader: Tied"
- If there are no players, show "Leader: -" instead
- Player rows are displayed in the order they were added (not sorted)
