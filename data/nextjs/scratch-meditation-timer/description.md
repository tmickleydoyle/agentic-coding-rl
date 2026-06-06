# Meditation Timer

A single-page React app for timing and logging meditation sessions.

## Seed Data

Display three pre-loaded completed sessions on mount:

| Date       | Duration (min) | Type         | Notes              |
|------------|----------------|--------------|--------------------|
| 2024-02-01 | 10             | Mindfulness  | Morning calm       |
| 2024-02-03 | 20             | Focused      | Good concentration |
| 2024-02-05 | 15             | Body Scan    | Relaxing           |

## Fields (Add Session Form)

- **Date** (date input, label "Date")
- **Duration** (number input, label "Duration (min)", min=1)
- **Type** (select, label "Type"): options — Mindfulness, Focused, Body Scan, Loving-Kindness, Transcendental
- **Notes** (text input, label "Notes", optional)

## Behaviors

1. On mount, render seed sessions in a list. Each session shows date, type, duration, and notes.
2. Submitting the form with valid fields appends a new session.
3. Date required — if empty show "Date is required".
4. Duration must be positive integer — if missing or <= 0 show "Duration must be positive".
5. Type required — if empty show "Type is required".
6. On successful add, clear the form.
7. Each session has a "Delete" button that removes it.
8. Display "Total sessions: N".
9. Display "Total minutes: N".
10. Display the longest single session: "Longest session: N min". If no sessions, show "Longest session: 0 min".

## Edge Cases

- Deleting all sessions: totals and longest reset to 0.
- Notes is optional; omit notes display if empty.
- Longest session updates correctly after add or delete.
