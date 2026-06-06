# Workout Builder App

A multi-route workout builder for creating exercise libraries, building routines, and logging sessions.

## Routes
- **Home** (`/`): Shows total exercises, total routines, and total logged sessions.
- **Exercises** (`/exercises`): CRUD for exercises. Each exercise: id, name, category ("strength"|"cardio"|"flexibility"), muscleGroup, description.
- **Routines** (`/routines`): Build routines from exercises. Each routine: id, name, exerciseIds (string[]), estimatedMinutes. Can add/remove exercises from routines.
- **Log** (`/log`): Log completed workout sessions. Each log entry: id, routineId, date, durationMinutes, notes. View log history.

## Seed Data
Exercises: `[{ id: "ex1", name: "Push-up", category: "strength", muscleGroup: "chest", description: "Basic push-up" }, { id: "ex2", name: "Squat", category: "strength", muscleGroup: "legs", description: "Bodyweight squat" }, { id: "ex3", name: "Running", category: "cardio", muscleGroup: "full body", description: "Outdoor run" }]`
Routines: `[{ id: "r1", name: "Morning Basics", exerciseIds: ["ex1", "ex2"], estimatedMinutes: 20 }]`

## Behaviors
- Adding an exercise requires non-empty name.
- Adding a routine requires non-empty name.
- Adding exercises to routine: select from existing exercises, no duplicates in a routine.
- Logging a session requires selecting a routine and entering a positive durationMinutes.
- Deleting an exercise removes it from all routines' exerciseIds.

## API
`GET /api/routines` → returns `{ routines: Routine[] }`
`POST /api/routines` body `{ name, exerciseIds, estimatedMinutes }` → returns `{ routine: Routine }`
`DELETE /api/routines?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Empty exerciseIds for a new routine is allowed.
- Log with durationMinutes <= 0: show error.
- Deleting an exercise updates existing routines.
