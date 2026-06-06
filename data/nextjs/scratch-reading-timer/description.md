# Reading Timer App

A single-page React app for logging reading sessions with a countdown timer.

## Seed Data

Two pre-loaded session log entries:
```
{ id: 1, book: "Dune", minutes: 30, date: "2024-01-10" }
{ id: 2, book: "Foundation", minutes: 45, date: "2024-01-11" }
```

## UI Layout

- `<h1>` with text "Reading Timer"
- Session form with:
  - Text input labeled "Book Title"
  - Number input labeled "Minutes" (positive integer, minimum 1)
  - Button "Start Session"
- Active session panel (hidden when no session is active):
  - `data-testid="active-session"` wrapper
  - `data-testid="session-book"` — current book title
  - `data-testid="timer-display"` — remaining time formatted as "MM:SS"
  - Button "Finish Early" — ends the session immediately and logs it
- Session log listing past sessions
- Summary showing total minutes read

## Session Log

Each log entry renders as `<li>` with `data-testid="log-item"` containing:
- `data-testid="log-book"` — book title
- `data-testid="log-minutes"` — displayed as "N min"
- `data-testid="log-date"` — the date string
- A "Delete" button to remove the entry

## Summary

- `data-testid="total-minutes"` — "Total: N min"

## Timer Behavior

- When "Start Session" is clicked with a valid book title and minutes value, the active session panel appears.
- The timer counts down from MM:SS (e.g., 25 minutes → "25:00") to "00:00".
- The timer ticks every real second (uses setInterval).
- When the timer reaches "00:00", the session is automatically logged and the active panel hides.
- "Finish Early" logs the session with the originally requested minutes (not elapsed) and hides the panel.
- Only one session can be active at a time (the form is disabled while a session is running — inputs and button are disabled).
- Starting a session clears the Book Title and Minutes fields.

## Interactions

1. Fill Book Title and Minutes, click "Start Session" — active panel appears with correct book and initial timer.
2. Clicking "Finish Early" ends the session, adds a log entry with the original minutes, hides active panel, re-enables form.
3. If Book Title is empty or Minutes < 1, clicking "Start Session" does nothing.
4. Deleting a log entry removes it and updates total.
5. Total minutes is sum of all log entries' minutes.

## Edge Cases

- Minutes input must be at least 1 (ignore 0 or negative).
- Whitespace-only Book Title is treated as invalid.
- Timer display always shows two-digit minutes and seconds (zero-padded).
