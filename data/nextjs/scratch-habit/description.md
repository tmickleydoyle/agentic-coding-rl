# Build a weekly habit tracker

Build a single-page React application that tracks habits across one week (the seven days
**Mon, Tue, Wed, Thu, Fri, Sat, Sun**, in that order, where **Sun is "today"** — the end of the
week).

What the app should do:

- **Add / remove habits.** A **Habit name** field plus an **Add habit** button adds a habit
  (ignore a blank or duplicate name). Each habit can be removed.
- **Weekly grid.** Each habit shows a checkbox for every one of the seven days. Clicking a day
  toggles whether the habit was done that day.
- **Per-habit stats**, updating live:
  - **Current streak** — the number of consecutive days done counting backward from **Sun**
    (the last day). If Sun is not done, the current streak is 0.
  - **Longest streak** — the longest run of consecutive done-days anywhere in the week.
  - **Completion** — done days ÷ 7 as a whole-number percentage (e.g. 3 of 7 → `43%`).

  Show them as `Current streak: 2`, `Longest streak: 3`, and `Completion: 43%`.
- Each habit's stats are independent of the others.

All state is in memory. Implement the root component as the default export of `app/page.tsx`. Use
only `react` and `react-dom` — no other libraries, no Next.js APIs.
