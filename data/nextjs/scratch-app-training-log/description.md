# scratch-app-training-log

A multi-route training log app for tracking workouts, exercises, and fitness goals.

## Routes
- `/` — Calendar view: lists log entries by date (date, exercise, sets, reps, weight kg)
- `/exercises` — Exercise library: add/remove exercises (name, category, muscle group)
- `/goals` — Goals tracker: add goals (title, target, unit, deadline), mark complete
- (NavBar links all routes)

## Seed Data
Exercises:
- id:1 name:"Squat" category:"Strength" muscleGroup:"Legs"
- id:2 name:"Bench Press" category:"Strength" muscleGroup:"Chest"

Log entries:
- id:1 exerciseId:1 date:"2024-02-01" sets:3 reps:10 weightKg:80
- id:2 exerciseId:2 date:"2024-02-01" sets:4 reps:8 weightKg:60

Goals:
- id:1 title:"Squat 100kg" target:100 unit:"kg" deadline:"2024-06-01" completed:false
- id:2 title:"Run 5km" target:5 unit:"km" deadline:"2024-05-01" completed:false

## Behaviors
- Calendar page shows all log entries; add entry (exerciseId, date, sets>0, reps>0, weightKg>=0)
- Exercises page: add (name, category, muscleGroup), remove
- Goals page: add goal, toggle complete; shows completed count and total
- API GET /api/logs returns all log entries; POST adds entry

## Edge Cases
- Sets and reps must be > 0
- weightKg must be >= 0
- Removing an exercise removes its log entries
