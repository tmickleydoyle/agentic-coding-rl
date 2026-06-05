# Build a Content Calendar app

Build a complete single-page React application — a lightweight content calendar tool — with **three views** the user navigates between using a top navigation bar: **Content**, **Stats**, and **Settings**. The app starts on the Content view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Content**, **Stats**, **Settings**) switches the active view.

**Content** — a list of content items with filtering.
- An input labeled **Title** and a dropdown labeled **Platform** (options: `Blog`, `Twitter`, `Instagram`, `LinkedIn`) and a dropdown labeled **Status** (options: `draft`, `scheduled`, `published`) plus an **Add item** button adds a new content item (ignore a blank title).
- Each item in the list shows its title, platform, and status.
- A dropdown labeled **Filter by status** (options: `all`, `draft`, `scheduled`, `published`) filters the visible list. Default is `all`.
- Each item has a **Delete** button that removes it.
- A summary line at the top of the list reads `Showing: N items` where N is the number of currently visible items (after filtering).

**Stats** — a read-only summary computed from all content items (not affected by the filter):
- `Total: N`
- `Draft: N`
- `Scheduled: N`
- `Published: N`
- `Scheduled rate: P%` where P is scheduled ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with NO items by default (empty list).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
