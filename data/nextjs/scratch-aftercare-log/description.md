# Aftercare Log

A single-page React app for logging daily aftercare steps for tattoos and piercings. Users can add care entries, mark steps as completed, and filter by body art piece.

## Seed Data

Start with these 4 aftercare log entries pre-loaded:

| id | piece | step | dueDate | completed |
|----|-------|------|---------|-----------|
| 1 | Left arm tattoo | Clean with fragrance-free soap | 2024-06-01 | true |
| 2 | Left arm tattoo | Apply unscented moisturizer | 2024-06-01 | false |
| 3 | Nostril piercing | Saline spray twice daily | 2024-06-02 | false |
| 4 | Navel piercing | Avoid submerging in water | 2024-06-03 | true |

## Fields

- **piece** (string): name of the tattoo or piercing being cared for
- **step** (string): the specific care instruction
- **dueDate** (string): the date this step should be performed (YYYY-MM-DD)
- **completed** (boolean): whether this step has been done

## UI Behaviors

### Add Form
- Inputs for piece (text), step (text), and dueDate (date input).
- "Add Step" button appends a new entry with `completed: false`.
- Clear all fields after submission.
- If piece, step, or dueDate is empty, do not submit.

### Complete Toggle
- Each entry has a checkbox or button to toggle `completed`.
- Completed entries show `data-testid="completed-badge"`.

### Filter by Piece
- A dropdown with `data-testid="piece-filter"` listing all unique piece names plus "All".
- Default is "All".
- Selecting a piece name shows only entries for that piece.

### List
- Each entry is a card with `data-testid="log-card"`.
- Show piece name, step description, dueDate, and completed badge if completed.
- Each card has a delete button.

### Progress Summary
- Show `data-testid="progress-summary"` with text like "2 / 4 steps completed" (reflects visible/filtered entries).

## Edge Cases

- Submitting with empty piece, step, or dueDate is a no-op.
- When a new piece name is added via the form, it should appear in the piece filter dropdown.
- Deleting all entries for a piece removes that piece from the filter dropdown.
- The progress summary reflects only the currently filtered entries.
