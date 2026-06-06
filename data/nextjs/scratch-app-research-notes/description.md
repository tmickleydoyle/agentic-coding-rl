# scratch-app-research-notes

Build a multi-route research notes application with the following features:

## Routes
- **Notes** (`/research`): Create, view, edit, and delete research notes. Each note has a title, content, comma-separated tags, and an optional source URL. Validate that title is non-empty on submit.
- **Sources** (`/sources`): Display all notes that have a source URL as a list of title + clickable link.
- **Tags** (`/tags`): Show all unique tags with note counts. Clicking a tag reveals the notes under that tag.
- **Search** (`/search`): Full-text search across note titles, content, and tags via the API.

## API
- `GET /api/notes` — list all notes; `GET /api/notes?q=<query>` — search notes
- `POST /api/notes` — create note `{ title, content, tags[], sourceUrl }`
- `PUT /api/notes?id=<id>` — update note
- `DELETE /api/notes?id=<id>` — delete note

## Requirements
- Persistent in-memory store with `__reset()` for tests
- Proper error states (missing title returns 400)
- Navigation highlight the current active route
