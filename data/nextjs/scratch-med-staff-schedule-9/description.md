# Build a Staff Schedule app

Build a complete single-page React application — a staff shift scheduler — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main list of scheduled shifts.
- An input labeled **Employee name** for the employee's name.
- An input labeled **Hours** for the number of hours (numeric).
- An **Add shift** button that adds a shift (ignore if employee name is blank or hours is blank/zero).
- Each shift shows the employee name and hours in the format `Name — X hrs`.
- A dropdown labeled **Filter by employee** with an option `All` plus one option per unique employee name (in the order they were first added). Selecting an employee filters the list to show only that employee's shifts. Selecting `All` shows everyone.
- A total line always visible below the list: `Total hours: X` (sum of currently visible shifts only, whole number).
- Each shift has a **Remove** button that deletes that shift.

**Summary** — a read-only derived view:
- Shows `Total shifts: N` (all shifts, unfiltered).
- Shows one line per unique employee in the format `Name: X hrs` listing the total hours for that employee across all their shifts.
- If there are no shifts, shows `No shifts recorded`.

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed no initial data. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router). Implement the root component as the default export of `app/page.tsx`.
