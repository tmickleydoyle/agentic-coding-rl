# Build a Design Feedback Tracker

Build a complete single-page React application — a design feedback tracker for a small product team — with **three views** the user navigates between using a top navigation bar: **Feedback**, **Summary**, and **Settings**. The app starts on the Feedback view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Feedback**, **Summary**, **Settings**) switches the active view.

**Feedback** — the main list of feedback notes.
- An input labeled **Note** for the feedback text.
- An input labeled **Screen** for the screen or page name the feedback refers to.
- An **Add feedback** button that adds a new feedback item (ignore if either Note or Screen is blank). Each new item starts with status **open**.
- A **Filter** control: a group of two buttons labeled **All** and **Open only**. By default, **All** is active. When **Open only** is active, only feedback items with status **open** are shown.
- The nav button (or a heading badge) shows the count of open items: the Feedback nav button must display **`Feedback (N)`** where N is the count of open items, e.g. `Feedback (3)`.
- Each feedback item shows its note text, the screen name, and its current status (`open` or `addressed`).
- Each item has a button: if status is **open**, show **Mark addressed**; if status is **addressed**, show **Reopen**. Clicking toggles the status.

**Summary** — a read-only stats view derived from the feedback list:
- `Total: N` — total number of feedback items.
- `Open: N` — count with status open.
- `Addressed: N` — count with status addressed.
- `Addressed rate: P%` — addressed ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no initial feedback items**. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Routing is in-app state only.
