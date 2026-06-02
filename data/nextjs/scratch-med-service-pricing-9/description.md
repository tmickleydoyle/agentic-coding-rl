# Build a Service Pricing Manager

Build a complete single-page React application for managing a service menu — the kind a small studio, salon, or freelancer would use to track what they offer and what they charge. The app has **three views** navigated via a top nav bar: **Services**, **Summary**, and **Settings**. The app starts on the **Services** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with buttons **Services**, **Summary**, and **Settings**.

**Services** — the main list of offered services.
- An input labeled **Service name** and an input labeled **Price ($)** plus an **Add service** button adds a new service to the list. Ignore blank name or non-positive price.
- Each service row shows its name, its price formatted as `$N.NN` (two decimal places), a status badge showing either `Active` or `Inactive`, and a **Toggle** button that switches its active status.
- A filter control: a group of two buttons **Show All** and **Show Active** that filter the visible list (default: Show All).
- The heading above the list reads `Services (N)` where N is the count of currently visible rows (matching the active filter).

**Summary** — a read-only stats panel (derived from the full, unfiltered list):
- `Total services: N`
- `Active: N`
- `Inactive: N`
- `Average price: $N.NN` (two decimal places; `$0.00` when there are no services)
- `Active average: $N.NN` (average price of active services only; `$0.00` when none are active)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is stored in a `data-theme` attribute (`"light"` or `"dark"`) on a wrapping root element and persists as the user navigates between views.

Seed the app with these three services already present when it first loads:
- "Haircut" at $25.00, active
- "Color treatment" at $80.00, active
- "Deep conditioning" at $45.00, inactive

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
