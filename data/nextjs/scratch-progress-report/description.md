# Student Progress Report

Build a single-page React app for tracking student grades and progress across subjects.

## Seed Data

Start with these students pre-loaded:

```
[
  { id: 1, name: "Alice Johnson", grades: { Math: 92, Science: 88, English: 95, History: 79 } },
  { id: 2, name: "Bob Smith", grades: { Math: 74, Science: 81, English: 68, History: 85 } },
  { id: 3, name: "Carol White", grades: { Math: 55, Science: 62, English: 70, History: 58 } },
]
```

## Fields

Each student has:
- `id`: unique number
- `name`: student full name (string)
- `grades`: object with keys Math, Science, English, History, each a number 0-100

## UI Components

### Header
- `data-testid="app-title"`: shows "Progress Report"

### Add Student Form
- `data-testid="add-form"` wraps the form
- Text input `data-testid="input-name"` for student name
- Number inputs for initial grades:
  - `data-testid="input-grade-math"` for Math
  - `data-testid="input-grade-science"` for Science
  - `data-testid="input-grade-english"` for English
  - `data-testid="input-grade-history"` for History
- Submit button `data-testid="btn-add"` labeled "Add Student"

### Student List
- `data-testid="student-list"` wraps the list
- Each student item: `data-testid="student-item-{id}"`
- Name: `data-testid="student-name-{id}"`
- Grade cells: `data-testid="student-grade-math-{id}"`, `data-testid="student-grade-science-{id}"`, `data-testid="student-grade-english-{id}"`, `data-testid="student-grade-history-{id}"`
- Average: `data-testid="student-avg-{id}"` — computed as Math.round((Math + Science + English + History) / 4), shown as a number
- Status: `data-testid="student-status-{id}"` — "Passing" if avg >= 70, "Failing" if avg < 70
- Delete button `data-testid="btn-delete-{id}"`

### Grade Edit
- Each grade cell has an edit button `data-testid="btn-edit-grade-{id}-{subject}"` (subject lowercase: math, science, english, history)
- Clicking edit shows a number input `data-testid="input-edit-grade-{id}-{subject}"` in place of the grade value
- Save button `data-testid="btn-save-grade-{id}-{subject}"` saves the new grade and hides the input
- Cancel button `data-testid="btn-cancel-grade-{id}-{subject}"` discards changes and hides the input

### Class Summary
- `data-testid="class-avg"`: shows "Class Avg: X" where X is the average of all students' averages (Math.round)
- `data-testid="passing-count"`: shows "X passing"
- `data-testid="failing-count"`: shows "X failing"

## Behaviors

1. **Add Student**: fills form and submits. Student added with provided grades. Form resets. id = max + 1.
2. **Empty validation**: if name is empty, do nothing.
3. **Grade defaults**: if a grade input is blank, default to 0.
4. **Edit Grade**: inline editing per subject per student. Save updates grade and recalculates average/status immediately.
5. **Cancel Edit**: discards value, shows original grade.
6. **Delete**: removes student; class summary updates.
7. **Status**: "Passing" if avg >= 70, else "Failing".
8. **Class avg**: Math.round of the mean of all student averages. Updates when students added/deleted/grade changed.
9. **Seed data**: Alice avg=89 (Passing), Bob avg=77 (Passing), Carol avg=61 (Failing).

## Edge Cases
- No students: class-avg shows "Class Avg: 0", passing-count "0 passing", failing-count "0 failing".
- Grade edit cancel: original value restored.
- Only one grade field edited at a time per student (other subjects remain closed).
