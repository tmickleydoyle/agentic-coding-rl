# Book Summary Log

## Overview
A single-page app for logging books you have read, along with a rating and a short personal summary.

## Seed Data
The app starts with these three books pre-loaded:

| Title | Author | Genre | Rating | Summary |
|---|---|---|---|---|
| The Great Gatsby | F. Scott Fitzgerald | Fiction | 4 | A tale of wealth, obsession, and the American Dream. |
| Sapiens | Yuval Noah Harari | Non-Fiction | 5 | A brief history of humankind from the Stone Age to today. |
| Dune | Frank Herbert | Sci-Fi | 5 | An epic story of politics, religion, and survival on a desert planet. |

## Fields
- **Title** (text, required) — book title
- **Author** (text, required) — author name
- **Genre** (text, required) — genre label (e.g. Fiction, Non-Fiction, Sci-Fi)
- **Rating** (number, 1–5, required) — numeric star rating
- **Summary** (textarea, required) — personal short summary

## Behaviors

### Add a Book
- A form at the top contains inputs for Title, Author, Genre, Rating, and Summary.
- Clicking the "Add Book" button appends the new entry to the list.
- All fields are required; if any field is empty the book is NOT added and the list does not change.
- Rating must be between 1 and 5 inclusive; values outside this range are rejected.
- After a successful add, all form fields reset to empty / default.

### Display Books
- Each book is shown in a card-like entry.
- Each card shows: title, author, genre, rating (as "Rating: X/5"), and summary.
- Cards appear in the order they were added (seed data first).

### Delete a Book
- Each card has a "Delete" button.
- Clicking "Delete" removes that book from the list immediately.
- The remaining books are unaffected.

### Filter by Genre
- A text input labeled "Filter by genre" is present above the list.
- Typing in this input (case-insensitive) filters the displayed cards to those whose genre contains the filter text.
- Clearing the filter shows all books again.

## Edge Cases
- Adding a book with Rating = 0 or Rating = 6 should be rejected (no card added).
- Adding a book when any field is blank should be rejected.
- Filter matching is case-insensitive (e.g. "fiction" matches "Fiction").
- Deleting all books shows an empty list with no cards.
