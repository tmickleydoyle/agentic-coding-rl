# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracking tool for a small team — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the Deliverables view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — a list of deliverable items.
- An input labeled **Item name** and an input labeled **Due date** (a plain text input, e.g. `2024-12-31`) plus an **Add item** button adds a new deliverable with status **pending** (ignore a blank item name or blank due date).
- Each deliverable shows its name, its due date, and its current status (`pending` or `delivered`).
- Each deliverable has a **Mark delivered** button (disabled when already `delivered`) and a **Remove** button that deletes it.
- A filter control: a button labeled **Show: all** toggles to **Show: pending**, filtering the list to show only pending items. Clicking again returns to **Show: all**. The button label reflects the current filter.
- The heading above the list shows a live count based on the current filter, like `Deliverables (3)` (the number shown is how many items are visible given the active filter).

**Summary** — a read-only derived dashboard:
- Shows `Total: N` (all deliverables ever added minus removed),
  `Pending: N`, `Delivered: N`, and `Completion: P%` where P is delivered ÷ total as a whole-number percent (0% when there are no deliverables).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

The default export of `app/page.tsx` is the root `App` component. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.

Seed the app with these three deliverables already present on load:
- Name: `Design mockups`, Due: `2024-11-01`, Status: `delivered`
- Name: `API integration`, Due: `2024-11-15`, Status: `pending`
- Name: `User testing`, Due: `2024-11-30`, Status: `pending`
