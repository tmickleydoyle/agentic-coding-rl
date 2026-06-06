# scratch-app-fantasy-team

A multi-route fantasy sports team manager.

## Routes
- `/` — Roster: view current roster (player name, position, team, fantasyPoints), remove player
- `/waivers` — Waivers: browse waiver wire players, add player to roster (if roster < 15)
- `/standings` — Standings: view fantasy league standings (team, wins, losses, totalPoints)

## Seed Data
Roster players (on my team):
- id:1 name:"Ethan Moore" position:"QB" nflTeam:"Eagles" fantasyPoints:312 onRoster:true
- id:2 name:"Lila Grant" position:"RB" nflTeam:"Chiefs" fantasyPoints:278 onRoster:true
- id:3 name:"Noah Flynn" position:"WR" nflTeam:"Cowboys" fantasyPoints:245 onRoster:true

Waiver players (not on roster):
- id:4 name:"Sofia Banks" position:"TE" nflTeam:"Ravens" fantasyPoints:180 onRoster:false
- id:5 name:"Caleb Stone" position:"K" nflTeam:"Packers" fantasyPoints:95 onRoster:false

League standings:
- id:1 teamName:"My Team" wins:5 losses:2 totalPoints:835
- id:2 teamName:"Rivals" wins:4 losses:3 totalPoints:780
- id:3 teamName:"Underdogs" wins:3 losses:4 totalPoints:710

## Behaviors
- Roster page: shows onRoster players, can drop (remove from roster, puts on waivers)
- Waivers: shows !onRoster players, can add (sets onRoster:true); blocks if roster >= 15
- Standings: sorted by wins desc (ties broken by totalPoints desc)
- API GET /api/roster returns roster players; POST /api/roster {playerId} adds to roster

## Edge Cases
- Roster max 15 players
- Cannot add player already on roster
