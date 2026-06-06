# Book Tracker

A single-page app for tracking books you want to read or have read.

## Seed Data

Four pre-existing books:
- Title: "The Great Gatsby", Author: "F. Scott Fitzgerald", Status: Read, Rating: 4
- Title: "Dune", Author: "Frank Herbert", Status: Reading, Rating: 0 (no rating yet)
- Title: "Project Hail Mary", Author: "Andy Weir", Status: Read, Rating: 5
- Title: "Atomic Habits", Author: "James Clear", Status: Want to Read, Rating: 0

## Status Options
"Want to Read", "Reading", "Read"

## UI Elements

- Page heading: "Book Tracker"
- Status filter select (aria-label="Filter by status") with options: All, Want to Read, Reading, Read
- List of books (filtered). Each <li> has data-testid="book-item" showing title, author, status, and rating (0 if unrated).
  Format: "{title} by {author} | {status} | Rating: {rating}/5"
- Count display (data-testid="book-count"): e.g. "4 books"
- Average rating display (data-testid="avg-rating"): average of books with rating > 0, to 1 decimal.
  Format: "Avg rating: {n}" or "Avg rating: N/A" if no rated books.
- Form fields:
  - Label "Title" → text input
  - Label "Author" → text input
  - Label "Status" → select (Want to Read / Reading / Read)
  - Label "Rating" → number input (0-5, integer; 0 means unrated)
  - Button "Add Book"
- Each book item has a "Remove" button (data-testid="remove-btn") that deletes that book.

## Behaviors

### Add Book
- Title and Author required. If either empty, does nothing.
- Rating must be 0-5 inclusive (integer). If out of range, clamp or reject (reject if < 0 or > 5).
- Appends book; updates count and average; clears form inputs.

### Remove Book
- Clicking "Remove" next to a book removes it from the list; updates count and average.

### Filter
- Selecting a status filters the displayed list and count.
- "All" shows all books.
- avg-rating always computed from ALL books (unfiltered), only counting rating > 0.

### Average Rating
- Computed over all books (not filtered) that have rating > 0.
- Seed: (4 + 5) / 2 = 4.5

## Edge Cases
- Books with rating 0 are excluded from the average.
- If all rated books are removed, avg-rating shows "N/A".
