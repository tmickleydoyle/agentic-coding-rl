# Build a Staff Schedule app

Build a complete single-page React application — a simple internal shift scheduling tool — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main shift list.
- An input labeled **Employee name** and an input labeled **Hours** (numeric), plus an **Add shift** button that adds a new shift entry. Ignore entries where the employee name is blank or hours is not a positive number.
- Below the inputs, a dropdown labeled **Filter by employee** that lists **All** plus each unique employee name. Selecting an employee shows only that employee's shifts; selecting **All** shows every shift.
- Each shift row shows the employee name and hours in the format `Name — N hrs` (using an em dash). Each row also has a **Remove** button that deletes that shift.
- While a filter is active, a summary line reads `Showing: N shifts` where N is the count of currently visible shifts. When the filter is **All**, the line reads `Showing: N shifts` counting all shifts.

**Summary** — a read-only derived view.
- Shows the heading **Summary**.
- Lists each unique employee with their total hours in the format `Name: N hrs`.
- Shows a total line at the bottom: `Total hours: N` where N is the sum of all shifts across all employees.
- Shows an employee count line: `Employees: N` where N is the number of distinct employee names.
- When there are no shifts at all, still shows `Total hours: 0` and `Employees: 0`.

**Settings**
- A **Toggle theme** button switches the app between light and dark mode. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.
- Displays the current theme label like `Current theme: light` or `Current theme: dark`.

Seed NO initial data — the app starts empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
