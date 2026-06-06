# Author Tracker

## Overview
A single-page app to track favorite authors. For each author you record their name, genre, number of books read, and a personal rating.

## Seed Data
The app starts with these authors pre-loaded:

| Name | Genre | Books Read | Rating |
|---|---|---|---|
| Ursula K. Le Guin | Sci-Fi/Fantasy | 7 | 5 |
| Haruki Murakami | Literary Fiction | 4 | 4 |
| Agatha Christie | Mystery | 12 | 5 |

## Fields
- **Name** (text, required) — author's full name
- **Genre** (text, required) — primary genre
- **Books Read** (number, non-negative integer >= 0, required)
- **Rating** (number, 1–5, required)

## Behaviors

### Add an Author
- A form contains inputs for Name, Genre, Books Read, and Rating.
- Clicking "Add Author" appends the author to the list.
- Name and Genre are required; if either is empty the author is NOT added.
- Books Read must be >= 0; negative values are rejected.
- Rating must be between 1 and 5 inclusive; values outside this range are rejected.
- After a successful add, all form fields reset to empty.

### Display Authors
- Each author is shown in a card with: name, genre, books read (as "Books Read: X"), and rating (as "Rating: X/5").
- Cards are shown in the order they were added (seed data first).

### Delete an Author
- Each card has a "Delete" button that removes the author immediately.

### Increment Books Read
- Each card has an "+" button labeled "Add Book" (or "+1 Book").
- Clicking it increments that author's Books Read count by 1.

### Filter by Genre
- A text input labeled "Filter by genre" filters cards by genre (case-insensitive, substring match).
- Clearing the filter shows all authors.

### Stats
- A stats section shows:
  - **Total Authors**: count of all authors (not filtered).
  - **Total Books Read**: sum of all Books Read across all authors (not filtered).

## Edge Cases
- Rating 0 or Rating 6 is rejected.
- Books Read = -1 is rejected.
- Incrementing Books Read via "+1 Book" does not affect the stats calculation delay — stats update immediately.
- Deleting an author immediately updates the stats.
