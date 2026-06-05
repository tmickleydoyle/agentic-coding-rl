# Build a Service Pricing Manager

Build a complete single-page React application — a service menu manager for a small business — with **three views** the user navigates between using a top navigation bar: **Services**, **Stats**, and **Settings**. The app starts on the Services view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Stats**, **Settings**) switches the active view.

**Services** — a list of services the business offers.
- An input labeled **Service name** and an input labeled **Price** plus an **Add service** button adds a new service (ignore if name is blank or price is not a valid positive number).
- Each service row shows its name, its price formatted as `$X.XX` (two decimal places), and an **Active** / **Inactive** toggle button that switches the service between active and inactive states. New services start as **Active**.
- A read-only count line at the top of the list reads `Active: N of M` where N is the number of active services and M is the total number of services.

**Stats** — a read-only summary derived from the services list:
- `Total services: N`
- `Active services: N`
- `Inactive services: N`
- `Average price: $X.XX` (average across ALL services regardless of active state; show `$0.00` when there are no services)
- `Active average: $X.XX` (average price of active services only; show `$0.00` when there are no active services)

**Settings**
- A **Toggle theme** button that switches between light and dark theme. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Hide inactive** checkbox; when checked, inactive services are hidden in the Services view (they still count in Stats).

Seed the app with these three services already present:
- **Haircut**, price `25.00`, active
- **Color treatment**, price `85.00`, active
- **Blowout**, price `40.00`, inactive

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
