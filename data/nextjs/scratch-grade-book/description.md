# Grade Book

A single-page React app for tracking student grades across assignments.

## Seed Data

Three students with three assignments each:

| Student   | Math | Science | English |
|-----------|------|---------|---------|
| Alice      | 92   | 85      | 78      |
| Bob        | 76   | 90      | 88      |
| Carol      | 88   | 72      | 95      |

## UI Layout

- Page heading: "Grade Book"
- A table with columns: Student, Math, Science, English, Average
- Each row shows the student name, their three grades, and their computed average (mean of 3 grades, one decimal place)
- Below the table: an "Add Grade" form

## Add Grade Form

Fields:
- Text input labeled "Student Name"
- Number input labeled "Math Grade" (0–100)
- Number input labeled "Science Grade" (0–100)
- Number input labeled "English Grade" (0–100)
- Button labeled "Add Student"

On submit:
- All fields required; grades must be valid numbers between 0 and 100 (inclusive)
- If validation fails, do nothing (no alert)
- Append a new row to the table
- Clear all form fields after successful add

## Table Row Data-testids

- Each student row: `data-testid="student-row"`
- Each average cell: `data-testid="student-avg"`

## Class Averages

Below the table, display per-subject class averages (mean across all students):
- `data-testid="class-avg-math"` — "Math Avg: X.X"
- `data-testid="class-avg-science"` — "Science Avg: X.X"
- `data-testid="class-avg-english"` — "English Avg: X.X"

## Behavior Details

- Average = (math + science + english) / 3, displayed to 1 decimal place
- Class averages update when new students are added
- Reject submission if student name is empty or any grade is outside [0, 100]
