# Candidate Notes

A single-page research notes app for tracking notes about political candidates, with add, edit, tag, and search functionality.

## Seed Data

Start with the following notes pre-loaded:

| ID | Candidate       | Tag        | Note                                          |
|----|-----------------|------------|-----------------------------------------------|
| 1  | Alice Mercer    | Policy     | Supports renewable energy expansion           |
| 2  | Bob Harrington  | Background | Former city council member for 8 years        |
| 3  | Alice Mercer    | Fundraising| Q1 fundraising total: $220,000                |
| 4  | Carol Nguyen    | Policy     | Advocates for affordable housing reform       |
| 5  | Bob Harrington  | Policy     | Opposes new property tax measures             |

Tags are free-form strings. Each note belongs to exactly one candidate.

## UI Layout

- Page heading: "Candidate Notes"
- A search input labeled "Search notes" that filters notes by text content (searches Note text and Candidate name)
- A tag filter dropdown populated with all unique tags present; first option "All Tags"
- The notes list — each note card shows:
  - Candidate name
  - Tag (as a badge/label)
  - Note text
  - An "Edit" button
  - A "Delete" button
- An "Add Note" form with:
  - Text input for Candidate name
  - Text input for Tag
  - Textarea for Note text
  - Submit button "Add Note"
- When "Edit" is clicked, that card switches to an inline edit mode showing:
  - Editable inputs for Candidate, Tag, and Note text (pre-filled)
  - A "Save" button and a "Cancel" button

## Behaviors

### Searching and Filtering
- Search filters by note text OR candidate name (case-insensitive, substring match).
- Tag filter shows only notes with the matching tag.
- Both filters apply simultaneously (AND logic).
- The tag dropdown updates dynamically as notes are added/deleted.

### Adding a Note
- All three fields (Candidate, Tag, Note text) are required; if any is blank, do nothing.
- On success: append note with auto-incremented ID, clear all form inputs.

### Editing a Note
- Clicking "Edit" on a card shows editable fields pre-filled with current values.
- "Save" updates the note (all three fields must be non-empty to save).
- "Cancel" reverts to read mode with no changes.
- Only one note may be in edit mode at a time; opening a second closes the first.

### Deleting a Note
- "Delete" removes the note immediately.
- If the deleted note's tag was unique, the tag dropdown updates to remove it.

## data-testid Attributes

- `"search-input"` — the search text input
- `"tag-filter"` — the tag filter dropdown
- `"note-card"` — each note card (count varies with filters)
- `"note-candidate"` — candidate name in a card
- `"note-tag"` — tag badge in a card
- `"note-text"` — note text in a card
- `"edit-btn"` — Edit button on a card
- `"delete-btn"` — Delete button on a card
- `"edit-candidate-input"` — inline edit candidate input
- `"edit-tag-input"` — inline edit tag input
- `"edit-note-input"` — inline edit note textarea
- `"save-btn"` — Save button in inline edit mode
- `"cancel-btn"` — Cancel button in inline edit mode
- `"add-candidate-input"` — Add Note candidate input
- `"add-tag-input"` — Add Note tag input
- `"add-note-textarea"` — Add Note textarea
- `"add-note-btn"` — Add Note submit button

## Edge Cases

- Searching while editing a note: the edited note should remain visible if it matches.
- Deleting the note being edited closes edit mode.
- If no notes match the combined filter, show an empty state message.
- Tag dropdown must not have duplicate entries even if multiple notes share a tag.
