# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracking tool for a small agency — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — the main list view.
- An input labeled **Item** for the deliverable name, an input labeled **Due date** for the due date (plain text, e.g. `2024-12-31`), an **Add** button that adds a new deliverable with status **pending** (ignore a blank item name).
- Below the add form, a filter control: a button labeled **Show: All** and a button labeled **Show: Pending** that filter the visible list. The active filter button should have `aria-pressed="true"` and the inactive one `aria-pressed="false"`. The filter starts on **All**.
- Each deliverable row shows its name, its due date, and its current status (`pending` or `delivered`).
- Each row has a **Mark delivered** button (visible when status is `pending`) that sets that item's status to `delivered`, and a **Mark pending** button (visible when status is `delivered`) that sets it back to `pending`.
- When the **Show: Pending** filter is active, only `pending` items are shown (delivered items are hidden from the list but still counted in Summary).

**Summary** — a read-only stats view computed from all deliverables:
- Shows the text `Total: N` where N is the total number of deliverables.
- Shows `Delivered: N` where N is the count of delivered items.
- Shows `Pending: N` where N is the count of pending items.
- Shows `Progress: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no deliverables).

**Settings**
- A **Toggle theme** button that switches the UI theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
