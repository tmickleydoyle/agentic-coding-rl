# Student Notes Manager

Build a single-page React app for creating and managing student notes with subject tagging and search.

## Seed Data

Start with these notes pre-loaded:

```
[
  { id: 1, title: "Algebra Basics", subject: "Math", content: "Variables, expressions, and equations overview.", pinned: false },
  { id: 2, title: "Cell Biology", subject: "Science", content: "Cell structure and organelle functions.", pinned: true },
  { id: 3, title: "World War II", subject: "History", content: "Timeline of major events from 1939 to 1945.", pinned: false },
  { id: 4, title: "Shakespeare Sonnets", subject: "English", content: "Analysis of sonnets 18 and 116.", pinned: false },
]
```

## Fields

Each note has:
- `id`: unique number
- `title`: note title (string)
- `subject`: one of "Math", "Science", "English", "History"
- `content`: note body text (string)
- `pinned`: boolean

## UI Components

### Header
- `data-testid="app-title"`: shows "Student Notes"

### Add Note Form
- `data-testid="add-form"` wraps the form
- Text input `data-testid="input-title"` for note title
- Select `data-testid="select-subject"` with options: Math, Science, English, History
- Textarea `data-testid="input-content"` for note content
- Submit button `data-testid="btn-add"` labeled "Add Note"

### Search
- Text input `data-testid="search-input"` placeholder "Search notes..."
- Searches across title and content (case-insensitive)
- Clears search with `data-testid="btn-clear-search"` button labeled "Clear"

### Filter
- Select `data-testid="filter-subject"` with options: "All", "Math", "Science", "English", "History"

### Notes List
- `data-testid="notes-list"` wraps the list
- Each note item: `data-testid="note-item-{id}"`
- Title: `data-testid="note-title-{id}"`
- Subject: `data-testid="note-subject-{id}"`
- Content: `data-testid="note-content-{id}"`
- Pin button `data-testid="btn-pin-{id}"`: shows "Unpin" if pinned, "Pin" if not pinned
- Delete button `data-testid="btn-delete-{id}"`

### Note Count
- `data-testid="note-count"`: shows "X notes" where X is count of currently visible notes

## Behaviors

1. **Add Note**: fills form, clicks "Add Note", note appended with `pinned: false`. Form resets. id = Math.max(...existing) + 1.
2. **Search**: typing in search-input filters notes to those whose title or content contains the search string (case-insensitive). Works in combination with subject filter.
3. **Clear Search**: clicking "Clear" empties the search input and shows all notes again (subject filter still applies).
4. **Filter by Subject**: select filters to matching subject. Combines with search.
5. **Pin/Unpin**: toggling pin changes button text. Pinned notes appear at the top of the list above unpinned notes.
6. **Delete**: removes the note.
7. **Empty validation**: if title or content is empty, "Add Note" does nothing.
8. **Seed data**: four notes appear on initial render; note id=2 is pinned and appears first.

## Edge Cases
- Search + filter: both apply simultaneously.
- Pinned notes always sort before unpinned in the rendered list.
- note-count reflects current visible count after search + filter.
