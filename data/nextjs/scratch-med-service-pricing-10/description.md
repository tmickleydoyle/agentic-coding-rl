# Build a Service Pricing Manager

Build a complete single-page React application for managing a studio's service menu. It has **three views** the user navigates between using a top navigation bar: **Services**, **Stats**, and **Settings**. The app starts on the **Services** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Stats**, **Settings**) switches the active view.

**Services** — the main list of offered services.
- An input labeled **Service name** and an input labeled **Price ($)** plus an **Add service** button adds a new service (ignore if name is blank or price is not a positive number).
- Each service row shows its name, its price formatted as `$N.NN` (two decimal places), and an **Active** / **Inactive** toggle button that switches the service's active state. New services start as **Active**.
- A summary line below the list reads `Active: N of M` where N is the number of active services and M is the total number of services.
- Services cannot be deleted; they can only be toggled.

**Stats** — a read-only derived summary:
- `Total services: N`
- `Active services: N`
- `Inactive services: N`
- `Average price (all): $N.NN` — average across ALL services regardless of active state, shown as `$0.00` when there are no services.
- `Average price (active): $N.NN` — average across active services only, shown as `$0.00` when there are no active services.

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute on a root element and persists as the user navigates between views.
- A **Show inactive** checkbox; when unchecked, inactive services are hidden on the Services view (they are still counted in Stats).

Seed the app with these three services so tests have data to work with:
- "Haircut" at $25.00, active
- "Color" at $80.00, active
- "Blowout" at $40.00, active

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
