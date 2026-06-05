# Build a Content Review Tracker

Build a complete single-page React application — a lightweight content review tool for a small editorial team — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of content items under review.
- An input labeled **Item title** and an input labeled **Reviewer** plus an **Add item** button adds a new review item (ignore if either field is blank). New items default to **draft** status.
- A filter control labeled **Filter by status** with options **All**, **draft**, **approved**, **changes** filters the visible list without changing stored data.
- Each item row shows: its title, the reviewer name, and a status badge showing one of `draft`, `approved`, or `changes`.
- Each item has three buttons: **Approve**, **Request changes**, and **Reset to draft** that update its status to `approved`, `changes`, or `draft` respectively.
- A live count line at the top of the list reads `Showing: N items` reflecting the currently filtered count.

**Stats** — a read-only summary computed from all items (not the filtered view):
- `Total items: N`
- `Approved: N`
- `Changes requested: N`
- `Draft: N`
- `Approved %: P%` where P is approved ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across views.
- A **Reset all items** button that removes every review item from the list.

Seed the app with NO initial items. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).