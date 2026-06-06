# Attendance Sheet

A single-page React app for tracking daily student attendance.

## Seed Data

5 students, each with attendance records for 5 days (Mon–Fri of one week):

| ID | Name          | Mon   | Tue    | Wed     | Thu   | Fri    |
|----|---------------|-------|--------|---------|-------|--------|
| 1  | Alice Johnson | present | present | absent | present | present |
| 2  | Bob Smith     | absent  | present | present | absent  | present |
| 3  | Carol White   | present | absent  | present | present | present |
| 4  | David Lee     | present | present | present | present | absent  |
| 5  | Eve Adams     | absent  | absent  | absent  | present | present |

Days array (in order): `["Mon", "Tue", "Wed", "Thu", "Fri"]`

Status values: `"present"` | `"absent"`

## UI Layout

### Heading
`<h1>Attendance Sheet</h1>`

### Attendance Table
A table with columns: **Student**, then one column per day (**Mon**, **Tue**, **Wed**, **Thu**, **Fri**), then **Present**, **Absent**, **Rate**.

Each student row (`data-testid="attendance-row"`):
- `data-testid="student-name"` — student name
- For each day, a button labeled the current status (`"present"` or `"absent"`) that toggles between the two when clicked. Each day-cell button has `data-testid="day-{dayName}-{studentId}"` e.g. `data-testid="day-Mon-1"`.
- `data-testid="present-count"` — number of days present
- `data-testid="absent-count"` — number of days absent
- `data-testid="attendance-rate"` — attendance rate as percentage rounded to 0 decimal places, e.g. `80%`

### Summary Row
Below the table, or as a tfoot row, show:
- `data-testid="total-present"` — total present count across all students and days
- `data-testid="total-absent"` — total absent count across all students and days
- `data-testid="class-rate"` — overall class attendance rate as percentage rounded to 0 decimal places

### Add Student Form
- Text input labeled **"New Student Name"**
- Button **"Add Student"** — adds a new student with all 5 days defaulting to `"absent"`; does nothing if name is blank; clears the input after adding

## Edge Cases
- Toggling a day cell immediately updates present/absent counts and rate.
- Adding a student shows them in the table with 0% attendance rate.
- Do not add student if name is empty or whitespace-only.
