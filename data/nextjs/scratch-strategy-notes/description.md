# Strategy Notes

A single-page React app for managing strategy notes for tabletop or board games. Users can add notes with tags and priority levels, search by keyword, and archive notes.

## Seed Data

Four pre-loaded notes:
1. Title: "Opening Gambit", Content: "Control center squares early", Tags: ["chess", "opening"], Priority: "high", Archived: false
2. Title: "Resource Management", Content: "Never deplete wood before round 3", Tags: ["settlers", "economy"], Priority: "medium", Archived: false
3. Title: "Bluffing Tells", Content: "Watch for eye contact breaks", Tags: ["poker", "psychology"], Priority: "high", Archived: true
4. Title: "Endgame Points", Content: "Count victory points before final round", Tags: ["general", "endgame"], Priority: "low", Archived: false

## Fields per Note
- `id`: unique number
- `title`: string
- `content`: string
- `tags`: string[]
- `priority`: "high" | "medium" | "low"
- `archived`: boolean

## UI Layout

### Header
- `<h1>` with text "Strategy Notes"
- Stats: total notes (`data-testid="total-notes"`), active (non-archived) count (`data-testid="active-notes"`), archived count (`data-testid="archived-notes"`)

### Search
- Text input for keyword search (`data-testid="search-input"`)
- Searches across title and content (case-insensitive, partial match)
- Shows filtered results immediately as user types
- Search applies on top of archive visibility (see below)

### View Toggle
- Button "Show Archived" / "Hide Archived" (`data-testid="toggle-archived-btn"`)
- Default: archived notes are hidden
- When showing archived: all notes (including archived) are visible (still filtered by search)
- When hiding archived: only non-archived notes shown (still filtered by search)

### Add Note Form
- Text input for title (`data-testid="note-title-input"`)
- Textarea for content (`data-testid="note-content-input"`)
- Text input for tags (comma-separated, `data-testid="note-tags-input"`)
- Select for priority (`data-testid="note-priority-input"`), options: high, medium, low; default "medium"
- Submit button "Add Note" (`data-testid="add-note-btn"`)
- Validation: title and content both required; tags optional
- Tags parsed by splitting on comma and trimming each tag; empty strings filtered out
- All fields clear after successful submission

### Note List
- Each note in a card (`data-testid="note-card-{id}"`)
- Title (`data-testid="note-title-{id}"`)
- Content (`data-testid="note-content-{id}"`)
- Priority badge (`data-testid="note-priority-{id}"`)
- Archive status: "Active" or "Archived" (`data-testid="note-archive-status-{id}"`)
- Tags listed (`data-testid="note-tags-{id}"`) — shows comma-joined tags string
- "Archive" / "Unarchive" toggle button (`data-testid="archive-toggle-{id}"`)
- "Delete" button (`data-testid="delete-note-{id}"`)

## Behaviors

- Stats always reflect all notes regardless of search or view toggle
- Search filters displayed notes; empty search shows all (subject to archive toggle)
- Archiving a note flips its archived status; button and status text update
- Deleted notes are removed permanently; stats update
- New notes are always added as non-archived

## Edge Cases
- Title with only whitespace is invalid
- Content with only whitespace is invalid
- Tags input "  chess , , openings " parses to ["chess", "openings"]
- Search for empty string matches all notes
