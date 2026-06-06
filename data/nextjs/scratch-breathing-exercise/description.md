# Breathing Exercise Log

A single-page React app for logging breathing exercise sessions.

## Seed Data

Display three pre-loaded sessions on mount:

| Date       | Technique      | Rounds | Duration (min) | Notes             |
|------------|----------------|--------|----------------|-------------------|
| 2024-03-01 | Box Breathing  | 5      | 10             | Calm and focused  |
| 2024-03-03 | 4-7-8          | 3      | 8              | Pre-sleep routine |
| 2024-03-05 | Wim Hof        | 3      | 15             | Energizing        |

## Fields

- **Date** (date input, label "Date")
- **Technique** (select, label "Technique"): options — Box Breathing, 4-7-8, Wim Hof, Alternate Nostril, Diaphragmatic
- **Rounds** (number input, label "Rounds", min=1)
- **Duration** (number input, label "Duration (min)", min=1)
- **Notes** (text input, label "Notes", optional)

## Behaviors

1. On mount, render seed sessions. Each entry shows date, technique, rounds, duration, and notes.
2. Submitting the form with all required fields appends the new session.
3. Date required — if empty show "Date is required".
4. Technique required — if empty show "Technique is required".
5. Rounds must be positive integer — if missing or <= 0 show "Rounds must be positive".
6. Duration must be positive integer — if missing or <= 0 show "Duration must be positive".
7. On successful add, clear the form.
8. Each session has a "Delete" button that removes it.
9. Display "Total sessions: N".
10. Display "Total rounds: N".
11. Display "Total minutes: N".

## Edge Cases

- Deleting all sessions: all totals reset to 0.
- Notes is optional; omit notes display if empty.
- Multiple validation errors shown simultaneously.
