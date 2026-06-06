# scratch-app-argument-mapper

Build a multi-route argument mapping application for structured reasoning.

## Routes
- **View** (`/view`): Display argument tree rooted at claims, with children (supports/rebuttals/evidence) nested beneath.
- **Manage** (`/manage`): Add arguments with text (required), type (claim/support/rebuttal/evidence), optional parent argument, and topic. Delete individual arguments.
- **Filter** (`/filter`): Filter arguments by type — show buttons for each type, display matching arguments.

## API
- `GET /api/items` — list all; `?type=<type>` — filter by type
- `POST /api/items` — create `{ text, type, parentId, topic }`
- `DELETE /api/items?id=<id>` — delete argument

## Requirements
- In-memory store with `__reset()` for tests
- Text required (400 if missing)
- Types: claim, support, rebuttal, evidence
