# Book Notes App

A single-page React app for tracking personal notes on books you've read.

## Seed Data

Three books pre-loaded:
```
{ id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4, notes: "Vivid portrayal of the Jazz Age." }
{ id: 2, title: "1984", author: "George Orwell", rating: 5, notes: "Chilling dystopia, still relevant." }
{ id: 3, title: "To Kill a Mockingbird", author: "Harper Lee", rating: 5, notes: "Profound story of justice and compassion." }
```

## UI Layout

- `<h1>` with text "Book Notes"
- Add-book form with fields:
  - Text input labeled "Title"
  - Text input labeled "Author"
  - Number input labeled "Rating" (1–5, integer)
  - Textarea labeled "Notes"
  - Button "Add Book"
- Book list displaying all books
- Summary line showing total books and average rating

## Book List

Each book renders as a list item (`<li>`) with `data-testid="book-item"` containing:
- `data-testid="book-title"` — the book title
- `data-testid="book-author"` — the author name
- `data-testid="book-rating"` — rating displayed as "Rating: N"
- `data-testid="book-notes"` — the notes text
- A "Delete" button that removes that book from the list

## Summary

- `data-testid="book-count"` — "Books: N"
- `data-testid="avg-rating"` — "Avg Rating: X.X" (one decimal place; "Avg Rating: 0.0" when list is empty)

## Interactions

1. Fill Title, Author, Rating, Notes and click "Add Book" — new book appears at the bottom of the list.
2. Adding a book clears all four form fields.
3. If Title or Author is empty, clicking "Add Book" does nothing (no book added).
4. Rating is clamped: if value outside 1–5, clamp to nearest bound before storing.
5. Clicking "Delete" on a book removes it; count and avg rating update.
6. Average rating is computed as sum of ratings divided by count, rounded to one decimal.

## Edge Cases

- Deleting all books shows "Books: 0" and "Avg Rating: 0.0".
- Whitespace-only Title or Author is treated as empty (use `.trim()`).
