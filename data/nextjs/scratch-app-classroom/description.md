# Classroom Management App

Build a multi-route classroom management application with four views: Home, Roster, Schedule, and Assignments.

## Seed Data
Pre-populate with one classroom:
- Class: "Math 101", teacher: "Ms. Smith", room: "A204", period: 2
- Students: ["Alice Johnson", "Bob Martinez", "Carol White", "David Lee"] (ids 1-4)
- Schedule: Mon/Wed/Fri 09:00-09:50
- Assignments: "Homework 1" due "2024-02-01" (not submitted), "Quiz 1" due "2024-02-05" (submitted by Alice, Bob)

## Routes / Pages
- **Home** (`home`): Shows class name, teacher, room, period. Button "View Roster" navigates to roster. Button "View Schedule" navigates to schedule.
- **Roster** (`roster`): Lists all students by name. Each student row has a remove button. Form to add a new student (name input + "Add Student" button). Student count displayed.
- **Schedule** (`schedule`): Shows class meeting days and times. Displays formatted schedule string e.g. "Mon, Wed, Fri 09:00 - 09:50".
- **Assignments** (`assignments`): Lists assignments with name, due date, submission count. Button "Add Assignment" opens inline form (name + due date inputs). Each assignment row shows how many students submitted.

## Behaviors
- Adding a student: POST `/api/classes/students` with `{ name }` → student added with auto-incremented id, name trimmed.
- Removing a student: DELETE `/api/classes/students` with `{ id }` → student removed from roster.
- Adding assignment: POST `/api/classes/assignments` with `{ name, dueDate }` → assignment added.
- GET `/api/classes` returns `{ classroom, students, assignments }`.
- Student count on roster page updates immediately after add/remove.
- Empty name should not add a student (validate on client).
- NavBar shows links for all 4 routes; active route is highlighted with `data-active="true"`.

## Fields
- Student: `{ id: number, name: string }`
- Assignment: `{ id: number, name: string, dueDate: string, submittedBy: number[] }`
- Classroom: `{ name: string, teacher: string, room: string, period: number, schedule: { days: string[], startTime: string, endTime: string } }`

## Edge Cases
- Removing a student that does not exist returns 404.
- Adding a student with empty name returns 400.
- Assignment list shows "No assignments" when empty.
- Roster shows "No students" when empty.
