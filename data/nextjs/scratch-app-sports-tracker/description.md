# scratch-app-sports-tracker

A multi-route sports tracker app for managing athletes and tracking their sessions.

## Routes
- `/` — Dashboard: summary cards (total athletes, total sessions, avg performance score)
- `/athletes` — Athlete list: add/remove athletes (name, sport, position)
- `/sessions` — Session log: log a session (athlete, date, duration minutes, performance score 1-10)
- (NavBar links all routes)

## Seed Data (initial store state)
Athletes:
- id:1 name:"Alice Johnson" sport:"Soccer" position:"Forward"
- id:2 name:"Bob Smith" sport:"Basketball" position:"Guard"

Sessions:
- id:1 athleteId:1 date:"2024-01-10" duration:60 score:8
- id:2 athleteId:2 date:"2024-01-11" duration:45 score:7

## Behaviors
- Dashboard shows: athlete count, session count, average score (rounded to 1 decimal)
- Adding an athlete requires name, sport, position — increments id
- Removing an athlete removes their sessions too
- Logging a session requires athleteId, date, duration (>0), score (1-10)
- API GET /api/athletes returns array; POST adds athlete; DELETE /api/athletes?id=N removes

## Edge Cases
- Score outside 1-10 is rejected
- Duration must be > 0
- Average score on dashboard shows 0.0 when no sessions
