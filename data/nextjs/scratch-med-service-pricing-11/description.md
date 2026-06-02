# Build a Service Pricing Manager

Build a complete single-page React application — a service menu manager for a small business — with **three views** the user navigates between using a top navigation bar: **Services**, **Stats**, and **Settings**. The app starts on the Services view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Stats**, **Settings**) switches the active view.

**Services** — the main list of services offered.
- An input labeled **Service name** and an input labeled **Price** (accepts a number), plus an **Add service** button adds a new service (ignore if name is blank or price is not a valid positive number).
- Each service row shows its name, its price formatted as `$X.XX` (two decimal places), and a toggle button labeled **Deactivate** when the service is active or **Activate** when it is inactive.
- Above the list show a filter: a checkbox labeled **Active only** that, when checked, hides inactive services from the list (they still count in Stats).
- Each service row also has a **Delete** button that removes the service entirely.
- The section heading reads **Services (N)** where N is the total number of services (active + inactive).

**Stats** — a read-only summary computed from the full service list (unaffected by the Active only filter):
- `Total services: N`
- `Active services: N`
- `Inactive services: N`
- `Average price: $X.XX` (average of ALL services regardless of status; `$0.00` when there are none)
- `Active average: $X.XX` (average price of active services only; `$0.00` when none are active)

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three services already present (active by default):
1. Name: `Haircut`, Price: `25.00`
2. Name: `Beard Trim`, Price: `15.00`
3. Name: `Hair Color`, Price: `80.00`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).