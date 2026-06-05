# Build a Content Calendar app

Build a complete single-page React application — a lightweight content scheduling tool — with **three views** the user navigates between using a top navigation bar: **Content**, **Stats**, and **Settings**. The app starts on the Content view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Content**, **Stats**, **Settings**) switches the active view.

**Content** — the main list of content items.
- An input labeled **Title** and a `<select>` labeled **Platform** (options: `Twitter`, `Instagram`, `LinkedIn`) and a `<select>` labeled **Status** (options: `draft`, `scheduled`, `published`) plus an **Add item** button adds a new content item (ignore a blank title).
- Each item displays its title, platform, and status.
- Each item has a **Delete** button that removes it.
- Each item has a **Status** select that lets the user change the status inline (values: `draft`, `scheduled`, `published`).
- A `<select>` labeled **Filter by status** (options: `all`, `draft`, `scheduled`, `published`) filters the visible list. When a filter is active, only items matching that status are shown. The count shown next to the heading updates to reflect the filtered count: `Content (N)` where N is the number of currently visible items.

**Stats** — a read-only summary derived from ALL items (ignoring the filter):
- `Total items: N`
- `Draft: N`
- `Scheduled: N`
- `Published: N`
- `Scheduled rate: P%` where P is `scheduled` count ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with NO initial items — start empty.
