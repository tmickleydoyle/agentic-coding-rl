# scratch-app-action-items

Build a multi-route action items tracker.

## Routes
- **Action Items** (`/items`): Create and manage open action items. Fields: title (required), assignee, due date, priority (low/medium/high), notes. Toggle items complete/incomplete. Delete items. Show only non-completed items here.
- **Completed** (`/completed`): Show items with completed=true, displaying title and assignee.
- **Filter** (`/filter`): Filter items by priority — click buttons for each priority level.

## API
- `GET /api/items` — all items; `?completed=1` — completed only; `?priority=<p>` — by priority
- `POST /api/items` — create `{ title, assignee, dueDate, priority, notes, completed }`
- `PUT /api/items?id=<id>` — update (used to toggle completion)
- `DELETE /api/items?id=<id>` — delete

## Requirements
- In-memory store with `__reset()` for tests
- Title required (400 if missing)
- Priorities: low, medium, high
