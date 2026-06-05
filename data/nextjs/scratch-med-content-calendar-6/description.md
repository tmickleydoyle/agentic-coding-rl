# Build a Content Calendar app

Build a complete single-page React application — a lightweight content calendar tool for a small marketing team — with **three views** the user navigates between using a top navigation bar: **Calendar**, **Stats**, and **Settings**. The app starts on the Calendar view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Calendar**, **Stats**, **Settings**) switches the active view.

**Calendar** — a list of content items.
- An input labeled **Title** and a `<select>` labeled **Platform** (options: **Twitter**, **Instagram**, **LinkedIn**, **Blog**) and a `<select>` labeled **Status** (options: **Draft**, **Scheduled**, **Published**) plus an **Add item** button adds a new content item (ignore a blank title).
- Each item displays its title, platform, and status.
- A `<select>` labeled **Filter by status** (options: **All**, **Draft**, **Scheduled**, **Published**) filters the visible list. Items not matching the filter are hidden but still counted in Stats.
- Each item has a **Delete** button that removes it.
- The heading shows a live count of **visible** items matching the current filter, e.g. `Content Items (3)`.
- Each item has a **Mark Published** button that sets that item's status to Published (disabled if already Published).

**Stats** — a read-only summary computed from all items (ignoring the filter), shown as text lines:
`Total: N`, `Draft: N`, `Scheduled: N`, `Published: N`, and `Scheduled rate: P%` where P is scheduled ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with **no initial items** (empty list on first load).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
