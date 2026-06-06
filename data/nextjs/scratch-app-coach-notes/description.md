# scratch-app-coach-notes

A multi-route coaching notes app. Coaches manage athletes, log coaching sessions, plan drills, and review session summaries.

## Routes
- `/` — Athletes: add/delete athletes (name, sport, level: beginner/intermediate/advanced)
- `/sessions` — Sessions: add coaching sessions for a selected athlete (date, duration minutes, focus area text)
- `/drills` — Drills: add drills to a selected session (name, reps, notes)
- `/review` — Review: summary showing total sessions, total session minutes, session list per athlete

## Seed Data
Two athletes:
1. { id: "a1", name: "Alex Chen", sport: "Swimming", level: "advanced" }
2. { id: "a2", name: "Maria Lopez", sport: "Track", level: "intermediate" }

Two sessions:
1. { id: "s1", athleteId: "a1", date: "2024-05-01", duration: 90, focus: "Butterfly technique", drills: [{ id: "d1", name: "Arm Drill", reps: 10, notes: "Focus on pull" }] }
2. { id: "s2", athleteId: "a2", date: "2024-05-02", duration: 60, focus: "Sprint starts", drills: [] }

## Behaviors
- Athletes page: add athlete (name, sport, level select); delete athlete; click to select active
- Sessions page: show "No active athlete" if none selected; add session to active athlete
- Drills page: show "No active session" if none selected; click session to activate; add drill
- Review page: per-athlete breakdown of session count and total minutes; list sessions

## API
POST /api/sessions — body { athleteId, date, duration, focus } → adds session, returns session
GET /api/sessions — returns all sessions

## Edge Cases
- Athlete name must be non-empty
- Session duration must be > 0
- Drill reps must be >= 1
