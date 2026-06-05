# Build a Design Feedback Tracker

Build a complete single-page React application — a lightweight internal tool for tracking design feedback — with **three views** the user navigates between using a top navigation bar: **Feedback**, **Summary**, and **Settings**. The app starts on the **Feedback** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Feedback**, **Summary**, **Settings**) switches the active view.

**Feedback** — the main list of feedback items.
- An input labeled **Note** for the feedback text.
- An input labeled **Screen** for the screen or page name the feedback refers to.
- An **Add feedback** button that adds the item (ignore if either Note or Screen is blank). New items start with status **open**.
- A **Filter** control: a button labeled **Show all** and a button labeled **Show open** that filter the list. The list shows all items by default.
- Above the list, show the count of open items as `Open: N`.
- Each feedback item displays its note, screen, and a status toggle button:
  - When status is **open**, the button reads **Mark addressed**.
  - When status is **addressed**, the button reads **Mark open**.
  - Clicking the button toggles the status of that item.
- Each item also has a **Delete** button that removes it permanently.
- When the **Show open** filter is active, only items with status **open** are shown (but the `Open: N` count always reflects the full list).

**Summary** — a read-only statistics view derived from the full feedback list:
- `Total: N` — total number of feedback items.
- `Open: N` — number of open items.
- `Addressed: N` — number of addressed items.
- `Completion: P%` — percentage of items that are addressed (whole-number percent, 0% when there are no items).

**Settings** — a simple preferences view:
- A **Toggle theme** button that switches the display theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and the setting persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
