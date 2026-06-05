# Build a Content Review Tracker

Build a complete single-page React application for a small editorial team to track content items through a review workflow. The app has **three views** navigated via a top nav bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of content items under review.
- An input labeled **Item title** and an input labeled **Reviewer** plus an **Add item** button adds a new review item (ignore if either field is blank). New items always start with status **draft**.
- A dropdown labeled **Filter by status** with options **All**, **draft**, **approved**, **changes** filters the visible list.
- Each item in the list shows its title, reviewer name, and current status.
- Each item has a **Approve** button that sets its status to **approved**, a **Request changes** button that sets its status to **changes**, and a **Reset to draft** button that sets its status to **draft**.
- The list heading shows the count of currently visible items, like `Items (3)`.

**Stats** — a read-only summary computed from all items (ignoring the filter):
- `Total items: N`
- `Draft: N`
- `Approved: N`
- `Changes requested: N`
- `Approved: P%` where P is approved ÷ total as a whole-number percent (0% when there are no items). Display this line exactly as `Approval rate: P%`.

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with these three initial items so tests can rely on them:
1. Title: **Homepage copy**, Reviewer: **Alice**, Status: **approved**
2. Title: **Pricing page**, Reviewer: **Bob**, Status: **draft**
3. Title: **About us**, Reviewer: **Alice**, Status: **changes**
