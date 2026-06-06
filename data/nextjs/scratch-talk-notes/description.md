# Talk Notes

A single-page app for conference attendees to keep notes per talk session.

## Seed Data

Four pre-loaded note entries:

| id | session | speaker | tag | note |
|----|---------|---------|-----|------|
| 1 | "Keynote: Future of AI" | "Dr. Ada Lovelace" | "ai" | "Discussed transformer scaling laws and emergent capabilities." |
| 2 | "React Patterns in 2025" | "Jordan Lee" | "frontend" | "Server components + signals pattern shown. Check repo link." |
| 3 | "Scaling Microservices" | "Sam Rivera" | "backend" | "Highlighted circuit breaker pattern. Latency budget tips." |
| 4 | "Designing for Accessibility" | "Priya Nair" | "design" | "WCAG 2.2 updates. Focus management in SPAs is key." |

## Fields

Each note has: id, session (talk title), speaker, tag (single string label), note (free text).

## Behaviors

### Add Note
- A form with fields: Session (text input), Speaker (text input), Tag (text input), Note (textarea)
- "Add Note" button submits the form
- New note appears at the top of the list
- All four fields are required; submitting with any empty field does nothing (no alert)
- After successful add, form fields clear

### Edit Note
- Each note card has an "Edit" button
- Clicking it opens an inline edit form pre-filled with current values
- Fields: Session, Speaker, Tag, Note (same as add form)
- "Save" button updates the note in place
- "Cancel" button discards changes and closes the edit form
- Only one note can be in edit mode at a time (opening a second closes the first)

### Delete Note
- Each note card has a "Delete" button
- Clicking it removes the note immediately (no confirmation dialog)

### Tag Filter
- A text input labelled "Filter by tag"
- Filters displayed notes to those whose tag contains the input value (case-insensitive substring match)
- Empty input shows all notes

### Note Count
- Text showing "X notes" updates as notes are added/deleted/filtered

## Edge Cases
- Editing a note and then deleting a different note keeps the edit form open on the correct note
- Tag filter applies on top of existing list (add/delete changes are still visible)
