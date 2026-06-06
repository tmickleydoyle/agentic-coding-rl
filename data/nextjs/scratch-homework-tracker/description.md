# Homework Tracker

A single-page React app for tracking homework assignments with due dates and completion status.

## Seed Data

6 homework assignments:

| ID | Subject    | Title                      | Due Date   | Completed |
|----|------------|----------------------------|------------|-----------|
| 1  | Math       | Algebra Problem Set        | 2024-02-10 | true      |
| 2  | Science    | Lab Report Draft           | 2024-02-12 | false     |
| 3  | English    | Essay Outline              | 2024-02-08 | true      |
| 4  | History    | Chapter 5 Reading          | 2024-02-15 | false     |
| 5  | Math       | Geometry Quiz Prep         | 2024-02-14 | false     |
| 6  | Science    | Research Notes             | 2024-02-11 | true      |

## UI Layout

### Heading
`<h1>Homework Tracker</h1>`

### Filter Controls
- A select labeled **"Filter by Status"** with options: `"All"`, `"Pending"`, `"Completed"`
- A select labeled **"Filter by Subject"** with options: `"All"` plus each unique subject in the seed data: `"Math"`, `"Science"`, `"English"`, `"History"`

### Assignment List
Only show assignments matching both active filters.

Each assignment item (`data-testid="assignment-item"`):
- `data-testid="assignment-title"` — title text
- `data-testid="assignment-subject"` — subject text
- `data-testid="assignment-due"` — due date string as stored, e.g. `2024-02-10`
- `data-testid="assignment-status"` — text `"Completed"` or `"Pending"`
- A checkbox (aria-label: the assignment title) that toggles the completed state

### Add Assignment Form
Fields:
- Text input labeled **"Title"**
- Text input labeled **"Subject"**
- Date input labeled **"Due Date"**
- Button **"Add Assignment"** — adds the assignment as pending (completed: false); does nothing if title or subject is blank; clears all inputs after adding

### Summary
- `data-testid="total-count"` — total number of assignments (unfiltered)
- `data-testid="pending-count"` — number of pending assignments (unfiltered)
- `data-testid="completed-count"` — number of completed assignments (unfiltered)

## Edge Cases
- Filters apply together (AND logic).
- Summary counts reflect ALL assignments, not just the filtered view.
- Toggling a checkbox immediately updates the status text and summary counts.
- Do not add assignment if title or subject is empty/whitespace-only.
