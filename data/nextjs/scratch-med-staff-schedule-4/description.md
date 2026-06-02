# Build a Staff Shift Scheduler app

Build a complete single-page React application — a staff shift scheduling tool — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main list of shifts.
- An input labeled **Employee name** and a number input labeled **Hours** (minimum 0.5, step 0.5) plus an **Add shift** button adds a shift to the list (ignore blank employee name or hours ≤ 0).
- Each shift shows the employee name and hours in the format `Alice — 8h`.
- A dropdown labeled **Filter by employee** lets the user narrow the list to one employee or show all. The dropdown always contains an **All employees** option plus one option per unique employee name currently in the list. When "All employees" is selected, all shifts are shown.
- The total hours shown below the list updates live: `Total hours: N` where N is the sum of hours across the **currently filtered** shifts (whole number if an integer, e.g. `Total hours: 8`, otherwise one decimal place, e.g. `Total hours: 8.5`).
- Each shift has a **Remove** button that deletes it.

**Summary** — a read-only derived view showing one row per employee with their cumulative hours:
- Heading: **Summary**
- For each unique employee (in the order they first appear), show a line like `Alice: 16h` (whole number) or `Alice: 7.5h` (one decimal if needed).
- Below all employee rows, show `Grand total: Nh` (same formatting rule).
- When there are no shifts, show the text `No shifts recorded`.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).