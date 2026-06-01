# Build a day scheduler

Build a single-page React application for booking appointments within a single workday that runs
**09:00 to 17:00**, divided into 30-minute slots (16 slots in total).

What the app should do:

- **Book an appointment** with a **Title**, a **Start time** (any half-hour from 09:00 to 16:30),
  and a **Duration** of 30 or 60 minutes. A **Book** button adds it.
- **Conflict detection.** Reject a booking that **overlaps** an existing one, showing a message
  like `That time overlaps an existing booking`, and do not add it. Also reject a booking that
  would **run past 17:00** (e.g. a 60-minute booking starting at 16:30), showing
  `Booking runs past closing time`. A blank title is rejected too.
- **Bookings list.** Show all bookings **sorted by start time**, each with its title and time
  range like `09:00 - 10:00`, plus a control to **cancel** that booking.
- **Free slots.** Show the number of 30-minute slots still free, like `Free slots: 16`, updating
  as bookings are added and cancelled (a 60-minute booking consumes two slots).

All state is in memory. Implement the root component as the default export of `app/page.tsx`. Use
only `react` and `react-dom` — no other libraries, no Next.js APIs.
