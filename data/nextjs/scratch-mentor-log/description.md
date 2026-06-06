# Mentor Log

A single-page React app to log and review mentorship sessions.

## Seed Data

Start with these 3 sessions pre-loaded:

| Mentor | Date | Topic | Rating | Action Items |
|--------|------|-------|--------|--------------|
| Dr. Smith | 2024-01-05 | Career Planning | 5 | Update resume, reach out to 3 companies |
| Prof. Lee | 2024-01-12 | Research Methods | 4 | Read 2 papers, draft outline |
| Sarah Chen | 2024-01-19 | Networking Tips | 3 | Attend club fair, LinkedIn update |

## Fields

Each session has:
- **mentor** (string): Mentor name
- **date** (string): Date (YYYY-MM-DD)
- **topic** (string): Session topic
- **rating** (number): 1–5 stars
- **actionItems** (string): Free-text action items

## Layout

- Page heading: "Mentor Log"
- Summary showing average rating across all sessions
- Add session form
- List of sessions

## Add Form

- Text input labeled "Mentor" (data-testid="input-mentor")
- Date input labeled "Date" (data-testid="input-date")
- Text input labeled "Topic" (data-testid="input-topic")
- Number input labeled "Rating (1-5)" (data-testid="input-rating")
- Textarea labeled "Action Items" (data-testid="input-action-items")
- Submit button "Add Session" (data-testid="btn-add")

Validation: mentor and topic are required. Rating must be 1–5. If invalid, show error with data-testid="error-message" and do not add.

On successful add, clear the form.

## Session List

Each session rendered with:
- data-testid="session-item" on the container
- data-testid="session-mentor" showing mentor name
- data-testid="session-date" showing date
- data-testid="session-topic" showing topic
- data-testid="session-rating" showing rating
- data-testid="session-actions" showing action items
- A "Delete" button with data-testid="btn-delete"

## Summary

- data-testid="avg-rating": shows average rating rounded to 1 decimal (e.g. "4.0")

## Sort

Two buttons to sort the session list:
- "Sort by Date" (data-testid="sort-date"): sorts ascending by date
- "Sort by Rating" (data-testid="sort-rating"): sorts descending by rating

Default order is insertion order (seed order).

## Edge Cases

- Empty mentor or topic shows error
- Rating outside 1–5 shows error
- Delete removes only that session and recalculates average
- Average with 0 sessions shows "0.0" or "N/A"
