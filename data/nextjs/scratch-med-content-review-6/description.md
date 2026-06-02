# Build a Content Review Tracker

Build a complete single-page React application — a lightweight content review tool for a small editorial team — with **three views** the user navigates between using a top navigation bar: **Reviews**, **Stats**, and **Settings**. The app starts on the Reviews view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Reviews**, **Stats**, **Settings**) switches the active view.

**Reviews** — a list of content items under review.
- An input labeled **Item title** for the content name.
- An input labeled **Reviewer** for the reviewer's name.
- An **Add item** button adds the item (ignore if either field is blank).
- Each item shows its title, reviewer, and current status. Status cycles through three values: **draft**, **approved**, **changes** (in that order, wrapping around). There is a **Next status** button on each row that advances the status.
- A filter control: a set of buttons (or a row of filter buttons) labeled **All**, **draft**, **approved**, **changes** that filters the visible list. The active filter is shown, defaulting to **All**.
- The heading shows the count of currently visible items, e.g. `Reviews (3)` (this count reflects the active filter).
- Each item row displays the status as a label in the format `Status: draft`, `Status: approved`, or `Status: changes`.

**Stats** — a read-only summary computed from all items (not affected by the filter):
- `Total items: N`
- `Draft: N`
- `Approved: N`
- `Changes: N`
- `Approved: P%` where P is approved ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- The button label reflects the current theme, e.g. `Toggle theme (current: light)` or `Toggle theme (current: dark)`.

Seed the app with NO items initially. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).