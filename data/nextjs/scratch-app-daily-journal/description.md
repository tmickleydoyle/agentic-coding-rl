# Daily Journal App

Build a personal daily journal web application where users can write, browse, search, and delete journal entries.

## Requirements

### Data Model
Each journal entry has:
- `id`: unique string identifier
- `date`: ISO date string (YYYY-MM-DD)
- `title`: short title for the entry
- `body`: full text of the journal entry
- `mood`: one of "great" | "good" | "okay" | "bad" | "terrible"
- `tags`: array of string tags
- `createdAt`: Unix timestamp

### Routes / Pages
1. **Home** (`home`) — Dashboard showing total entry count and 3 most recent entries. Button to write a new entry.
2. **Entries** (`entries`) — Full list of all entries sorted newest-first. Each shows title, date, mood. Delete button per entry.
3. **New Entry** (`new-entry`) — Form with title, body (textarea), mood selector, tags input (comma-separated). Validates that title and body are non-empty.
4. **Search** (`search`) — Search form that queries entries by title, body, or tags. Shows results or "No results found."

### API Routes
- `GET /api/entries` — returns all entries; accepts `?search=` query param for filtering
- `POST /api/entries` — creates a new entry (requires title + body)
- `DELETE /api/entries?id=<id>` — deletes an entry by id

### UI Requirements
- Navigation bar with links to all 4 routes
- All interactive elements must have `data-testid` attributes
- Form validation error displayed with `data-testid="form-error"`
