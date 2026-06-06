# Gradebook App

Build a multi-route gradebook application with four views: Home, Grades, Students, and Reports.

## Seed Data
Pre-populate with:
- Students: [{ id:1, name:"Alice Johnson" }, { id:2, name:"Bob Martinez" }, { id:3, name:"Carol White" }]
- Subjects: ["Math", "Science", "English"]
- Grades: [
    { id:1, studentId:1, subject:"Math", score:92, maxScore:100 },
    { id:2, studentId:1, subject:"Science", score:85, maxScore:100 },
    { id:3, studentId:2, subject:"Math", score:78, maxScore:100 },
    { id:4, studentId:3, subject:"English", score:95, maxScore:100 }
  ]

## Routes / Pages
- **Home** (`home`): Shows app title "Gradebook", total students count, total grades count. Buttons: "Manage Students" → students, "Enter Grades" → grades.
- **Students** (`students`): Lists all students. Form to add student (name input + "Add Student" button). Each student row shows name and a remove button. Shows total count.
- **Grades** (`grades`): Shows grade entries. Select dropdown for student (by name), input for subject, numeric input for score (0-100), "Add Grade" button. Lists all grades showing student name, subject, score/maxScore (e.g. "92/100").
- **Reports** (`reports`): Shows per-student averages. Each student row shows name and their average score (rounded to 1 decimal, e.g. "88.5"). Shows overall class average. Displays letter grade: A(90+), B(80-89), C(70-79), D(60-69), F(<60).

## Behaviors
- GET `/api/gradebook` → `{ students, grades, subjects }`
- POST `/api/gradebook?type=student` with `{ name }` → add student (id auto-increment from 4)
- DELETE `/api/gradebook?type=student` with `{ id }` → remove student; also removes all their grades
- POST `/api/gradebook?type=grade` with `{ studentId, subject, score, maxScore }` → add grade (id auto-increment)
- Validation: student name must not be empty (400); score must be 0-100 (400).
- Reports compute average from all grades for that student. If no grades, show "N/A".

## Fields
- Student: `{ id: number, name: string }`
- Grade: `{ id: number, studentId: number, subject: string, score: number, maxScore: number }`

## Edge Cases
- Deleting a student removes their grades from the grades list.
- Student with no grades shows "N/A" average in reports.
- Grade score outside 0-100 returns 400.
- NavBar active state matches current route.
