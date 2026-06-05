# Build a Design Feedback Tracker

Build a complete single-page React application for a small design team to track feedback items across screens. The app has **three views** navigated by a top nav bar: **Feedback**, **Summary**, and **Settings**. The app starts on the **Feedback** view. All state is kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Feedback**, **Summary**, **Settings**) switches the active view.

**Feedback** — the main list view.
- An input labeled **Note** for the feedback text.
- An input labeled **Screen** for the screen name the feedback applies to.
- An **Add** button that adds the item (ignore if Note or Screen is blank). New items default to **open** status.
- A toggle button labeled **Show: All** or **Show: Open** that filters the list. When **Show: Open** is active only open items are shown; when **Show: All** both open and addressed items are shown. The button label reflects the current mode: when showing all items the button reads `Show: All`; when filtered to open only it reads `Show: Open`.
- A header line that always reads `Open: N` where N is the count of open items regardless of filter.
- Each feedback item displays its note text, its screen name in the format `Screen: <name>`, and a button labeled **Mark addressed** (if currently open) or **Mark open** (if currently addressed) to toggle its status.
- Seed the app with these two items already present (open status): note `Button contrast too low`, screen `Login`; note `Spacing inconsistent`, screen `Dashboard`.

**Summary** — a read-only stats view computed from all feedback items.
- Displays `Total: N`, `Open: N`, `Addressed: N`, and `Addressed: P%` where P is addressed ÷ total as a whole-number percent (0% when there are no items).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across view changes.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
