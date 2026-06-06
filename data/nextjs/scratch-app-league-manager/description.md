# scratch-app-league-manager

A multi-route league management app for organizing sports teams, schedules, and standings.

## Routes
- `/` — Standings: sorted table (team name, wins, losses, draws, points = wins*3 + draws)
- `/teams` — Teams list: add (name, city, coach) / remove team
- `/schedule` — Schedule: add match (homeTeamId, awayTeamId, date, homeScore, awayScore), list all matches
- (NavBar links all routes)

## Seed Data
Teams:
- id:1 name:"Red Lions" city:"Austin" coach:"Mike Ross"
- id:2 name:"Blue Eagles" city:"Dallas" coach:"Sarah Lee"
- id:3 name:"Green Hawks" city:"Houston" coach:"Tom Brown"

Matches:
- id:1 homeTeamId:1 awayTeamId:2 date:"2024-03-01" homeScore:2 awayScore:1
- id:2 homeTeamId:3 awayTeamId:1 date:"2024-03-05" homeScore:0 awayScore:0

## Behaviors
- Standings computed from matches: win=3pts, draw=1pt, loss=0; sorted by points desc
- Adding a team requires name, city, coach
- Adding a match requires two different team IDs, date, non-negative scores
- Removing a team removes their matches
- API GET /api/teams returns teams; POST adds team; DELETE /api/teams?id=N removes

## Edge Cases
- Scores must be >= 0
- Cannot add match with same homeTeamId and awayTeamId
- Points = wins*3 + draws*1
