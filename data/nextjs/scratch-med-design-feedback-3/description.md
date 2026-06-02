# Build a design feedback tracker

Build a complete single-page React application — a design feedback tracker for a small product team — with **three views** the user navigates between using a top navigation bar: **Feedback**, **Summary**, and **Settings**. The app starts on the Feedback view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Feedback**, **Summary**, **Settings**) switches the active view.

**Feedback** — the main list of feedback notes.
- An input labeled **Note** for the feedback text.
- An input labeled **Screen** for the screen or page name the feedback refers to.
- An **Add feedback** button that adds the item (ignore submissions where Note or Screen is blank).
- Each feedback item shows its note text, its screen name, and its current status (**Open** or **Addressed**).
- Each item has a **Mark addressed** button (visible when status is Open) and a **Reopen** button (visible when status is Addressed) that toggle the status.
- A **Filter** control with two options: a button labeled **All** and a button labeled **Open only**. When **Open only** is active, only items with status Open are shown in the list. The default is **All**.
- A live count displayed as `Open: N` (where N is the number of Open items) always visible above the list, regardless of the current filter.

**Summary** — a read-only derived stats panel:
- `Total feedback: N`
- `Open: N`
- `Addressed: N`
- `Addressed rate: P%` where P is addressed ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.

Seed the app with no feedback items on load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
