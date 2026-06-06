# scratch-app-meeting-notes

Build a multi-route meeting notes application.

## Routes
- **Meetings** (`/meetings`): CRUD for meetings. Fields: title (required), date, attendees, notes, action items.
- **Agenda** (`/agenda`): Select a meeting from a dropdown, view its agenda items (with checkboxes), add new agenda items, and toggle items as done/undone.
- **Search** (`/search`): Full-text search across meeting titles, notes, and attendees.

## API
- `GET /api/items` — list all; `?q=<query>` — search
- `POST /api/items` — create `{ title, date, attendees, notes, actionItems, agenda[] }`
- `PUT /api/items?id=<id>` — update (used for editing meetings and agenda items)
- `DELETE /api/items?id=<id>` — delete

## Requirements
- In-memory store with `__reset()` for tests
- Title required (400 if missing)
- AgendaItem: `{ id, text, done }`
