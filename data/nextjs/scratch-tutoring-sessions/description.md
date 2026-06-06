# Tutoring Sessions Manager

Build a single-page React app for managing tutoring sessions.

## Seed Data

Start with these sessions pre-loaded:

```
[
  { id: 1, student: "Alice Johnson", subject: "Math", date: "2024-01-15", duration: 60, notes: "Covered quadratic equations", completed: true },
  { id: 2, student: "Bob Smith", subject: "Science", date: "2024-01-16", duration: 45, notes: "Discussed photosynthesis", completed: false },
  { id: 3, student: "Carol White", subject: "Math", date: "2024-01-17", duration: 90, notes: "Practiced geometry proofs", completed: false },
  { id: 4, student: "David Brown", subject: "English", date: "2024-01-18", duration: 60, notes: "Essay writing techniques", completed: true },
]
```

## Fields

Each session has:
- `id`: unique number
- `student`: student full name (string)
- `subject`: one of "Math", "Science", "English", "History"
- `date`: ISO date string (YYYY-MM-DD)
- `duration`: number of minutes
- `notes`: free text notes
- `completed`: boolean

## UI Components

### Header
- `data-testid="app-title"`: shows "Tutoring Sessions"

### Add Session Form
- `data-testid="add-form"` wraps the form
- Text input `data-testid="input-student"` for student name
- Select `data-testid="select-subject"` with options: Math, Science, English, History
- Date input `data-testid="input-date"`
- Number input `data-testid="input-duration"` for minutes
- Textarea `data-testid="input-notes"` for notes
- Submit button `data-testid="btn-add"` labeled "Add Session"

### Filter
- Select `data-testid="filter-subject"` with options: "All", "Math", "Science", "English", "History"
- Filtering by a subject shows only sessions with that subject
- "All" shows all sessions

### Session List
- `data-testid="session-list"` wraps the list
- Each session item: `data-testid="session-item-{id}"`
- Each item shows student name `data-testid="session-student-{id}"`, subject `data-testid="session-subject-{id}"`, date `data-testid="session-date-{id}"`, duration `data-testid="session-duration-{id}"` (displayed as "{N} min")
- Complete toggle button `data-testid="btn-complete-{id}"`: if not completed shows "Mark Complete", if completed shows "Completed"
- Delete button `data-testid="btn-delete-{id}"`

### Session Count
- `data-testid="session-count"`: shows "X sessions" where X is the number of currently visible sessions

## Behaviors

1. **Add Session**: filling out the form and clicking "Add Session" appends a new session to the list with `completed: false`. The form resets after submission. The new session gets id = Math.max(...existing ids) + 1.
2. **Filter by Subject**: selecting a subject from the filter dropdown shows only matching sessions. Count updates accordingly.
3. **Mark Complete**: clicking "Mark Complete" on a session toggles `completed` to true and changes button text to "Completed". Clicking again has no effect (button stays "Completed").
4. **Delete Session**: clicking delete removes the session from the list.
5. **Empty form validation**: if student name or date is empty, clicking "Add Session" does nothing (no new session added).
6. **Duration display**: always append " min" to the duration value, e.g. "60 min".
7. **Seed data**: four sessions appear on initial render.

## Edge Cases
- Filtering then adding a session: newly added session appears if it matches the current filter.
- Deleting all sessions of one subject then switching filter: session count shows 0 sessions.
- Default filter is "All".
