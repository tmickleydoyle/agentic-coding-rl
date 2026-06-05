# Build a Service Pricing Manager

Build a complete single-page React application — a service menu manager for a small business — with **three views** the user navigates between using a top navigation bar: **Services**, **Summary**, and **Settings**. The app starts on the Services view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Services**, **Summary**, **Settings**) switches the active view.

**Services** — a list of services the business offers.
- An input labeled **Service name** and an input labeled **Price** plus an **Add service** button adds a new service (ignore if either field is blank or if the price is not a valid positive number).
- Each service row shows its name, its price formatted as `$X.XX` (two decimal places), and an **Active** toggle button. When active, the button reads `Active`; when inactive it reads `Inactive`.
- Each service also has a **Remove** button that deletes it from the list.
- A header line above the list shows the count of active services: `Active services: N`.

Seed the app with these three initial services (in order):
1. Name: `Haircut`, Price: `25.00`, active: true
2. Name: `Beard Trim`, Price: `15.00`, active: true
3. Name: `Hair Color`, Price: `80.00`, active: false

**Summary** — a read-only stats panel derived from the Services list:
- `Total services: N`
- `Active: N`
- `Inactive: N`
- `Average price: $X.XX` (average across ALL services, two decimal places; show `$0.00` when there are no services)
- `Active avg: $X.XX` (average price of active-only services; show `$0.00` when none are active)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Reset services** button that restores the original three seeded services (replacing any additions or removals) and resets all toggles to their original active/inactive state.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).