# Build a Staff Schedule app

Build a complete single-page React application — a shift scheduling tool for a small business — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main list of scheduled shifts.
- An input labeled **Employee name** and an input labeled **Hours** (numeric), plus an **Add shift** button that adds a shift entry (ignore if either field is blank or hours is not a positive number).
- A dropdown labeled **Filter by employee** that lists `All` plus each unique employee name; selecting a name filters the list to show only that employee's shifts. The filter persists when navigating away and back.
- Each shift row shows the employee name and hours in the format `Alice — 6h`.
- Each shift row has a **Delete** button (aria-label `Delete shift for <name>`) that removes that shift.
- Below the list, show the total hours for the currently filtered view as `Showing: X total hours` (X is a whole number; when filter is All, it is the grand total).

**Summary** — a read-only per-employee breakdown computed from all shifts (ignores the filter):
- Heading **Summary**.
- For each unique employee, one line in the format `Alice: 10h` (sorted alphabetically by name).
- A line showing the grand total of all shifts: `Grand total: Xh`.
- When there are no shifts, show the text `No shifts recorded`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across views.

Seed the app with **no initial shifts**. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
