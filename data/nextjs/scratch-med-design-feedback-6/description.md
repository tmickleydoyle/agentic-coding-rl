# Build a Design Feedback Tracker

Build a complete single-page React application — a lightweight internal tool for tracking design feedback — with **three views** the user navigates between using a top navigation bar: **Feedback**, **Stats**, and **Settings**. The app starts on the **Feedback** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Feedback**, **Stats**, **Settings**) switches the active view.

**Feedback** — the main list of design feedback notes.
- An input labeled **Note** for the feedback text.
- An input labeled **Screen** for the screen or component name the feedback applies to.
- An **Add feedback** button that adds a new feedback item with status `open` (ignore if either Note or Screen is blank).
- Each feedback item shows its note text, its screen name, and a status badge showing either `open` or `addressed`.
- Each item has a **Mark addressed** button (only visible/enabled when status is `open`) that changes its status to `addressed`.
- A **Filter** control: a checkbox labeled **Show open only**. When checked, only items with status `open` are shown in the list. When unchecked, all items are shown.
- The view heading shows the count of open items: `Open feedback (N)` where N is the total number of open items regardless of the filter.

**Stats** — a read-only summary derived from all feedback items:
- `Total: N` — total number of feedback items
- `Open: N` — number of items with status `open`
- `Addressed: N` — number of items with status `addressed`
- `Addressed: P%` — percentage of items addressed, as a whole-number percent (0% when there are no items)

**Settings**
- A **Toggle theme** button that switches the UI between light and dark. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- A **Default to open only** checkbox. When checked, the **Show open only** filter on the Feedback view is enabled by default for new sessions (i.e. toggling this immediately updates the filter state on the Feedback view as well).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.