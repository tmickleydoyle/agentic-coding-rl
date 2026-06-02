# Build a Staff Schedule app

Build a complete single-page React application — a simple internal shift scheduling tool — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main list of scheduled shifts.
- An input labeled **Employee name** and an input labeled **Hours** (a number) plus an **Add shift** button adds a shift to the list (ignore a blank employee name or a non-positive hours value).
- A dropdown labeled **Filter by employee** lists **All** plus every unique employee name that has been added. Selecting a name shows only that employee's shifts; selecting All shows every shift.
- Each shift in the list shows the employee name and hours in the format `Alice — 6h`.
- Each shift has a **Delete** button that removes it.
- Below the list, show the total hours for the currently visible (filtered) shifts as `Visible total: Nh` (e.g. `Visible total: 14h`).

**Summary** — a read-only derived view showing per-employee totals.
- For every employee who has at least one shift, show one line in the format `Alice: 14h` listing their total hours across all shifts (not filtered).
- Show an overall line `Total employees: N` and `Grand total: Nh` reflecting all shifts.
- When there are no shifts at all, show the text `No shifts recorded`.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Seed the app with NO initial shifts (empty list). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
