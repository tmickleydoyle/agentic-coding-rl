# Recovery Log

A single-page React app for logging post-workout recovery activities.

## Seed Data

Display three pre-loaded recovery entries on mount:

| Date       | Activity        | Duration (min) | Intensity | Notes              |
|------------|-----------------|----------------|-----------|--------------------|
| 2024-05-01 | Ice Bath        | 15             | High      | Post-race          |
| 2024-05-03 | Foam Rolling    | 20             | Low       | Leg recovery       |
| 2024-05-05 | Massage         | 60             | Medium    | Full body          |

## Fields

- **Date** (date input, label "Date")
- **Activity** (select, label "Activity"): options — Ice Bath, Foam Rolling, Massage, Sauna, Sleep, Active Recovery
- **Duration** (number input, label "Duration (min)", min=1)
- **Intensity** (select, label "Intensity"): options — Low, Medium, High
- **Notes** (text input, label "Notes", optional)

## Behaviors

1. On mount, render seed entries. Each entry shows date, activity, duration, intensity, and notes.
2. Submitting the form with all required fields appends a new entry.
3. Date required — if empty show "Date is required".
4. Activity required — if empty show "Activity is required".
5. Duration must be positive integer — if missing or <= 0 show "Duration must be positive".
6. Intensity required — if empty show "Intensity is required".
7. On successful add, clear the form.
8. Each entry has a "Delete" button that removes it.
9. Display "Total sessions: N".
10. Display "Total minutes: N".
11. Display "High intensity sessions: N" (count of entries with Intensity = "High").

## Edge Cases

- Deleting all entries resets all stats to 0.
- Notes is optional; omit notes display if empty.
- High intensity count updates correctly after add or delete.
