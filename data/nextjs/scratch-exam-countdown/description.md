# Exam Countdown

A single-page React app for tracking upcoming exams and showing days remaining until each exam.

## Seed Data

5 exams with a fixed reference date of **2024-02-09** for computing days remaining:

| ID | Subject    | Title                   | Exam Date  | Notes                    |
|----|------------|-------------------------|------------|--------------------------|
| 1  | Math       | Calculus Final          | 2024-02-16 | Chapters 1-8             |
| 2  | Science    | Physics Midterm         | 2024-02-12 | Lab practicals included  |
| 3  | English    | Literature Essay Exam   | 2024-02-20 | Open book               |
| 4  | History    | World War II Test       | 2024-02-09 | Multiple choice          |
| 5  | Computer Science | Algorithm Quiz   | 2024-02-14 | Sorting and graphs       |

## Days Remaining Calculation

Use a fixed reference date: `2024-02-09` (do NOT use `new Date()` — hard-code this reference).

Days remaining = exam date minus reference date in whole days.
- If exam date equals reference date: 0 days
- If exam date is in the past relative to reference: negative number (show as-is, e.g. `-3`)

## UI Layout

### Heading
`<h1>Exam Countdown</h1>`

### Sort Controls
- A select labeled **"Sort by"** with options: `"Date"`, `"Subject"`, `"Days Remaining"`
- Default sort: **"Date"** (ascending by exam date)

### Exam List
Show all exams sorted by the selected sort order.

Each exam card (`data-testid="exam-card"`):
- `data-testid="exam-subject"` — subject text
- `data-testid="exam-title"` — title text
- `data-testid="exam-date"` — exam date string as stored, e.g. `2024-02-16`
- `data-testid="exam-days"` — days remaining as a number string, e.g. `7`
- `data-testid="exam-notes"` — notes text
- A button **"Remove"** that removes the exam from the list

### Add Exam Form
- Text input labeled **"Subject"**
- Text input labeled **"Title"**
- Date input labeled **"Exam Date"**
- Text input labeled **"Notes"** (optional)
- Button **"Add Exam"** — adds exam; does nothing if subject or title is blank; clears all inputs

### Summary
- `data-testid="exam-count"` — total number of exams
- `data-testid="next-exam"` — title of the exam with the fewest days remaining (>= 0); if all exams have negative days remaining, show the one closest to 0; if no exams exist, show `"None"`

## Edge Cases
- Remove button immediately removes the exam.
- After adding, new exam appears in the list sorted correctly.
- Summary always reflects current list.
- Sort is case-insensitive for subject sort.
