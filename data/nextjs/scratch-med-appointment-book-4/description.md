# Build an Appointment Book app

Build a complete single-page React application — a simple appointment book for a small service business — with **three views** the user navigates between using a top navigation bar: **Appointments**, **Summary**, and **Settings**. The app starts on the Appointments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Appointments**, **Summary**, **Settings**) switches the active view.

**Appointments** — the main list of all appointments.
- A form with three fields:
  - An input labeled **Customer** (customer name)
  - An input labeled **Service** (service description)
  - A select labeled **Status** with options **booked**, **done**, **no-show**
  - An **Add Appointment** button that appends the appointment to the list (ignore if Customer or Service is blank)
- A filter row with a select labeled **Filter by status** with options **all**, **booked**, **done**, **no-show**. Changing this select filters the visible list. The default filter is **all**.
- The visible list shows only appointments matching the active filter (or all when filter is **all**).
- Each appointment row shows the customer name, service, and status. Each row also has a **Delete** button (labeled `Delete <customer>`) that removes that appointment entirely.
- A count line below the list reads `Showing: N` where N is the number of currently visible (filtered) appointments.

**Summary** — a read-only derived view:
- Shows the line `Total: N` where N is all appointments regardless of filter.
- Shows `Booked: N`, `Done: N`, `No-show: N` counts.
- Shows `Done rate: P%` where P is done ÷ total as a whole-number percent (0% when total is 0).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with **no initial appointments** (empty list).
