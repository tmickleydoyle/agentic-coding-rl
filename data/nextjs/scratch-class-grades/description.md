# Class Grades Tracker

A single-page React app for tracking student grades across multiple assignments.

## Seed Data

Start with these 4 students:

| ID | Name           | Grades (out of 100) |
|----|----------------|---------------------|
| 1  | Alice Johnson  | [92, 88, 95]        |
| 2  | Bob Smith      | [78, 82, 70]        |
| 3  | Carol White    | [65, 71, 60]        |
| 4  | David Lee      | [100, 98, 99]       |

## UI Layout

### Heading
`<h1>Class Grades Tracker</h1>`

### Add Grade Form
- Text input labeled **"Student Name"** — for the new student's name
- Number input labeled **"Grade"** (min 0, max 100) — a single grade to add
- Button **"Add Student"** — adds a new student with that single grade; clears both inputs; does nothing if name is empty or grade is blank

### Student Table
Columns: **Name**, **Grades**, **Average**, **Letter Grade**

Each row has:
- `data-testid="student-row"` on the `<tr>`
- `data-testid="student-name"` — student name text
- `data-testid="student-grades"` — comma-separated list of grades, e.g. `92, 88, 95`
- `data-testid="student-avg"` — average rounded to 1 decimal place, e.g. `91.7`
- `data-testid="student-letter"` — letter grade computed from average

### Add Grade to Existing Student
Below the table, a section **"Add Grade to Student"**:
- Select labeled **"Select Student"** — options are all current student names (by name)
- Number input labeled **"New Grade"** (min 0, max 100)
- Button **"Add Grade"** — appends the grade to the selected student; does nothing if grade is blank

### Class Summary
- `data-testid="class-avg"` — overall class average (average of all student averages), rounded to 1 decimal
- `data-testid="top-student"` — name of student with highest average

## Letter Grade Logic
- A: average >= 90
- B: average >= 80
- C: average >= 70
- D: average >= 60
- F: below 60

## Edge Cases
- Ignore "Add Student" if name is blank or grade field is empty.
- Ignore "Add Grade" if grade field is empty.
- Class average and top student always reflect current state.
