# Build a Content Calendar app

Build a complete single-page React application — a lightweight content planning tool — with **three views** the user navigates between using a top navigation bar: **Content**, **Stats**, and **Settings**. The app starts on the Content view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Content**, **Stats**, **Settings**) switches the active view.

**Content** — the main list of content items.
- An input labeled **Title** and a dropdown labeled **Platform** (options: `Twitter`, `Instagram`, `LinkedIn`, `Blog`) and a dropdown labeled **Status** (options: `draft`, `scheduled`, `published`) plus an **Add item** button adds a new content item (ignore a blank title).
- Each item displays its title, platform, and status.
- Each item has a **Delete** button that removes it.
- Each item has a **Change status** button that cycles the status in order: `draft` → `scheduled` → `published` → `draft`.
- A dropdown labeled **Filter by status** (options: `all`, `draft`, `scheduled`, `published`) filters the visible list. Items not matching the filter are hidden but still counted in Stats.
- The heading above the list shows the count of currently **visible** items like `Items (3)`.

**Stats** — a read-only summary computed from all content items (ignoring the filter):
- `Total items: N`
- `Draft: N`
- `Scheduled: N`
- `Published: N`
- `Scheduled rate: P%` where P is the number of scheduled items divided by total items, as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no items** initially. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
