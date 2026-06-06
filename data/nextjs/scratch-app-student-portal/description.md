# Student Portal App

Build a multi-route student portal with four views: Home, Courses, Profile, and Progress.

## Seed Data
- Student profile: { id: 1, name: "Alex Rivera", email: "alex@school.edu", grade: "10th" }
- Available courses: [
    { id: 1, title: "Algebra II", instructor: "Mr. Johnson", credits: 3, enrolled: true },
    { id: 2, title: "Biology", instructor: "Ms. Park", credits: 4, enrolled: true },
    { id: 3, title: "World History", instructor: "Dr. Chen", credits: 3, enrolled: false },
    { id: 4, title: "Art Elective", instructor: "Ms. Torres", credits: 2, enrolled: false }
  ]
- Progress records: [
    { courseId: 1, completed: 6, total: 12, lastActivity: "2024-01-15" },
    { courseId: 2, completed: 3, total: 10, lastActivity: "2024-01-14" }
  ]

## Routes / Pages
- **Home** (`home`): Shows "Welcome, Alex Rivera". Enrolled courses count. Buttons: "My Courses" → courses, "View Progress" → progress.
- **Courses** (`courses`): Lists all courses. Each shows title, instructor, credits. "Enroll" button if not enrolled; "Drop" button if enrolled. Shows enrollment status badge "Enrolled" or "Available".
- **Profile** (`profile`): Shows student name, email, grade. Form to update name (input + "Save" button). Shows "Profile updated" on success.
- **Progress** (`progress`): Shows progress for enrolled courses. Each row: course title, completed/total (e.g. "6/12"), percentage (e.g. "50%"), last activity date.

## Behaviors
- GET `/api/portal` → `{ student, courses, progress }`
- PATCH `/api/portal?type=profile` with `{ name }` → update student name
- POST `/api/portal?type=enroll` with `{ courseId }` → enroll in course (set enrolled: true)
- POST `/api/portal?type=drop` with `{ courseId }` → drop course (set enrolled: false); also removes progress record if exists
- Enrollment count on home updates reactively.
- Cannot update profile with empty name (400).

## Fields
- Student: `{ id: number, name: string, email: string, grade: string }`
- Course: `{ id: number, title: string, instructor: string, credits: number, enrolled: boolean }`
- Progress: `{ courseId: number, completed: number, total: number, lastActivity: string }`

## Edge Cases
- Enrolling in already-enrolled course returns 409.
- Dropping a non-enrolled course returns 400.
- Progress page shows only enrolled courses with progress records.
- Empty name returns 400 from API.
