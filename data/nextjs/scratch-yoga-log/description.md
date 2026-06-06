# Yoga Log

A single-page React app for logging yoga sessions.

## Seed Data

Display three pre-loaded yoga sessions on mount:

| Date       | Style     | Duration (min) | Notes              |
|------------|-----------|----------------|--------------------|
| 2024-01-10 | Hatha     | 45             | Morning flow       |
| 2024-01-12 | Vinyasa   | 60             | Energizing session |
| 2024-01-14 | Yin       | 30             | Deep stretches     |

## Fields

- **Date** (text input, type="date", label "Date")
- **Style** (select, label "Style"): options — Hatha, Vinyasa, Yin, Restorative, Ashtanga
- **Duration** (number input, label "Duration (min)", min=1)
- **Notes** (text input, label "Notes", optional)

## Behaviors

1. On mount, render seed data in a list. Each session shows date, style, duration, and notes.
2. Submitting the form with valid Date, Style, and Duration appends a new session to the list.
3. Duration must be a positive integer. If Duration is missing or <= 0, do not add and show an error message "Duration must be positive".
4. Date is required. If Date is empty, show error "Date is required".
5. Style is required. If Style is default (""), show error "Style is required".
6. On successful add, clear the form fields.
7. Each session has a "Delete" button. Clicking it removes that session from the list.
8. Display total session count: "Total sessions: N".
9. Display total minutes practiced: "Total minutes: N".
10. Sessions are displayed in the order they were added (seed first, new appended after).

## Edge Cases

- Deleting all sessions shows "Total sessions: 0" and "Total minutes: 0".
- Notes field is optional; if empty, render the session without notes text or with an empty string.
- Multiple validation errors can appear at once if several fields are invalid.
