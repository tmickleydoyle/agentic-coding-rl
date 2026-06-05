# Build a Service Pricing Manager

Build a complete single-page React application — a service menu manager — with **three views** the user navigates between using a top navigation bar: **Services**, **Stats**, and **Settings**. The app starts on the Services view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Stats**, **Settings**) switches the active view.

**Services** — the main list of services your business offers.
- An input labeled **Service name** and an input labeled **Price** plus an **Add service** button adds a new service (ignore if the name is blank or the price is not a positive number).
- Each service row shows its name, its price formatted as `$X.XX` (two decimal places), and an **Active** toggle button. When active the button label is **Deactivate**; when inactive the label is **Activate**.
- Services start as active when first added.
- A **Remove** button on each row deletes that service.
- Above the list, show the count of currently active services as `Active services: N`.

**Stats** — a read-only derived summary:
- `Total services: N`
- `Active: N`
- `Inactive: N`
- `Average price: $X.XX` — the average price across ALL services (active and inactive), formatted to two decimal places. Show `Average price: $0.00` when there are no services.
- `Active %: P%` — the percentage of services that are active, as a whole-number percent. Show `Active %: 0%` when there are no services.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across navigation.
- A **Hide inactive** checkbox (label: **Hide inactive services**). When checked, inactive services are hidden on the Services view (they still count in Stats). The checkbox starts unchecked.

Seed the app with these three services already present so tests can rely on them:
- **Logo design**, price **150.00**, active
- **Business card print**, price **45.50**, active
- **Social media kit**, price **89.00**, inactive

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.