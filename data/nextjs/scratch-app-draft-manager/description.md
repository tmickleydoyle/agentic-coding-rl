# scratch-app-draft-manager

A multi-route sports draft manager for conducting picks across multiple teams.

## Routes
- `/` — Board: shows all picks in draft order (round, pick number, team, player picked)
- `/picks` — Make Pick: select team + player to pick in next available slot
- `/teams` — Teams: add (name, owner) / remove team

## Seed Data
Teams:
- id:1 name:"Thunder" owner:"Alice"
- id:2 name:"Storm" owner:"Bob"
- id:3 name:"Blaze" owner:"Carol"

Available Players (undrafted):
- id:1 name:"Marcus Webb" position:"QB" rating:95
- id:2 name:"Derek Stone" position:"RB" rating:88
- id:3 name:"Nina Cruz" position:"WR" rating:91
- id:4 name:"Tyler Ross" position:"LB" rating:84

Picks: [] (empty initially)

## Behaviors
- Board shows picks sorted by pickNumber asc
- Next pick number starts at 1, increments
- Picking: select a teamId and playerId (not yet drafted); adds pick record
- A player can only be drafted once; rejecting duplicate drafts
- Teams page: add/remove teams
- API GET /api/picks returns all picks; POST /api/picks {teamId, playerId} makes a pick

## Edge Cases
- Cannot draft already-drafted player
- pickNumber auto-increments from 1
- round = Math.ceil(pickNumber / numberOfTeams)
