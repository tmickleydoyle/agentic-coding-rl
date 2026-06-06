# scratch-app-athlete-profile

A multi-route athlete profile manager. Users manage personal info, track metrics over time, log events, and view achievements.

## Routes
- `/` — Profile: view and edit athlete's personal info (name, sport, dateOfBirth, bio)
- `/metrics` — Metrics: add/view periodic measurements (weight kg, height cm, VO2max, date)
- `/events` — Events: add/delete events the athlete participated in (name, date, result text, place number)
- `/achievements` — Achievements: add/delete achievements (title, date, description)

## Seed Data
Athlete: { name: "Jordan Smith", sport: "Triathlon", dateOfBirth: "1995-08-20", bio: "Competitive triathlete since 2015" }

Two metrics:
1. { id: "m1", date: "2024-01-10", weight: 72.5, height: 178, vo2max: 58 }
2. { id: "m2", date: "2024-04-10", weight: 71.0, height: 178, vo2max: 61 }

Two events:
1. { id: "e1", name: "City Triathlon", date: "2024-06-15", result: "Finished strong", place: 12 }
2. { id: "e2", name: "Sprint Duathlon", date: "2024-08-01", result: "Personal best", place: 3 }

One achievement:
1. { id: "ac1", title: "Age Group Podium", date: "2024-08-01", description: "3rd in 25-29 age group" }

## Behaviors
- Profile page: shows athlete info; click Edit to enter edit mode; save updates info
- Metrics page: add metric (date, weight, height, vo2max); list all sorted by date descending
- Events page: add event (name, date, result, place number); delete event; show podium badge if place <= 3
- Achievements page: add achievement (title, date, description); delete achievement

## API
POST /api/metrics — body { date, weight, height, vo2max } → adds metric, returns metric
GET /api/metrics — returns all metrics

## Edge Cases
- Name must be non-empty to save profile
- Weight must be > 0; height must be > 0
- Place must be >= 1
