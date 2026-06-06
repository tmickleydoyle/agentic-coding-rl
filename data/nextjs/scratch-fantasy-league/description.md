# Fantasy League Manager

A single-page fantasy sports league management app. Users can view their team roster, add/drop players, and track weekly scores.

## Seed Data

### Players on Roster (initial)
| id | name | position | team | points |
|----|------|----------|------|--------|
| 1 | Patrick Mahomes | QB | KC | 342 |
| 2 | Derrick Henry | RB | TEN | 278 |
| 3 | Davante Adams | WR | LV | 265 |
| 4 | Travis Kelce | TE | KC | 301 |
| 5 | Justin Jefferson | WR | MIN | 289 |

### Available Players (free agents)
| id | name | position | team | points |
|----|------|----------|------|--------|
| 6 | Josh Allen | QB | BUF | 330 |
| 7 | Saquon Barkley | RB | NYG | 245 |
| 8 | Tyreek Hill | WR | MIA | 270 |
| 9 | Mark Andrews | TE | BAL | 280 |

## Fields
- Player name, position (QB/RB/WR/TE), NFL team abbreviation, total fantasy points
- Roster list and free agent list displayed separately

## Behaviors
1. Display roster heading "My Roster" with all 5 seed players listed.
2. Display free agent heading "Free Agents" with all 4 available players.
3. Each roster player has a "Drop" button. Clicking it removes the player from the roster and moves them to free agents.
4. Each free agent has an "Add" button. Clicking it moves the player to the roster.
5. The total points for the roster is displayed as "Total Points: {N}" updating as players are added/dropped.
6. Players are displayed with their position badge visible.
7. The roster player count is shown as "Roster ({N})" in the heading.

## Edge Cases
- After dropping all players the roster shows "No players on roster".
- After adding a free agent they no longer appear in the free agents list.
- Total points recalculates correctly after every add/drop.
