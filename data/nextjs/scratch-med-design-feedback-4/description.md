# Build a Design Feedback Tracker

Build a complete single-page React application for tracking design feedback items, with **three views** the user navigates between using a top navigation bar: **Feedback**, **Summary**, and **Settings**. The app starts on the Feedback view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Feedback**, **Summary**, **Settings**) switches the active view.

**Feedback** — the main list of feedback items.
- An input labeled **Note** for the feedback text, a second input labeled **Screen** for the screen/page name, and an **Add feedback** button adds a new item (ignore if either Note or Screen is blank).
- Each new item starts with status **open**.
- Each item displays its note, screen name, and a **Mark addressed** button (visible only when the item is open) that changes its status to **addressed**.
- The view shows a filter control: a checkbox labeled **Show open only**. When checked, only items with status **open** are shown in the list.
- The heading above the list reads `Open feedback (N)` where N is the count of open items regardless of the filter.

**Summary** — a read-only stats panel derived from the feedback list:
- `Total items: N`
- `Open: N`
- `Addressed: N`
- `Addressed rate: P%` where P is addressed ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- Changing the theme does not affect any feedback data.

Seed the app with **no initial feedback items**. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).