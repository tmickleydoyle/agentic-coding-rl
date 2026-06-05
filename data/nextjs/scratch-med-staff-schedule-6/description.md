# Build a Staff Schedule app

Build a complete single-page React application — a lightweight shift scheduling tool for a small business — with **three views** the user navigates between using a top navigation bar: **Shifts**, **Summary**, and **Settings**. The app starts on the Shifts view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Shifts**, **Summary**, **Settings**) switches the active view.

**Shifts** — the main shift list.
- An input labeled **Employee name** and an input labeled **Hours** plus an **Add shift** button adds a new shift (ignore if either field is blank or if hours is not a positive number).
- Each shift row shows the employee's name and hours in the format `Alice — 6h`.
- A dropdown labeled **Filter by employee** lists `All` plus every distinct employee name currently in the list (in the order they first appear). Selecting a name shows only that employee's shifts; selecting `All` shows every shift.
- Each shift row has a **Delete** button that removes that shift.
- A total line beneath the list always shows the total hours for the currently visible shifts in the format `Visible total: Nh` (where N is the sum of hours for the displayed rows).

**Summary** — a read-only stats panel derived from **all** shifts (ignoring the filter).
- Shows `Total shifts: N` and `Total hours: Nh`.
- For each distinct employee (in the order they first appear), shows one line in the format `Alice: Nh` listing that employee's total hours across all their shifts.
- If there are no shifts at all, shows `No shifts recorded`.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed no initial data; the app starts with an empty shift list.
