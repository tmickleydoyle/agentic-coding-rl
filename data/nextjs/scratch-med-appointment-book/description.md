# Build an Appointment Book app

Build a complete single-page React application — a simple appointment book for a small service business — with **three views** the user navigates between using a top navigation bar: **Appointments**, **Summary**, and **Settings**. The app starts on the Appointments view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Appointments**, **Summary**, **Settings**) switches the active view.

**Appointments** — the main list of appointments.
- A form with three fields:
  - An input labeled **Customer** (customer name)
  - An input labeled **Service** (service description)
  - A select labeled **Status** with options: **booked**, **done**, **no-show**
- An **Add Appointment** button that adds the appointment to the list (ignore submissions where Customer or Service is blank; the Status defaults to **booked** if not changed).
- Each appointment row shows the customer name, service, and status, and has a **Delete** button (labeled `Delete <customer>`) that removes it.
- Each appointment row also has a **Status** select (labeled `Status for <customer>`) that allows changing the status inline between **booked**, **done**, and **no-show**.
- Above the list, three filter buttons: **All**, **Booked**, **Done**, **No-show** — clicking one filters the visible list. The active filter button shows the count in parentheses, e.g. `All (3)`, `Booked (1)`, `Done (1)`, `No-show (1)`. The filter buttons always show their respective counts regardless of which is active.
- The list heading shows `Showing: <N> appointment(s)` where N is the number currently visible after filtering.

**Summary** — a read-only stats panel derived from all appointments (unfiltered):
- `Total: N`
- `Booked: N`
- `Done: N`
- `No-show: N`
- `Completion rate: P%` where P is done ÷ total as a whole-number percent (0% when there are no appointments).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and persists as the user navigates between views.

Seed the app with these three appointments already present on load:
1. Customer: **Alice**, Service: **Haircut**, Status: **booked**
2. Customer: **Bob**, Service: **Massage**, Status: **done**
3. Customer: **Carol**, Service: **Facial**, Status: **no-show**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).