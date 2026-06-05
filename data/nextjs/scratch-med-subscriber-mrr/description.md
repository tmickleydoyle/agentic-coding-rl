# Build a Subscriber MRR Tracker

Build a complete single-page React application — a subscriber management tool — with **three views** the user navigates between using a top navigation bar: **Subscribers**, **Dashboard**, and **Settings**. The app starts on the Subscribers view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Subscribers**, **Dashboard**, **Settings**) switches the active view.

**Subscribers** — the main list of subscribers.
- An input labeled **Name** for the subscriber's name.
- A dropdown (select) labeled **Plan** with three options: **Starter ($29/mo)**, **Pro ($79/mo)**, **Enterprise ($199/mo)**.
- An **Add Subscriber** button that adds the subscriber (ignore if name is blank). New subscribers default to **active**.
- Each subscriber row shows their name, plan name, and an **Active** / **Inactive** toggle button that switches their active status.
- A **Remove** button on each row deletes the subscriber.
- The heading shows the total count, e.g. `Subscribers (3)`.
- Show all subscribers regardless of active status.

**Dashboard** — a read-only summary computed from the subscriber list:
- `Total subscribers: N`
- `Active subscribers: N`
- `Inactive subscribers: N`
- `Monthly Recurring Revenue: $N` where N is the sum of monthly prices of **active** subscribers only (whole dollar, no decimals, e.g. `Monthly Recurring Revenue: $108`).
- `Active rate: P%` where P is active ÷ total as a whole-number percent (0% when there are no subscribers).

Plan monthly prices: Starter = $29, Pro = $79, Enterprise = $199.

**Settings**
- A **Toggle theme** button that switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- A **Reset subscribers** button that removes all subscribers and resets the list to empty.

Seed the app with the following three subscribers already present on first load:
- **Alice**, Plan: Pro, active: true
- **Bob**, Plan: Starter, active: true
- **Carol**, Plan: Enterprise, active: false

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).