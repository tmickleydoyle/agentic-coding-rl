# Build a Staff Schedule app

Build a complete single-page React application — a simple internal shift scheduling tool — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main list of scheduled shifts.
- An input labeled **Employee name** and a number input labeled **Hours** (minimum 0) plus an **Add shift** button adds a shift to the list (ignore a blank employee name or hours ≤ 0).
- Each shift displays the employee name and hours in the format `Alice — 8h`.
- A select/dropdown labeled **Filter by employee** lets the user filter the visible list to a specific employee. The options are **All** plus one option per unique employee name already in the list (no duplicates). Selecting an option hides shifts for other employees but does NOT delete them.
- A **Remove** button on each visible shift row deletes that shift permanently.
- A total line at the bottom of the view shows the hours for the currently visible (filtered) shifts in the format `Showing: Xh` where X is the sum of visible shifts' hours.

**Summary** — a read-only derived view.
- Shows a heading **Summary**.
- Lists each unique employee with their total hours across ALL shifts (not affected by the filter), in the format `Alice: 16h`.
- Shows an overall total at the bottom in the format `Total hours: Xh`.
- Shows the number of unique employees in the format `Employees: N`.

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with NO initial shifts — the list starts empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
