# Chapter Notes

## Overview
A single-page app for recording notes on individual chapters of a book. Users select a book, add chapter-numbered notes, and can delete notes they no longer need.

## Seed Data
The app starts with these books available in the book selector:

| Book Title |
|---|
| Moby Dick |
| 1984 |
| To Kill a Mockingbird |

Pre-loaded notes:

| Book | Chapter | Note |
|---|---|---|
| Moby Dick | 1 | Ishmael introduces himself and his desire to go to sea. |
| 1984 | 1 | Winston Smith writes in his diary for the first time. |

## Fields
- **Book** (select dropdown, required) — choose from the seed book list
- **Chapter** (number, positive integer, required) — chapter number
- **Note** (textarea, required) — the note text

## Behaviors

### Add a Note
- A form contains a Book selector, Chapter number input, and Note textarea.
- Clicking "Add Note" appends the note to the list.
- All fields are required; if any is empty the note is NOT added.
- Chapter must be a positive integer (>= 1); 0 or negative values are rejected.
- After a successful add, the form resets (book back to first option, chapter cleared, note cleared).

### Display Notes
- Notes are displayed in a list ordered by the time they were added (seed notes first).
- Each note entry shows: book title, chapter number (as "Chapter X"), and the note text.

### Delete a Note
- Each note has a "Delete" button.
- Clicking it removes that note immediately.

### Filter by Book
- A select dropdown labeled "Filter by book" (with an "All" option at the top) filters the displayed notes to only those belonging to the selected book.
- Selecting "All" shows all notes.

## Edge Cases
- Chapter number 0 should be rejected.
- Blank note text should be rejected.
- Deleting all notes for a book while that book is selected in the filter shows an empty list.
- Filtering does not affect the add-form's book selector.
