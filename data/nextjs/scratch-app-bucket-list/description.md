# scratch-app-bucket-list

A bucket list app for tracking life goals, marking achievements, and organizing by category.

## Routes
- `/` — Home: shows goal summary and progress
- `/goals` — Manage goals (add, remove, mark complete/incomplete, filter)
- `/completed` — View completed goals with completion date
- `/categories` — Browse goals organized by category

## Features
- Add goals with title, description, category, target date, and difficulty
- Mark goals as complete (records completion date) or incomplete
- Filter by category or difficulty
- Completed view shows achievement timeline
- All state managed via AppStateProvider context

## API
- `GET /api/bucketlist` — list all goals
- `POST /api/bucketlist` — add a goal `{ title, description, category, targetDate, difficulty }`
- `PATCH /api/bucketlist` — update goal `{ id, completed? }`
- `DELETE /api/bucketlist` — remove a goal `{ id }`
