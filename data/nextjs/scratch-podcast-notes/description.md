# Podcast Notes

A single-page app for taking and organizing notes on podcast episodes.

## Seed Data

Start with the following notes pre-loaded:

| id | podcast | episode | note | timestamp |
|----|---------|---------|------|-----------|
| 1 | "Lex Fridman Podcast" | "EP #400 - Elon Musk" | "Interesting discussion on AI timelines" | "12:34" |
| 2 | "Hardcore History" | "Blueprint for Armageddon" | "WWI causes explained brilliantly" | "45:10" |
| 3 | "Huberman Lab" | "Sleep Toolkit" | "20 min nap before 3pm rule" | "08:22" |

## Fields

Each note has:
- **id**: unique number
- **podcast**: podcast show name (string)
- **episode**: episode title or identifier (string)
- **note**: the note text (string)
- **timestamp**: time in the episode when the note was taken (MM:SS format, string)

## UI Layout

- Heading: "Podcast Notes"
- A form with labeled inputs: "Podcast", "Episode", "Note", "Timestamp"
- An "Add Note" button to submit the form
- A list of notes displayed as cards, each showing all fields
- Each card has a "Delete" button

## Behaviors

1. **Add note**: fill all four fields and click "Add Note" — a new card appears in the list. The form clears after submission.
2. **Validation**: if any field is empty, the note is NOT added and an error message "All fields are required" is shown with `data-testid="error-message"`.
3. **Delete note**: clicking "Delete" on a card removes that note from the list.
4. **Note count**: a summary line shows "X notes" where X is the current count, with `data-testid="note-count"`.
5. **Note cards**: each card has `data-testid="note-card"`. The podcast name is shown with `data-testid="note-podcast"`, episode with `data-testid="note-episode"`, note text with `data-testid="note-text"`, timestamp with `data-testid="note-timestamp"`.

## Edge Cases

- Whitespace-only input counts as empty (trim before validation).
- Deleting a note updates the count immediately.
- Error message disappears when a valid note is successfully added.
