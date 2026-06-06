# scratch-app-referee-notes

A multi-route app for referees to record match observations and flag incidents.

## Routes
- `/` — Matches: list matches, add match (homeTeam, awayTeam, date, venue)
- `/flags` — Flags: log a flag (matchId, minute, type: "foul"|"yellow"|"red"|"offside", note)
- `/reports` — Reports: view summary per match (match info, flag count, red card count)

## Seed Data
Matches:
- id:1 homeTeam:"FC United" awayTeam:"City FC" date:"2024-04-10" venue:"Main Arena"
- id:2 homeTeam:"Hawks FC" awayTeam:"Rovers" date:"2024-04-12" venue:"East Stadium"

Flags:
- id:1 matchId:1 minute:23 type:"yellow" note:"Dangerous tackle"
- id:2 matchId:1 minute:67 type:"red" note:"Second yellow"
- id:3 matchId:2 minute:5 type:"foul" note:"Hand ball"

## Behaviors
- Matches page: add/list matches
- Flags page: add flag (matchId, minute 1-90, type from list, note)
- Reports page: for each match show flag count and red card count
- API GET /api/notes returns all flags; POST adds a flag

## Edge Cases
- Minute must be 1-90
- Type must be one of: foul, yellow, red, offside
