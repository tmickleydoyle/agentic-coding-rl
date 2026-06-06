# Mood Tracker App

Build a daily mood tracking application where users can log their mood on a 1-5 scale, add notes and activities, view their history, and see insights.

## Data Model
- `id`: unique string
- `date`: YYYY-MM-DD
- `level`: 1 (Terrible) to 5 (Great)
- `note`: text describing the day
- `activities`: array of activity strings
- `createdAt`: Unix timestamp

## Routes
1. **Home** — shows average mood, total count, today's status, button to log
2. **Log** — form with range slider (1-5), note textarea, activities input (comma separated). Note is required.
3. **History** — all logs sorted newest-first with date, level, label, note
4. **Insights** — average mood, total count, best day, mood distribution by level

## API
- `GET /api/moods` — all logs + average + distribution
- `POST /api/moods` — create log (note required, level 1-5)
- `DELETE /api/moods?id=<id>` — delete log
