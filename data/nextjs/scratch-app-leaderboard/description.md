# scratch-app-leaderboard

A game score leaderboard where players submit scores for different games, view global rankings, and review their personal score history.

## Routes
- **Home** (`home`) — stats: total scores submitted, distinct players, top score value and player
- **Rankings** (`rankings`) — global rankings: one row per player showing best score, game, and rank (sorted by best score desc); filter by game via select
- **Submit** (`submit`) — form: player (required), game (select: Chess / Trivia / Puzzle / Racing), score (number, required, min 0)
- **History** (`history`) — all scores submitted for the selected player (selectedPlayer in context), sorted newest first

## Seed Data
1. id:"s1", player:"alice", game:"Chess", score:1200, submittedAt:"2024-01-01T09:00:00Z"
2. id:"s2", player:"bob", game:"Trivia", score:850, submittedAt:"2024-01-01T10:00:00Z"
3. id:"s3", player:"alice", game:"Chess", score:1350, submittedAt:"2024-01-02T09:00:00Z"
4. id:"s4", player:"carol", game:"Puzzle", score:970, submittedAt:"2024-01-02T10:00:00Z"
5. id:"s5", player:"bob", game:"Chess", score:900, submittedAt:"2024-01-03T09:00:00Z"

## Behaviors
- **List scores**: GET /api/scores → 200 [{...scores}] sorted newest first
- **Get score**: GET /api/scores/[id] → 200 {score} or 404
- **Submit score**: POST /api/scores body {player,game,score} → 201 {score}; missing/invalid → 400
- **Rankings**: derived client-side — group by player, take best score per player, sort by best score desc
- Game filter on Rankings page: dropdown with "All" + game names; filters rows by game
- Clicking player name on rankings navigates to history route and sets selectedPlayer in context
- History page shows all entries for selectedPlayer sorted by submittedAt desc
- Submit form clears and shows success on submit

## Edge Cases
- Score < 0 should be rejected (400)
- Submit with missing player shows inline error
- Rankings with game filter "Chess" shows only players with chess scores
- History page with no selectedPlayer shows "No player selected"
- All games filter shows all players in rankings
