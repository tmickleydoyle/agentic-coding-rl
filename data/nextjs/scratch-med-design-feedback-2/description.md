# Build a Design Feedback Tracker

Build a complete single-page React application — a design feedback tracker for a small product team — with **three views** the user navigates between using a top navigation bar: **Feedback**, **Summary**, and **Settings**. The app starts on the Feedback view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Feedback**, **Summary**, **Settings**) switches the active view.

**Feedback** — the main list of design feedback items.
- An input labeled **Note** for the feedback text.
- An input labeled **Screen** for the screen or component name.
- An **Add feedback** button that adds a new item (ignore if Note or Screen is blank). New items start with status **open**.
- A **Filter** control: a button labeled **Show: All** or **Show: Open** that toggles between showing all items and showing only open items. It starts showing all.
- The nav button label shows a live count of open items in parentheses: **Feedback (N)** where N is the number of open items.
- Each feedback item displays its note and screen as `"[note]" on [screen]`, e.g. `"Button misaligned" on Login`. Below it shows its current status: `Status: open` or `Status: addressed`.
- Each item has a button labeled **Mark addressed** (visible when status is open) or **Mark open** (visible when status is addressed) that toggles the status.

**Summary** — a read-only derived stats view.
- Shows the following lines of text:
  - `Total: N` — total feedback items
  - `Open: N` — items with status open
  - `Addressed: N` — items with status addressed
  - `Progress: P%` — addressed ÷ total as a whole-number percent (0% when there are no items)

**Settings**
- A **Toggle theme** button that switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed no initial data — the list starts empty.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).