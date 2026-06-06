# Fantasy Standings Table

A single-page app showing fantasy league standings. Users can view team rankings, sort by different columns, and see weekly matchup results.

## Seed Data

### Teams (standings)
| id | team | manager | wins | losses | ties | pointsFor | pointsAgainst | streak |
|----|------|---------|------|--------|------|-----------|---------------|--------|
| 1 | Thunder Hawks | Alice | 7 | 2 | 0 | 1245.6 | 1102.3 | W3 |
| 2 | Grid Iron Kings | Bob | 6 | 3 | 0 | 1198.4 | 1089.7 | W1 |
| 3 | Blitz Brigade | Carol | 6 | 3 | 0 | 1178.2 | 1134.5 | L1 |
| 4 | End Zone Elite | Dave | 5 | 4 | 0 | 1156.8 | 1120.0 | W2 |
| 5 | Red Zone Raiders | Eve | 4 | 5 | 0 | 1098.3 | 1178.9 | L2 |
| 6 | Touchdown Titans | Frank | 3 | 6 | 0 | 1034.7 | 1189.2 | L3 |
| 7 | Field Goal Force | Grace | 3 | 6 | 0 | 1022.1 | 1201.5 | W1 |
| 8 | Fumble Factory | Hank | 2 | 7 | 0 | 987.4 | 1245.6 | L4 |

## Fields
- Rank (derived from current sort), team name, manager, W-L-T record, points for, points against, streak

## Behaviors
1. Display heading "League Standings" at the top.
2. Show all 8 teams in a table with columns: Rank, Team, Manager, W, L, T, PF, PA, Streak.
3. Default sort is by wins descending, then points for descending as tiebreaker.
4. Clicking column headers for W, L, PF, PA re-sorts the table (toggle asc/desc on repeated click).
5. Each row has data-testid `team-row-{id}`.
6. The rank column shows the current position (1-indexed) in the sorted order.
7. A "Playoff Picture" section below the table shows the top 4 teams (playoff spots) highlighted.
8. Playoff teams list uses data-testid `playoff-team-{rank}` (rank 1-4).
9. Points are displayed with one decimal place.
10. Active sort column header shows an arrow indicator: "↑" for ascending, "↓" for descending.

## Edge Cases
- Ties in wins are broken by points for (descending).
- Re-clicking the same column toggles sort direction.
- Playoff Picture updates when sort changes the top 4 (always shows top 4 by current sort order).
