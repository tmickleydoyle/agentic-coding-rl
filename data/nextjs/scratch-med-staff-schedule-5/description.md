# Build a Staff Schedule app

Build a complete single-page React application — a simple internal shift-scheduling tool — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main list of scheduled shifts.
- An input labeled **Employee name** and an input labeled **Hours** (numeric, positive integers only) plus an **Add shift** button add a new shift entry. Ignore the entry if either field is blank or if hours is not a positive number.
- Below the inputs, show a select/dropdown labeled **Filter by employee** that lists **All** plus each distinct employee name currently in the list. Choosing a name shows only that employee's shifts; choosing **All** shows everyone's.
- Each shift entry in the list shows the employee name and hours in the format `Name — N hrs`.
- A **Remove** button on each row deletes that shift.
- Below the list show the total hours for the currently visible (filtered) shifts as `Showing total: N hrs`.

**Summary** — a read-only stats view derived from all shifts (ignores the filter).
- Show `Total shifts: N`.
- Show `Total hours: N`.
- For every distinct employee (sorted A–Z), show one line: `Name: N hrs` (their personal total).
- If there are no shifts at all, show the text `No shifts recorded`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed no initial data — the app starts empty. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).