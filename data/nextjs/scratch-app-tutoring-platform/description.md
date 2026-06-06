# scratch-app-tutoring-platform

A tutoring marketplace where students can browse tutors by subject, book sessions, and manage booking statuses.

## Routes
- **Home** (`home`): Dashboard with tutor count, booking count, available tutor count.
- **Tutors** (`tutors`): List tutors with name, rate, rating, subjects; filter to show only available tutors.
- **Bookings** (`bookings`): List bookings with status; add new booking (tutor, subject, student, date, time, duration); confirm/cancel bookings; show total cost (excluding cancelled).
- **Subjects** (`subjects`): Browse tutors by subject with tab buttons; show tutor count per subject.

## Seed Data
- Tutors: Dr. Sarah Chen (Math+Science, $75/hr, 4.9, available), James Wilson (English+History, $55/hr, 4.7, available), Maria Santos (CS+Math, $80/hr, 4.8, unavailable)
- Bookings: Alex Turner with Sarah Chen (Math, 2024-03-10, 10:00, 1hr, confirmed), Jamie Lee with James Wilson (English, 2024-03-12, 14:00, 2hr, pending)

## Behaviors
- Booking requires tutor, student name, date, startTime; duration must be positive
- Confirm/Cancel updates booking status reactively
- Total cost = sum of (tutor hourlyRate × durationHours) for non-cancelled bookings
- Subject filter shows only tutors whose subjects array includes selected subject
- Available filter hides tutors where available=false

## API (app/api/tutors/route.ts)
- GET /api/tutors — returns all tutors
- POST /api/tutors — creates tutor (name, subjects[], hourlyRate, bio); 400 if missing name/subjects/rate, empty subjects array, or negative rate
