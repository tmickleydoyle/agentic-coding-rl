# Build a Service Pricing Manager

Build a complete single-page React application — a simple service menu tool — with **three views** the user navigates between using a top navigation bar: **Services**, **Summary**, and **Settings**. The app starts on the Services view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Summary**, **Settings**) switches the active view.

**Services** — the main list of services offered.
- An input labeled **Service name** and an input labeled **Price** plus an **Add service** button adds a new service (ignore if name is blank or price is not a valid positive number).
- Each service row shows its name, its price formatted as `$X.XX` (two decimal places), and an **Active** toggle button. When active the button reads **Active**; when inactive it reads **Inactive**.
- Each service row also has a **Delete** button that removes it.
- A filter bar shows two buttons: **Show all** and **Show active only**. The default filter is **Show all**. When **Show active only** is selected, only active services are shown in the list (but all services still count in Summary stats).
- The section heading shows the count of currently visible services, like `Services (3)`.

**Summary** — a read-only derived stats view:
- `Total services: N` — total number of services regardless of filter.
- `Active services: N` — how many are currently toggled active.
- `Inactive services: N` — how many are inactive.
- `Average price: $X.XX` — average price across ALL services (show `$0.00` when there are none).
- `Active average: $X.XX` — average price of active services only (show `$0.00` when none are active).

**Settings**
- A **Toggle theme** button that switches the app theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Seed the app with these three services already present when it first loads:
- **Consultation**, price `50.00`, active
- **Design**, price `120.00`, active
- **Support**, price `30.00`, inactive

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
