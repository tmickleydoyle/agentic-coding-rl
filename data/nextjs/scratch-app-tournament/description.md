# scratch-app-tournament

A multi-route tournament bracket management app.

## Routes
- `/` — Bracket: view all matches in bracket format (round, player1, player2, winner)
- `/players` — Players: add (name, seed, country) / remove player
- `/results` — Results: record match result (matchId, winnerId), list completed results

## Seed Data
Players:
- id:1 name:"Alex Kim" seed:1 country:"USA"
- id:2 name:"Bruno Perez" seed:2 country:"BRA"
- id:3 name:"Clara Zhang" seed:3 country:"CHN"
- id:4 name:"Diana Fox" seed:4 country:"GBR"

Matches:
- id:1 round:1 player1Id:1 player2Id:2 winnerId:null
- id:2 round:1 player1Id:3 player2Id:4 winnerId:null

## Behaviors
- Bracket shows all matches with round, player names, and winner if set
- Players page: add/remove players
- Results page: select match, select winner (must be player1 or player2 of that match)
- API GET /api/matches returns all matches; POST /api/matches records a result (matchId, winnerId)

## Edge Cases
- Winner must be one of the two players in the match
- Cannot set winner on a match that doesn't exist
- Removing a player clears their match winner if they were the winner
