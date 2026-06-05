# Build a Content Review Tracker

Build a complete single-page React application — a lightweight content review tool for a small editorial team — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — the main list of content items under review.
- An input labeled **Item title** and an input labeled **Reviewer name**, plus an **Add item** button. Clicking **Add item** adds a new review item with status `draft` (ignore if either field is blank).
- Each item shows its title, reviewer name, and current status.
- Each item has a **Set Draft**, **Set Approved**, and **Set Changes** button that updates that item's status to `draft`, `approved`, or `changes` respectively.
- A filter control: a group of three buttons labeled **All**, **Draft**, **Approved**, **Changes** (four buttons) that filter the visible list. The active filter button should show which filter is applied. Default filter is **All**.
- The heading above the list shows the count of currently visible items, e.g. `Showing 3 items`.

**Stats** — a read-only summary computed from all items (not affected by the filter):
- `Total items: N`
- `Draft: N`
- `Approved: N`
- `Changes: N`
- `Approved: P%` where P is approved ÷ total as a whole-number percent (show `Approved: 0%` when there are no items).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- A **Clear all items** button that removes every review item.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
