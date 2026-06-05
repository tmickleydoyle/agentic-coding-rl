# Build an Appointment Book app

Build a complete single-page React application — an appointment book for a small service business — with **three views** the user navigates between using a top navigation bar: **Appointments**, **Summary**, and **Settings**. The app starts on the Appointments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Appointments**, **Summary**, **Settings**) switches the active view.

**Appointments** — the main list of appointments.
- A form with three inputs:
  - **Customer** (text input, labeled **Customer**)
  - **Service** (text input, labeled **Service**)
  - A **Status** select with options: **booked**, **done**, **no-show** (default: **booked**)
- An **Add Appointment** button adds the appointment (ignore if Customer or Service is blank).
- All existing appointments are listed below the form. Each row shows the customer name, service name, and status.
- Each appointment row has a **Delete** button (labeled `Delete`) that removes it.
- Above the list, show a **Filter by status** select with options: **all**, **booked**, **done**, **no-show**. When a filter is selected, only matching appointments are shown (the full list is still used for Summary stats). Default is **all**.
- Show a count line above the list (below the filter): `Showing: N of M` where N is the number of filtered appointments shown and M is the total number of appointments.
- Each appointment row also has a **Mark done** button that sets that appointment's status to **done** (always visible; clicking when already done is a no-op that keeps status as done).

**Summary** — a read-only statistics view computed from all appointments (not filtered):
- `Total: N`
- `Booked: N`
- `Done: N`
- `No-show: N`
- `Completion: P%` where P is done ÷ total as a whole-number percent (0% when there are no appointments).

**Settings**
- A **Toggle theme** button switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- Show the current theme label as text: `Theme: light` or `Theme: dark`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with NO appointments on load (empty list).