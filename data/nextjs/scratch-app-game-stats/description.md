# scratch-app-game-stats

A multi-route game statistics tracker for players and games.

## Routes
- `/` — Games: list games, add game (title, date, opponent, ourScore, theirScore)
- `/players` — Players: add (name, number, position) / remove player
- `/leaderboard` — Leaderboard: list players sorted by totalPoints desc (computed from player stats)

## Seed Data
Players:
- id:1 name:"Jordan Lee" number:10 position:"Forward" totalPoints:24
- id:2 name:"Sam Park" number:7 position:"Midfielder" totalPoints:18
- id:3 name:"Riley Chen" number:3 position:"Defender" totalPoints:6

Games:
- id:1 title:"Season Opener" date:"2024-09-01" opponent:"Rivals FC" ourScore:3 theirScore:1
- id:2 title:"Home Derby" date:"2024-09-08" opponent:"City United" ourScore:2 theirScore:2

## Behaviors
- Games page: add game (title, date, opponent, ourScore>=0, theirScore>=0), list all
- Players page: add player (name, number>0, position), remove
- Leaderboard: sorted by totalPoints desc, show rank, name, number, totalPoints
- API GET /api/stats returns players with stats; POST /api/stats updates a player's totalPoints

## Edge Cases
- Scores must be >= 0
- Player number must be > 0
- Leaderboard rank starts at 1
