# Build a Staff Shift Scheduler app

Build a complete single-page React application — a simple internal shift management tool — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main list of scheduled shifts.
- An input labeled **Employee name** and an input labeled **Hours** (numeric) plus an **Add shift** button adds a shift to the list (ignore if either field is blank or hours is not a positive number).
- A dropdown labeled **Filter by employee** lists "All" plus each unique employee name already entered. Selecting a name shows only that employee's shifts; selecting "All" shows every shift.
- Each shift row shows the employee name and hours in the format `Alice — 6h`.
- Each shift row has a **Delete** button that removes that shift.
- At the bottom of the list, show total visible hours in the format `Visible total: Nh` where N is the sum of hours of the currently displayed (filtered) shifts.

**Summary** — a read-only derived view computed from all shifts (ignoring the filter).
- Shows the heading **Summary**.
- Lists every unique employee and their total hours in the format `Alice: 14h`.
- Shows a line `Total shifts: N` (count of all shifts ever added and not deleted).
- Shows a line `Total hours: Nh` (sum of all shifts' hours).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all shifts** button removes every shift from the list immediately.

Seed the app with these three shifts already present on first load:
- Alice, 8 hours
- Bob, 6 hours
- Alice, 4 hours

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).