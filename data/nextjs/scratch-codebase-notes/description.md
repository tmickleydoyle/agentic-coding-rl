# Codebase Notes

A single-page app for developers to annotate their codebase with notes linked to files or modules. Notes can be tagged, filtered, and deleted.

## Seed Data

Pre-populate with the following notes on load:

| id | file | module | tag | body | createdAt |
|----|------|--------|-----|------|-----------|
| 1 | src/auth/login.ts | auth | security | "Rate limiting applied to login endpoint — max 5 attempts per minute." | 2024-01-10 |
| 2 | src/db/migrations.ts | database | todo | "Migration runner does not support rollbacks yet. Add rollback support before v2." | 2024-01-12 |
| 3 | src/api/users.ts | api | gotcha | "User ID is a UUID string, not an integer — do not cast to Number." | 2024-01-15 |
| 4 | src/utils/cache.ts | utils | performance | "LRU cache size is capped at 500 entries; tune via CACHE_MAX env var." | 2024-01-18 |
| 5 | src/workers/email.ts | workers | todo | "Email queue retries up to 3 times with exponential backoff." | 2024-01-20 |

## Fields

Each note has:
- **file** (string, required): file path in the repo, e.g. `src/auth/login.ts`
- **module** (string, required): logical module name, e.g. `auth`
- **tag** (select, required): one of `security`, `todo`, `gotcha`, `performance`, `note`
- **body** (textarea, required): the note text

## Behaviors

### Add Note
- A form at the top of the page has inputs for file, module, tag (select), and body.
- Clicking "Add Note" validates that all four fields are non-empty.
- If any field is empty, display an error message: "All fields are required."
- On success, the note is prepended to the list and the form is cleared.
- Each new note gets a unique id (monotonically increasing) and a createdAt timestamp (today's date as YYYY-MM-DD).

### Filter by Tag
- A row of tag-filter buttons above the list: "All", "security", "todo", "gotcha", "performance", "note".
- Clicking a tag button shows only notes with that tag; "All" shows all notes.
- Active filter button has a distinct style (aria-pressed="true").

### Search
- A text input labeled "Search notes" filters notes whose file path OR body contains the search string (case-insensitive).
- Search and tag filter apply simultaneously (AND logic).

### Delete Note
- Each note card has a "Delete" button.
- Clicking it removes the note from the list immediately.

### Display
- Each note card shows: file path, module badge, tag badge, body text, and createdAt date.
- Notes are displayed newest-first (prepend on add; seed data shown in reverse order: id 5 first).

## Edge Cases
- Adding a note with whitespace-only fields is invalid (treat as empty).
- Deleting a note while a filter/search is active does not reset the filter/search.
- If no notes match the current filter+search, display "No notes found."
