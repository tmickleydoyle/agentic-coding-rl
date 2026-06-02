# Build a Subscriber MRR Tracker

Build a complete single-page React application — a subscriber management tool — with **three views** the user navigates between using a top navigation bar: **Subscribers**, **Dashboard**, and **Settings**. The app starts on the Subscribers view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Subscribers**, **Dashboard**, **Settings**) switches the active view.

**Subscribers** — a list of subscribers with their plan and active status.
- An input labeled **Name** for the subscriber's name.
- A dropdown (select) labeled **Plan** with options: **Starter ($29/mo)**, **Pro ($79/mo)**, **Enterprise ($199/mo)**.
- An **Add Subscriber** button that adds the subscriber (ignore a blank name).
- Each subscriber row shows their name, plan name, and an **Active** checkbox that toggles whether they are active. New subscribers start as active.
- Each subscriber row also has a **Remove** button that deletes them from the list.
- At the top of the list, display the active count as `Active: N of M` where N is active count and M is total count.

**Dashboard** — a read-only summary computed from the subscriber list:
- `Total Subscribers: N`
- `Active Subscribers: N`
- `Inactive Subscribers: N`
- `Monthly Recurring Revenue (MRR): $N` where N is the sum of the monthly prices of all **active** subscribers only (whole dollar, no cents, e.g. `Monthly Recurring Revenue (MRR): $108`).
- `Average Revenue per User (ARPU): $N` where N is MRR divided by active subscriber count as a whole-number dollar (0 when there are no active subscribers, e.g. `Average Revenue per User (ARPU): $79`).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is shown in the button label like `Toggle theme (current: light)`. The theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.
- A **Hide inactive** checkbox; when checked, inactive subscribers are hidden from the Subscribers list (they still count in the Dashboard).

The three plans and their monthly prices are:
- **Starter**: $29/mo
- **Pro**: $79/mo
- **Enterprise**: $199/mo

Seed the app with **no subscribers** on load.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
