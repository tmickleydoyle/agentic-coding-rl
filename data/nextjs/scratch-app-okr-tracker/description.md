# scratch-app-okr-tracker

Build a multi-route OKR (Objectives and Key Results) tracking application.

## Routes
- **Objectives** (`/objectives`): CRUD for objectives. Fields: title (required), description, quarter, status (on_track/at_risk/behind/completed). Shows key results count per objective.
- **Key Results** (`/keyresults`): Select an objective from a dropdown. Add key results with title, target number, current number, and unit. Update the current progress via inline number input.
- **Progress** (`/progress`): Show summary — total objectives, average KR progress (%), and count by status.

## API
- `GET /api/items` — all objectives; `?summary=1` — progress stats; `?status=<s>` — filter
- `POST /api/items` — create objective `{ title, description, quarter, status, keyResults[] }`
- `PUT /api/items?id=<id>` — update objective; `?action=addkr` — add key result; `?action=updatekr&krId=<id>` — update KR progress
- `DELETE /api/items?id=<id>` — delete objective

## Requirements
- In-memory store with `__reset()` for tests
- Title required (400 if missing)
- KeyResult: `{ id, title, target, current, unit }`
- Statuses: on_track, at_risk, behind, completed
