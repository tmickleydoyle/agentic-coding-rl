# Fantasy Draft Board

A single-page fantasy sports draft board app. Users can draft players in order, view the draft queue, and see picks by round.

## Seed Data

### Available Players (pre-draft pool)
| id | name | position | rank | adp |
|----|------|----------|------|-----|
| 1 | Christian McCaffrey | RB | 1 | 1.2 |
| 2 | Justin Jefferson | WR | 2 | 2.1 |
| 3 | Tyreek Hill | WR | 3 | 3.0 |
| 4 | Travis Kelce | TE | 4 | 3.8 |
| 5 | Stefon Diggs | WR | 5 | 4.5 |
| 6 | Josh Allen | QB | 6 | 5.0 |
| 7 | Patrick Mahomes | QB | 7 | 5.7 |
| 8 | Davante Adams | WR | 8 | 6.2 |
| 9 | Derrick Henry | RB | 9 | 7.1 |
| 10 | Mark Andrews | TE | 10 | 8.0 |

## Fields
- Player name, position, overall rank, average draft position (ADP)
- Draft pick number and round number

## Behaviors
1. Display heading "Draft Board" at the top.
2. Show all available players in a list ordered by rank, each with name, position, rank, and ADP displayed.
3. Each player has a "Draft" button. Clicking it removes the player from available and adds them to "My Picks".
4. My Picks section shows drafted players in draft order with their pick number (1, 2, 3...).
5. The current pick number is displayed as "Pick: {N}" (starts at 1, increments per draft).
6. The current round is displayed as "Round: {N}" (10 players per round, 1-indexed).
7. A filter by position: buttons for "All", "QB", "RB", "WR", "TE" filter the available list.
8. My Picks count shown as "My Picks ({N})".

## Edge Cases
- Drafting a player removes them from the available list immediately.
- Position filter applies only to available players, not picks.
- After drafting 10 players the round increments to 2.
- ADP is displayed with one decimal place.
