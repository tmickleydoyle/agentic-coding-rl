# scratch-app-gym-log

A multi-route gym session logger. Users can log workout sessions with exercises, view history, and see stats.

## Routes
- `/` — Sessions: create/delete gym sessions (date, name)
- `/exercises` — Exercises: add exercises to the active session (name, sets, reps, weight kg)
- `/history` — History: list of past sessions with exercises
- `/stats` — Stats: total sessions, total exercises logged, most frequent exercise name

## Seed Data
Two initial sessions:
1. { id: "s1", name: "Monday Chest", date: "2024-01-15", exercises: [{ id: "e1", name: "Bench Press", sets: 3, reps: 10, weight: 80 }] }
2. { id: "s2", name: "Wednesday Back", date: "2024-01-17", exercises: [{ id: "e2", name: "Deadlift", sets: 4, reps: 5, weight: 120 }, { id: "e3", name: "Pull-up", sets: 3, reps: 8, weight: 0 }] }

## Behaviors
- Sessions page: create a new session (name text, date input), delete a session by id
- Active session: clicking a session name marks it as active
- Exercises page: add exercise to active session (name, sets, reps, weight)
- History page: shows all sessions with their exercises listed
- Stats: total sessions count, total exercise entries, most frequent exercise (by name)
- No active session selected: exercises page shows "No active session"

## API
POST /api/sessions — body { name, date } → adds session, returns session object
GET /api/sessions — returns all sessions

## Edge Cases
- Session name must be non-empty
- Exercise name must be non-empty; sets/reps must be >= 1; weight >= 0
- Deleting active session clears the active selection
