# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracking tool — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — the main list of deliverable items.
- An input labeled **Item name** for the deliverable title.
- An input labeled **Due date** for a due date string (plain text, any format the user types).
- An **Add deliverable** button that adds a new deliverable with status **pending** (ignore a blank item name).
- Each deliverable shows its name, its due date, and its status (`pending` or `delivered`).
- Each deliverable has a **Mark delivered** button that sets its status to `delivered`, and a **Mark pending** button that resets it to `pending`. Only the relevant button should be shown: show **Mark delivered** when status is `pending`; show **Mark pending** when status is `delivered`.
- A **Filter** control: a set of buttons labeled **All**, **Pending**, **Delivered** that filter the visible list. The active filter button should have `aria-pressed="true"`.
- When the **Pending** filter is active, only pending items are shown. When **Delivered** is active, only delivered items are shown. **All** shows everything.
- A live count line: `Showing: N items` reflecting the number of currently visible items after filtering.

**Summary** — a read-only derived statistics view.
- Shows the following text lines:
  - `Total: N` — total number of deliverables
  - `Pending: N` — count of pending deliverables
  - `Delivered: N` — count of delivered deliverables
  - `Completion: P%` — delivered ÷ total as a whole-number percent (0% when there are no deliverables)

**Settings**
- A **Toggle theme** button that switches between light and dark themes. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, persisting as the user navigates between views.

Seed the app with **no initial deliverables** (empty list on first load).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
