# Build a Feature Backlog app

Build a complete single-page React application — a lightweight feature backlog tracker — with **three views** the user navigates between using a top navigation bar: **Backlog**, **Stats**, and **Settings**. The app starts on the Backlog view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Backlog**, **Stats**, **Settings**) switches the active view.

**Backlog** — a list of feature requests, each with a title, priority, and status.
- An input labeled **Feature title** for the feature name.
- A dropdown (select) labeled **Priority** with options **P0**, **P1**, **P2**.
- A dropdown (select) labeled **Status** with options **idea**, **building**, **shipped**.
- An **Add feature** button that adds the feature to the list (ignore a blank title).
- Each feature in the list shows its title, priority badge, and current status.
- Each feature has a **Delete** button that removes it from the list.
- A filter section with a dropdown labeled **Filter by priority** with options **All**, **P0**, **P1**, **P2** that filters the visible list (does not delete items).
- The heading shows the count of currently visible features like `Features (3)`.

**Stats** — a read-only summary computed from all features (ignoring the current filter):
- `Total: N` — total number of features.
- `P0: N` — count of P0 features.
- `P1: N` — count of P1 features.
- `P2: N` — count of P2 features.
- `Shipped: N` — count of features with status shipped.
- `Completion: P%` — shipped ÷ total as a whole-number percent (0% when there are no features).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and it persists as the user navigates between views.

Seed the app with NO initial features (empty list). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
