# Build an Appointment Book app

Build a complete single-page React application — a simple appointment book for a small service business — with **three views** the user navigates between using a top navigation bar: **Appointments**, **Summary**, and **Settings**. The app starts on the Appointments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Appointments**, **Summary**, **Settings**) switches the active view.

**Appointments** — the main list of appointments.
- Three inputs labeled **Customer**, **Service**, and a dropdown labeled **Status** (options: `booked`, `done`, `no-show`) plus an **Add appointment** button adds a new appointment (ignore if Customer or Service is blank).
- Each appointment row shows the customer name, service name, and status.
- A filter control: a dropdown labeled **Filter by status** with options `all`, `booked`, `done`, `no-show`. When a filter is selected, only appointments matching that status are shown (the full list is still used for Summary counts). Default filter is `all`.
- Each appointment row has a **Delete** button that removes it from the list.
- The heading shows the count of currently displayed appointments: `Appointments (N)` where N reflects the active filter.

**Summary** — a read-only derived view showing counts:
- `Total: N` — all appointments
- `Booked: N`
- `Done: N`
- `No-show: N`
- `Completion: P%` where P is the number of done appointments divided by total, expressed as a whole-number percent (0% when there are no appointments).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- The button label shows the current theme: `Toggle theme (current: light)` or `Toggle theme (current: dark)`.

Seed the app with these three appointments already present on first render:
1. Customer: `Alice`, Service: `Haircut`, Status: `booked`
2. Customer: `Bob`, Service: `Massage`, Status: `done`
3. Customer: `Carol`, Service: `Facial`, Status: `no-show`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
