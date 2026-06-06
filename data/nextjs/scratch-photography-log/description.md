# Photography Log

A single-page app to track photography sessions.

## Seed Data

Start with these three sessions pre-loaded:

| id | date       | location          | camera      | notes                        |
|----|------------|-------------------|-------------|------------------------------|
| 1  | 2024-03-15 | Central Park      | Sony A7III  | Golden hour portraits        |
| 2  | 2024-04-02 | Brooklyn Bridge   | Canon R5    | Long exposure at night       |
| 3  | 2024-05-10 | Coney Island      | Fuji X-T4   | Street photography           |

## Fields

- **Date** (date input, required)
- **Location** (text input, required)
- **Camera** (text input, required)
- **Notes** (textarea, optional)

## Behaviors

1. The page renders a heading "Photography Log".
2. All seed sessions are displayed in a list on load.
3. Each session shows its date, location, camera, and notes.
4. A form at the top lets the user add a new session.
5. Submitting the form appends the new session to the list and clears the form.
6. Required fields (date, location, camera) must be non-empty to submit; if any are empty the form does not submit.
7. Each session has a Delete button. Clicking it removes that session from the list.
8. A counter displays "X sessions" where X is the current number of sessions.
9. Sessions are displayed in reverse-chronological order (newest first).
10. After deletion, the counter updates immediately.

## Edge Cases

- Deleting all sessions shows "0 sessions" and an empty list.
- Adding a session with only whitespace in required fields should not submit.
- Notes field may be left blank.
