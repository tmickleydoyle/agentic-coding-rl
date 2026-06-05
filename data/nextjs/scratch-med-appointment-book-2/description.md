# Build an Appointment Book app

Build a complete single-page React application — a simple appointment tracking tool for a small service business — with **three views** the user navigates between using a top navigation bar: **Appointments**, **Summary**, and **Settings**. The app starts on the Appointments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Appointments**, **Summary**, **Settings**) switches the active view.

**Appointments** — a list of appointments with filtering.
- Three inputs and a button to add a new appointment:
  - An input labeled **Customer** for the customer name.
  - An input labeled **Service** for the service type.
  - A select labeled **Status** with options **booked**, **done**, and **no-show**.
  - An **Add appointment** button that appends the appointment to the list (ignore entries where Customer or Service is blank).
- Below the form, three filter buttons: **All**, **Booked**, **Done**, **No-show**. The active filter is applied to the list. The default active filter is **All**.
- Each appointment row shows: the customer name, the service, and the status (e.g. `Alice — Haircut — booked`).
- Each row also has a **Delete** button that removes that appointment.
- A count line above the list shows `Showing: N appointments` reflecting the filtered count.

**Summary** — a read-only derived view:
- `Total: N` — total appointments across all statuses.
- `Booked: N` — count with status booked.
- `Done: N` — count with status done.
- `No-show: N` — count with status no-show.
- `No-show rate: P%` — no-shows divided by total as a whole-number percent (0% when total is 0).

**Settings**
- A **Toggle theme** button that switches between **light** and **dark** themes. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
