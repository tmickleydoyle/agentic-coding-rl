# Reading Speed Tracker

## Overview
A single-page app to log reading sessions (pages read + minutes spent) and display computed reading speed statistics.

## Seed Data
The app starts with these sessions pre-loaded:

| Book | Pages Read | Minutes Spent |
|---|---|---|
| Dune | 30 | 45 |
| Sapiens | 20 | 25 |
| Dune | 50 | 60 |

## Fields
- **Book** (text, required) — book title
- **Pages Read** (number, positive integer >= 1, required)
- **Minutes Spent** (number, positive integer >= 1, required)

## Behaviors

### Add a Session
- A form at the top contains inputs for Book, Pages Read, and Minutes Spent.
- Clicking "Add Session" appends the session to the list.
- All fields are required; blank fields are rejected.
- Pages Read and Minutes Spent must each be >= 1; zero or negative values are rejected.
- After a successful add, all form fields reset to empty.

### Display Sessions
- Each session is shown as a row displaying: book, pages read, minutes spent, and computed speed ("X.XX pages/min").
- Speed = pages / minutes, rounded to 2 decimal places.
- Sessions are shown in the order they were added (seed data first).

### Delete a Session
- Each session row has a "Delete" button that removes it immediately.

### Stats Panel
- A stats panel is always visible showing aggregate statistics over ALL current sessions:
  - **Total Pages**: sum of all pages read across all sessions.
  - **Total Minutes**: sum of all minutes spent.
  - **Average Speed**: total pages / total minutes, shown as "X.XX pages/min". If no sessions exist, show "0.00 pages/min".

## Edge Cases
- After deleting all sessions, Total Pages = 0, Total Minutes = 0, Average Speed = "0.00 pages/min".
- Minutes Spent = 0 is rejected.
- Pages Read = 0 is rejected.
