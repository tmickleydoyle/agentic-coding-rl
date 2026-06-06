# Music Practice Tracker

Build a single-page React app that lets musicians log their daily practice sessions and view weekly statistics.

## Seed Data

Start with these practice sessions pre-loaded:

```
id: 1, instrument: "Guitar", date: "2024-01-15", duration: 45, notes: "Scales and arpeggios"
id: 2, instrument: "Piano", date: "2024-01-15", duration: 30, notes: "Bach Inventions"
id: 3, instrument: "Guitar", date: "2024-01-16", duration: 60, notes: "Chord transitions"
id: 4, instrument: "Drums", date: "2024-01-17", duration: 20, notes: "Rudiments practice"
id: 5, instrument: "Piano", date: "2024-01-18", duration: 50, notes: "Chopin Etude"
```

## Fields

Each session has:
- `id` (number) — unique identifier
- `instrument` (string) — instrument name
- `date` (string) — YYYY-MM-DD format
- `duration` (number) — minutes practiced
- `notes` (string) — practice notes

## Behaviors

### Add Session
- A form at the top with fields: instrument (text input), date (date input), duration (number input), notes (text input).
- Submit button labeled "Add Session".
- On submit: append a new session with a new id (max existing id + 1), clear the form fields.
- If instrument or duration is empty/zero, do not add and do not clear the form.

### Session List
- Display all sessions in a list. Each item shows: instrument, date, duration (as "X min"), and notes.
- Each item has a "Delete" button that removes that session.

### Stats Panel
- Display total sessions count with data-testid="stat-total-sessions".
- Display total minutes practiced with data-testid="stat-total-minutes".
- Display the most-practiced instrument (the one with the highest total minutes) with data-testid="stat-top-instrument". If no sessions, show "None".

### Filter
- A text input to filter sessions by instrument name (case-insensitive substring match).
- Filtering affects only the visible list, not the stats.

## Edge Cases
- Deleting all sessions: stats show 0 sessions, 0 minutes, "None" for top instrument.
- Filter with no match: list shows empty, stats unchanged.
- Two instruments with equal total minutes: show either (deterministic by first found).
