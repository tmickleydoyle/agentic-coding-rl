# Tutor Sessions App

Build a multi-route tutor session booking app with four views: Home, Sessions, Tutors, and Booking.

## Seed Data
- Tutors: [
    { id: 1, name: "Dr. Allen", subject: "Math", rating: 4.8, available: true },
    { id: 2, name: "Prof. Baker", subject: "Science", rating: 4.5, available: true },
    { id: 3, name: "Ms. Clark", subject: "English", rating: 4.9, available: false }
  ]
- Sessions: [
    { id: 1, tutorId: 1, studentName: "Alice", date: "2024-02-01", time: "14:00", duration: 60, status: "completed" },
    { id: 2, tutorId: 2, studentName: "Bob", date: "2024-02-03", time: "10:00", duration: 45, status: "scheduled" },
    { id: 3, tutorId: 1, studentName: "Carol", date: "2024-02-05", time: "15:00", duration: 60, status: "scheduled" }
  ]

## Routes / Pages
- **Home** (`home`): Shows "Tutor Sessions" title. Total sessions count. Upcoming (scheduled) sessions count. Buttons: "Browse Tutors" → tutors, "My Sessions" → sessions.
- **Tutors** (`tutors`): Lists tutors with name, subject, rating (shown as "★ 4.8"), availability badge ("Available"/"Unavailable"). "Book Session" button for available tutors navigates to booking with tutorId pre-selected.
- **Sessions** (`sessions`): Lists all sessions showing tutor name, student name, date, time, duration (e.g. "60 min"), status badge. Filter buttons: "All", "Scheduled", "Completed". Cancel button on scheduled sessions (sets status to "cancelled").
- **Booking** (`booking`): Form with tutor select, student name input, date input, time input, duration select (30/45/60/90 min), "Book Session" submit button. On success shows "Session booked!" and resets form.

## Behaviors
- GET `/api/sessions` → `{ tutors, sessions }`
- POST `/api/sessions` with `{ tutorId, studentName, date, time, duration }` → book session (status: "scheduled")
- PATCH `/api/sessions` with `{ id, status }` → update session status
- Booking requires all fields (400 if missing).
- Cannot book with unavailable tutor (400).
- Duration must be one of 30, 45, 60, 90 (400 otherwise).

## Fields
- Tutor: `{ id: number, name: string, subject: string, rating: number, available: boolean }`
- Session: `{ id: number, tutorId: number, studentName: string, date: string, time: string, duration: number, status: "scheduled" | "completed" | "cancelled" }`

## Edge Cases
- Cancelling already-cancelled session returns 400.
- Filter shows correct subset of sessions.
- Rating displayed to 1 decimal place.
