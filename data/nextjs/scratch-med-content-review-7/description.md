# Build a Content Review Tracker

Build a complete single-page React application — a lightweight content review tool — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Summary**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Summary**, **Settings**) switches the active view.

**Reviews** — the main list of content items under review.
- An input labeled **Item title** and an input labeled **Reviewer** plus an **Add item** button adds a new review item. Ignore submissions where either field is blank.
- Each new item starts with status **draft**.
- Each item in the list shows its title, reviewer, and a status badge. Below the list, show a status filter: three buttons labeled **All**, **Draft**, **Approved**, and **Changes** that filter the visible items (default: **All**).
- Each item has a **Set draft** button, an **Approve** button, and a **Request changes** button that update that item's status to `draft`, `approved`, or `changes` respectively.
- The count of currently visible items (after filtering) is shown as `Showing: N items` directly above the list.

**Summary** — a read-only derived stats panel:
- `Total items: N`
- `Draft: N`
- `Approved: N`
- `Changes: N`
- `Approved: P%` where P is the number of approved items divided by total items, as a whole-number percent (0% when there are no items). Display this line exactly as `Approved: P%`.

**Settings**
- A **Toggle theme** button that switches between light and dark. Apply a `data-theme` attribute (`"light"` or `"dark"`) to a root element; it persists as the user navigates.
- A **Clear all items** button that removes every review item from the list.

Seed the app with **no items** on first load.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).