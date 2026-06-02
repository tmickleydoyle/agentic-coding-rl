# Build a Deliverables Tracker app

Build a complete single-page React application — a simple deliverables tracker for a small agency — with **three views** the user navigates between using a top navigation bar: **Deliverables**, **Summary**, and **Settings**. The app starts on the **Deliverables** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Deliverables**, **Summary**, **Settings**) switches the active view.

**Deliverables** — the main list view.
- An input labeled **Item** for the deliverable name, an input labeled **Due date** for the due date (a plain text field, e.g. `2024-07-01`), and an **Add** button. Clicking **Add** with a non-blank item name adds the deliverable with status `pending` (ignore a blank item name; due date may be blank).
- Each deliverable row shows its name, due date (or empty if none), and a status badge showing either `pending` or `delivered`.
- Each row has a **Mark delivered** button (disabled if already `delivered`) and a **Mark pending** button (disabled if already `pending`).
- A filter control: a set of buttons labeled **All**, **Pending**, and **Delivered** that filter the visible list. The active filter button is marked with `aria-pressed="true"`.
- The heading above the list reads `Deliverables (N)` where N is the count of currently visible items (i.e. matching the active filter).

**Summary** — a read-only stats view (derived from all deliverables regardless of filter).
- Shows the following text lines:
  - `Total: N`
  - `Delivered: N`
  - `Pending: N`
  - `Delivered: P%` where P is delivered ÷ total as a whole-number percent, rounded down (show `0%` when there are no deliverables).
- The percentage line must read exactly `Delivered: P%` (same label as the count line — the count line has just a number, the percentage line has a `%` sign).

**Settings**
- A **Toggle theme** button that switches between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Clear all** button that removes every deliverable. After clearing, navigating to Deliverables shows an empty list and Summary shows all zeros.

Seed the app with these three initial deliverables (so tests can assert on them immediately without adding items):
1. Name: `Homepage design`, due: `2024-06-01`, status: `delivered`
2. Name: `API integration`, due: `2024-06-15`, status: `pending`
3. Name: `User testing report`, due: `2024-07-01`, status: `pending`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
