# scratch-app-fitness-plan

A multi-route fitness plan manager. Users can view a dashboard, manage workouts, view a weekly schedule, and track progress.

## Routes
- `/` — Dashboard: shows summary stats (total workouts, total minutes, streak days)
- `/workouts` — Workout list: add/remove workouts (name, type, duration in minutes)
- `/schedule` — Weekly schedule: assign workouts to days (Mon–Sun)
- `/progress` — Progress chart: list of completed workouts with date and duration

## Seed Data
Three initial workouts:
1. { id: "w1", name: "Morning Run", type: "cardio", duration: 30, completed: false }
2. { id: "w2", name: "Push Day", type: "strength", duration: 45, completed: false }
3. { id: "w3", name: "Yoga Flow", type: "flexibility", duration: 20, completed: false }

## Behaviors
- Dashboard shows count of workouts, sum of durations, and number of completed workouts
- Add workout form: name (text), type (select: cardio/strength/flexibility), duration (number)
- Submit adds workout with a generated id; clear form after submit
- Remove button deletes workout by id
- Mark workout complete toggles completed state
- Schedule page shows Mon–Sun; clicking a day + workout assigns it
- Progress page lists completed workouts sorted by name

## API
POST /api/workouts — body { name, type, duration } → adds workout, returns { id, name, type, duration, completed: false }
GET /api/workouts — returns array of all workouts

## Edge Cases
- Duration must be > 0; ignore submissions with empty name or duration ≤ 0
- Duplicate names are allowed
- Removing a workout that doesn't exist is a no-op
