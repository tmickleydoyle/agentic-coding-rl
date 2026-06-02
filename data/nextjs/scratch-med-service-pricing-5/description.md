# Build a Service Pricing Manager

Build a complete single-page React application for managing a business service menu, with **three views** the user navigates between using a top navigation bar: **Services**, **Stats**, and **Settings**. The app starts on the Services view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Stats**, **Settings**) switches the active view.

**Services** — the main list of offered services.
- An input labeled **Service name** and an input labeled **Price** plus an **Add service** button adds a new service (ignore if name is blank or price is not a positive number). New services start as **active**.
- Each service row shows the service name, the price formatted as `$X.XX`, and a toggle button labeled **Deactivate** (if currently active) or **Activate** (if currently inactive) that flips the active state.
- A filter row has two buttons: **Show all** and **Show active only**. The current filter is applied to the list. Default filter is **Show all**.
- An active service count line reads `Active: N of M` where N is the number of active services and M is the total.

**Stats** — a read-only summary derived from the services list:
- `Total services: N`
- `Active services: N`
- `Inactive services: N`
- `Average price: $X.XX` (average across ALL services regardless of active state; `$0.00` when there are none)
- `Active average: $X.XX` (average price of active services only; `$0.00` when there are none)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all services** button that removes every service from the list.

Seed the app with these three services already in the list on first render:
- "Haircut" at $25.00, active
- "Color treatment" at $85.00, active
- "Deep condition" at $40.00, active

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).