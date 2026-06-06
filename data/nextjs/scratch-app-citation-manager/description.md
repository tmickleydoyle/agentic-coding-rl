# scratch-app-citation-manager

Build a multi-route citation management application.

## Routes
- **Citations** (`/citations`): CRUD for citations with fields: title (required), authors, year, type (article/book/website/other), URL, collection, notes.
- **Collections** (`/collections`): Group citations by collection name. Click a collection to see its citations.
- **Export** (`/export`): Select citations (checkboxes) and generate APA-formatted text via the API.
- **Search** (`/search`): Full-text search across title, authors, and notes.

## API
- `GET /api/citations` — list all; `?q=query` — search; `?export=apa&ids=1,2` — export APA
- `POST /api/citations` — create `{ title, authors, year, type, url, collection, notes }`
- `PUT /api/citations?id=<id>` — update
- `DELETE /api/citations?id=<id>` — delete

## Requirements
- In-memory store with `__reset()` for tests
- APA format: `Authors (Year). Title.`
- Selecting no checkboxes exports all citations
