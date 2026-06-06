# Attendance Tracker App

Build a multi-route attendance tracking app with four views: Home, Attendance, Students, and Summary.

## Seed Data
- Students: [
    { id: 1, name: "Alice Johnson" },
    { id: 2, name: "Bob Martinez" },
    { id: 3, name: "Carol White" },
    { id: 4, name: "David Lee" }
  ]
- Attendance records: [
    { id: 1, studentId: 1, date: "2024-01-15", status: "present" },
    { id: 2, studentId: 2, date: "2024-01-15", status: "absent" },
    { id: 3, studentId: 3, date: "2024-01-15", status: "present" },
    { id: 4, studentId: 4, date: "2024-01-15", status: "late" },
    { id: 5, studentId: 1, date: "2024-01-16", status: "present" },
    { id: 6, studentId: 2, date: "2024-01-16", status: "present" }
  ]

## Routes / Pages
- **Home** (`home`): Shows "Attendance Tracker" title. Today's date. Total students count. "Mark Attendance" → attendance, "View Summary" → summary.
- **Attendance** (`attendance`): Date picker (default today). Lists all students with status select (present/absent/late) for each. "Save Attendance" button submits all. Shows existing records for selected date pre-filled.
- **Students** (`students`): Lists students with name. Add student form (name input + "Add Student"). Remove button per student.
- **Summary** (`summary`): Per-student attendance stats. Each row: student name, present count, absent count, late count, attendance rate (present/total sessions as %). Total sessions = distinct dates in records.

## Behaviors
- GET `/api/attendance` → `{ students, records }`
- POST `/api/attendance?type=student` with `{ name }` → add student
- DELETE `/api/attendance?type=student` with `{ id }` → remove student + their records
- POST `/api/attendance?type=records` with `{ date, records: [{studentId, status}] }` → upsert records for that date (replace existing)
- Empty student name returns 400.
- Status must be "present" | "absent" | "late" (400 otherwise).

## Fields
- Student: `{ id: number, name: string }`
- AttendanceRecord: `{ id: number, studentId: number, date: string, status: "present" | "absent" | "late" }`

## Edge Cases
- Saving attendance for same date replaces existing records for that date.
- Summary shows 0% for students with no records.
- Removing a student removes their attendance records too.
