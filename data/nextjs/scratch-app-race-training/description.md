# scratch-app-race-training

A multi-route race training app. Users manage a training plan with runs, goals, and a training log.

## Routes
- `/` — Plan: overview of the active race plan (race name, distance, race date, weeks remaining)
- `/runs` — Runs: add/delete planned runs (type: easy/tempo/long/race, distance km, date)
- `/goals` — Goals: set pace goals per run type (min/km)
- `/log` — Log: mark runs as completed, show total km logged

## Seed Data
Race plan: { raceName: "City Marathon", distance: "42.2km", raceDate: "2024-10-15" }

Three initial runs:
1. { id: "r1", type: "easy", distance: 8, date: "2024-07-01", completed: false }
2. { id: "r2", type: "tempo", distance: 6, date: "2024-07-03", completed: false }
3. { id: "r3", type: "long", distance: 20, date: "2024-07-07", completed: false }

Default pace goals: { easy: "6:00", tempo: "4:30", long: "5:30", race: "5:00" }

## Behaviors
- Plan page shows race details and count of total runs and completed runs
- Runs page: add run (type select, distance number, date), delete run by id
- Goals page: editable pace goal inputs per run type; save updates state
- Log page: list all runs; button to toggle completed; show sum of completed km

## API
POST /api/runs — body { type, distance, date } → adds run, returns run object
GET /api/runs — returns all runs

## Edge Cases
- Run distance must be > 0
- Run date must be non-empty
- Pace goal format is a string (no validation required)
- Deleting a completed run reduces total km logged
