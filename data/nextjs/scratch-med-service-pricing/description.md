# Build a Service Pricing Manager

Build a complete single-page React application — a service menu tool for a small business — with **three views** the user navigates between using a top navigation bar: **Services**, **Stats**, and **Settings**. The app starts on the Services view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Stats**, **Settings**) switches the active view.

## Seed data
The app should start with these three services already in the list:
- Name: `Haircut`, Price: `25.00`, active: true
- Name: `Coloring`, Price: `80.00`, active: true
- Name: `Trim`, Price: `15.00`, active: false

**Services** — the main list of offered services.
- An input labeled **Service name** and an input labeled **Price ($)** plus an **Add service** button adds a new service (ignore if name is blank or price is not a positive number). New services default to **active**.
- Each service row shows its name, its price formatted as `$N.NN` (two decimal places), and a toggle button labeled **Deactivate** (when active) or **Activate** (when inactive) that flips the active state.
- A **Delete** button on each row removes that service entirely.
- Above the list, show a live count of active services as `Active: N of M` where N is the number of active services and M is the total number of services.

**Stats** — a read-only summary, shown as text lines:
- `Total services: N`
- `Active: N`
- `Inactive: N`
- `Average price (all): $N.NN` — average price across ALL services (active and inactive); show `$0.00` when there are no services.
- `Average price (active): $N.NN` — average price of ACTIVE services only; show `$0.00` when there are no active services.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Hide inactive** checkbox; when checked, inactive services are hidden in the Services view (they are still counted in Stats).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
