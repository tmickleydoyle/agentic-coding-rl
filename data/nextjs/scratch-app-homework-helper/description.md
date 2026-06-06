# scratch-app-homework-helper

A homework management tool for students to track assignments by subject, manage status, add study notes, and view completion progress.

## Routes
- **Home** (`home`): Dashboard with counts — todo, in-progress, total assignments.
- **Assignments** (`assignments`): List sorted by priority (high first); filter by status; add/delete; transition status (todo→in-progress→done).
- **Subjects** (`subjects`): Auto-derived list of subjects from assignments; per-subject assignment and note counts; add/delete study notes.
- **Progress** (`progress`): Per-subject done/total stats and percentage; total done count; total estimated minutes remaining (non-done).

## Seed Data
- Assignments: Chapter 5 Problems (Math, 2024-03-15, high, todo, 60min), Essay Draft (English, 2024-03-18, medium, in-progress, 90min), Lab Report (Science, 2024-03-12, high, done, 45min), Reading Ch 7-8 (History, 2024-03-20, low, todo, 30min)
- Notes: Quadratic Formula (Math), Essay Structure (English)

## Behaviors
- Add assignment requires title, subject, dueDate; estimatedMinutes must be >= 0
- Status buttons: Start → in-progress, Done → done
- Filter dropdown narrows list by status
- Notes require subject (from assignments list), title, content
- Subject list derives from unique assignment subjects
- Remaining minutes sums estimatedMinutes for non-done assignments

## API (app/api/assignments/route.ts)
- GET /api/assignments — returns all
- POST /api/assignments — creates (title, subject, dueDate required; estimatedMinutes default 30); 400 if missing required or negative minutes
- DELETE /api/assignments?id=<id> — 404 if not found
