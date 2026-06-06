# Retro Board

A single-page React app implementing a sprint retrospective board with three categories.

## Categories

Three fixed categories: Went Well, Needs Improvement, Action Items

## Seed Data

Six notes distributed across categories:

| id | category          | text                                  |
|----|-------------------|---------------------------------------|
| 1  | Went Well         | Great team communication              |
| 2  | Went Well         | Delivered all features on time        |
| 3  | Needs Improvement | Too many interruptions during focus   |
| 4  | Needs Improvement | Code review process was slow          |
| 5  | Action Items      | Schedule daily standups               |
| 6  | Action Items      | Set up automated testing pipeline     |

## UI Layout

- Page heading: "Retro Board"
- Three columns displayed side by side, one per category:
  - `data-testid="col-went-well"` for Went Well
  - `data-testid="col-needs-improvement"` for Needs Improvement
  - `data-testid="col-action-items"` for Action Items
- Each column has a heading with the category name
- Each note rendered as a card:
  - `data-testid="note-card"` on the card element
  - Shows the note text
  - A "Delete" button to remove the note
- Each column shows a count badge: `data-testid="count-went-well"`, `data-testid="count-needs-improvement"`, `data-testid="count-action-items"`

## Add Note Form

Below the board, a form with:
- Textarea labeled "Note Text"
- Select labeled "Category" with options: Went Well, Needs Improvement, Action Items
- Button labeled "Add Note"

On submit:
- Note text must be non-empty; validation failure does nothing
- On success: add note to the correct column, clear the textarea (keep category selection)

## Vote Feature

Each note card has an "Upvote" button and displays a vote count (`data-testid="note-votes"`).
- Initial votes: 0 for all notes
- Clicking "Upvote" increments that note's vote count by 1
