# Stretch Routine Log

A single-page React app for logging stretching routine sessions.

## Seed Data

Display three pre-loaded sessions on mount:

| Date       | Focus Area  | Duration (min) | Stretches | Notes              |
|------------|-------------|----------------|-----------|--------------------|
| 2024-04-01 | Hamstrings  | 20             | 6         | Post-run           |
| 2024-04-03 | Shoulders   | 15             | 5         | Desk relief        |
| 2024-04-05 | Full Body   | 30             | 10        | Morning routine    |

## Fields

- **Date** (date input, label "Date")
- **Focus Area** (select, label "Focus Area"): options — Hamstrings, Shoulders, Full Body, Hip Flexors, Back, Calves
- **Duration** (number input, label "Duration (min)", min=1)
- **Stretches** (number input, label "Stretches", min=1, number of individual stretches performed)
- **Notes** (text input, label "Notes", optional)

## Behaviors

1. On mount, render seed sessions. Each entry shows date, focus area, duration, stretches, and notes.
2. Submitting the form with all required fields appends a new session.
3. Date required — if empty show "Date is required".
4. Focus Area required — if empty show "Focus Area is required".
5. Duration must be positive integer — if missing or <= 0 show "Duration must be positive".
6. Stretches must be positive integer — if missing or <= 0 show "Stretches must be positive".
7. On successful add, clear the form.
8. Each session has a "Delete" button that removes it.
9. Display "Total sessions: N".
10. Display "Total minutes: N".
11. Display "Total stretches: N".

## Edge Cases

- Deleting all sessions resets all totals to 0.
- Notes is optional; omit notes display if empty.
- Multiple validation errors shown simultaneously.
