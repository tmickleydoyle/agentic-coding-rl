# scratch-app-competition-log

A multi-route competition log for tracking sporting competitions, results, rankings, and history.

## Routes
- `/` — Competitions: add/delete competitions (name, sport, date, location)
- `/results` — Results: add results for a selected competition (athleteName, place, score, notes)
- `/rankings` — Rankings: across all competitions, show top 3 finishers (place = 1/2/3) aggregated by athlete name with total podium appearances
- `/history` — History: all competitions listed with their results

## Seed Data
Two competitions:
1. { id: "c1", name: "Regional Championship", sport: "Swimming", date: "2024-05-20", location: "City Pool", results: [{ id: "r1", athleteName: "Alice", place: 1, score: "58.2s", notes: "" }, { id: "r2", athleteName: "Bob", place: 2, score: "59.1s", notes: "" }] }
2. { id: "c2", name: "State Open", sport: "Swimming", date: "2024-07-14", location: "State Aquatic Center", results: [{ id: "r3", athleteName: "Alice", place: 1, score: "57.8s", notes: "New PR" }] }

## Behaviors
- Competitions page: add competition (name, sport, date, location); delete; click to select active
- Results page: show "No active competition" if none selected; add result to active competition
- Rankings page: count podium (place 1-3) appearances per athlete across all competitions; show sorted by count descending
- History page: list all competitions with results

## API
POST /api/competitions — body { name, sport, date, location } → adds competition, returns competition
GET /api/competitions — returns all competitions

## Edge Cases
- Competition name must be non-empty
- Place must be >= 1
- athleteName must be non-empty for results
