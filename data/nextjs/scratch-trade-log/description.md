# Fantasy Trade Log

A single-page app for tracking fantasy sports trades. Users can log trades between teams, view trade history, and filter by team.

## Seed Data

### Initial Trades
| id | date | teamGave | playersGave | teamGot | playersGot | status |
|----|------|----------|-------------|---------|------------|--------|
| 1 | 2024-09-15 | My Team | Patrick Mahomes | Team Chaos | Justin Jefferson, Davante Adams | Accepted |
| 2 | 2024-09-22 | My Team | Saquon Barkley, Diontae Johnson | Team Alpha | Travis Kelce | Accepted |
| 3 | 2024-10-01 | My Team | Jaylen Waddle | Team Beta | Dalvin Cook | Pending |

## Fields
- Trade date (YYYY-MM-DD)
- Team gave (always "My Team")
- Players gave (comma-separated names)
- Team got (opponent team name)
- Players got (comma-separated names)
- Status: Pending | Accepted | Rejected

## Behaviors
1. Display heading "Trade Log" at the top.
2. Show all trades in a table with columns: Date, Sent, Received, Opponent, Status.
3. "Sent" column shows the players given away. "Received" shows players received.
4. Each trade row has a data-testid of `trade-row-{id}`.
5. Status is shown as a colored badge: Accepted=green, Pending=yellow, Rejected=red.
6. A form at the top allows logging a new trade: fields for Date, Players Gave, Opponent Team, Players Got, Status (select).
7. Submitting the form adds a new trade to the list. Form clears after submission.
8. A filter dropdown "Filter by Status" with options All, Pending, Accepted, Rejected filters the table.
9. Trade count shown as "Trades: {N}" updating with filter.

## Edge Cases
- Empty players gave or players got fields should prevent form submission (show no error, just not submit).
- Date field is required.
- Filter shows only trades matching selected status; "All" shows all.
