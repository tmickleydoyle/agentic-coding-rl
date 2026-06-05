# Build an Appointment Book app

Build a complete single-page React application — a simple appointment booking tool for a small service business — with **three views** the user navigates between using a top navigation bar: **Appointments**, **Summary**, and **Settings**. The app starts on the Appointments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Appointments**, **Summary**, **Settings**) switches the active view.

**Appointments** — the main list of all appointments.
- A form with:
  - An input labeled **Customer name** for the customer's name.
  - An input labeled **Service** for the service being provided (e.g. Haircut, Massage).
  - A **Add appointment** button that adds the appointment with status **booked** (ignore if either field is blank).
- A filter row with three buttons: **All**, **Booked**, **Done**, **No-show**. The active filter is indicated. The default filter is **All**.
- Below the filter, show a count line in the format `Showing: N appointments`.
- Each appointment row shows the customer name, service, and a status badge showing the current status.
- Each appointment row also has a **Mark done** button (disabled if status is already `done`), a **Mark no-show** button (disabled if status is already `no-show`), and a **Delete** button.
- Seed the app with these three appointments so tests can rely on them: customer `Alice`, service `Haircut`, status `booked`; customer `Bob`, service `Massage`, status `done`; customer `Carol`, service `Facial`, status `no-show`.

**Summary** — a read-only stats view computed from all appointments:
- Show the line `Total: N` (all appointments).
- Show `Booked: N`.
- Show `Done: N`.
- Show `No-show: N`.
- Show `Completion rate: P%` where P is done ÷ total as a whole-number percent (0% when there are no appointments).

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
