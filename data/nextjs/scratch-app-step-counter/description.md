# Step Counter App

Build a step counting app where users log daily steps, track progress toward goals, view history, and manage their daily step target.

## Data Model

### StepEntry
- `id`, `date` (YYYY-MM-DD), `steps` (positive integer), `notes`
- `distanceKm`: auto-computed as `steps * 0.0008`
- `caloriesBurned`: auto-computed as `steps * 0.04`
- `goalMet`: boolean, true if steps >= daily target
- `createdAt`: Unix timestamp

### StepGoal
- `dailyTarget`: number (default 10000)

## Routes
1. **Home** — daily goal, total steps all-time, days goal met, today's entry if present
2. **Log** — form: date (required), steps (number, > 0), notes
3. **History** — all entries newest-first with date, steps, distance, calories, goal met indicator
4. **Goals** — current goal display, form to update daily target

## API
- `GET /api/steps` — entries + goal + stats (totalSteps, avgSteps, goalMetDays, bestDay)
- `POST /api/steps` — create entry (auto-computes distance, calories, goalMet)
- `DELETE /api/steps?id=<id>` — delete entry
- `PUT /api/steps` — update goal (body: { dailyTarget })
