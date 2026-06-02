# Build a Design Feedback Tracker

Build a complete single-page React application for tracking design feedback notes, with **three views** the user navigates between using a top navigation bar: **Feedback**, **Summary**, and **Settings**. The app starts on the Feedback view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Feedback**, **Summary**, **Settings**) switches the active view.

**Feedback** — a list of feedback items.
- An input labeled **Note** for the feedback text.
- An input labeled **Screen** for the screen or page name the feedback applies to.
- An **Add Feedback** button adds a new item (ignore if either Note or Screen is blank). Each new item starts with status **open**.
- Each item displays its note text, its screen name, and its current status.
- Each item has a **Mark Addressed** button (only shown when status is **open**) that changes the item's status to **addressed**.
- A **Filter** control: a checkbox labeled **Show open only**. When checked, only items with status **open** are shown in the list. When unchecked, all items are shown.
- The heading above the list reads `Feedback (N)` where N is the count of currently visible items (respects the filter).

**Summary** — a read-only dashboard computed from all feedback items:
- `Total: N` — total number of feedback items.
- `Open: N` — number of items with status open.
- `Addressed: N` — number of items with status addressed.
- `Addressed rate: P%` — addressed ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with **no initial feedback items**. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
