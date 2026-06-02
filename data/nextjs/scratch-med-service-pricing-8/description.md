# Build a Service Pricing Manager

Build a complete single-page React application — a service menu manager for a small business — with **three views** the user navigates between using a top navigation bar: **Services**, **Stats**, and **Settings**. The app starts on the Services view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Stats**, **Settings**) switches the active view.

**Services** — the main list of services offered.
- An input labeled **Service name** and an input labeled **Price** plus an **Add service** button adds a new service (ignore if name is blank or price is not a valid positive number). New services are **active** by default.
- Each service row shows its name, its price formatted as `$X.XX` (two decimal places), and a toggle button labeled **Deactivate** (if currently active) or **Activate** (if currently inactive).
- The list heading reads `Services (N)` where N is the total number of services (active + inactive).
- An **Active only** checkbox (labeled **Active only**) filters the list to show only active services when checked. The heading count always reflects the total regardless of filter.

**Stats** — a read-only summary computed from all services:
- `Total services: N`
- `Active: N`
- `Inactive: N`
- `Average price: $X.XX` (average of ALL services, or `$0.00` when there are none)
- `Active average: $X.XX` (average of active services only, or `$0.00` when there are none)

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset services** button clears all services from the list.

Seed the app with these three services already in the list on first load:
- **Haircut**, price `25.00`, active
- **Color treatment**, price `85.00`, active
- **Deep conditioning**, price `45.00`, inactive

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.