# Build an Appointment Book app

Build a complete single-page React application — a simple appointment management tool for a small service business — with **three views** the user navigates between using a top navigation bar: **Appointments**, **Summary**, and **Settings**. The app starts on the Appointments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Appointments**, **Summary**, **Settings**) switches the active view.

**Appointments** — the main list of appointments.
- An input labeled **Customer** for the customer name.
- An input labeled **Service** for the service type.
- An **Add appointment** button that adds the appointment with status **booked** (ignore if either field is blank).
- Each appointment shows the customer name, service, and status as a row.
- Each row has a **Mark done** button (disabled when the status is already `done`) that sets the status to `done`.
- Each row has a **Mark no-show** button (disabled when the status is already `no-show`) that sets the status to `no-show`.
- A filter control labeled **Filter by status** with options **All**, **booked**, **done**, **no-show** that filters the visible list (default: **All**).
- The heading shows a live count of visible appointments, like `Appointments (3)`.

**Summary** — a read-only stats panel derived from all appointments (ignores the filter):
- `Total: N`
- `Booked: N`
- `Done: N`
- `No-show: N`
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no appointments).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates.
- A **Clear all appointments** button that removes every appointment from the list.

Seed NO initial data — the list starts empty. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).