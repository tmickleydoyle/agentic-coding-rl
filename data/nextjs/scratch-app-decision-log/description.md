# scratch-app-decision-log

Build a multi-route decision logging application.

## Routes
- **Log** (`/log`): CRUD for decisions. Fields: title (required), context, options considered, outcome, status (pending/decided/revisited), tags, decision date.
- **Archive** (`/archive`): Show only decisions with status=decided, displaying title and outcome.
- **Filter** (`/filter`): Filter decisions by status — click status buttons to see matching decisions.
- **Stats** (`/stats`): Show count of decisions by status (pending, decided, revisited) and total.

## API
- `GET /api/items` — all decisions; `?status=<s>` — filter; `?stats=1` — return counts
- `POST /api/items` — create `{ title, context, options, outcome, status, tags[], decisionDate }`
- `PUT /api/items?id=<id>` — update
- `DELETE /api/items?id=<id>` — delete

## Requirements
- In-memory store with `__reset()` for tests
- Title required (400 if missing)
- Statuses: pending, decided, revisited
