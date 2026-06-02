# Build an Appointment Book app

Build a complete single-page React application — a simple appointment book for a small service business — with **three views** the user navigates between using a top navigation bar: **Appointments**, **Summary**, and **Settings**. The app starts on the Appointments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Appointments**, **Summary**, **Settings**) switches the active view.

**Appointments** — the main list of appointments.
- Three inputs: one labeled **Customer**, one labeled **Service**, and a dropdown labeled **Status** with options **booked**, **done**, and **no-show**.
- An **Add Appointment** button adds the appointment (ignore entries where Customer or Service is blank).
- Below the inputs, a row of three filter buttons: **All**, **Booked**, **Done**, **No-show** (four buttons total). The active filter is applied to the list below.
- Each appointment row shows the customer name, the service, and the status. Each row also has a **Mark done** button (disabled if status is already **done**) and a **Mark no-show** button (disabled if status is already **no-show**).
- A heading above the list shows the count of currently displayed appointments, e.g. `Showing: 3`.

**Summary** — a read-only derived stats panel:
- `Total: N` — total number of appointments.
- `Booked: N` — number with status booked.
- `Done: N` — number with status done.
- `No-show: N` — number with status no-show.
- `Completion: P%` — done ÷ total as a whole-number percent (0% when there are no appointments).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with NO appointments on first load (empty list).
