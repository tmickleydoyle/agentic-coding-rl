# Build an Invoice Tracker app

Build a complete single-page React application — an invoice tracking tool for a small business — with **three views** the user navigates between using a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the Invoices view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of invoices.
- An input labeled **Client** for the client name, an input labeled **Amount** for the invoice amount (a number), and an **Add Invoice** button. Ignore submissions where Client is blank or Amount is not a positive number.
- Each invoice row shows the client name, the amount formatted as `$X.XX` (two decimal places), and a status badge showing either `Unpaid` or `Paid`.
- Each unpaid invoice has a **Mark Paid** button. Once marked paid, the button disappears and the status shows `Paid`.
- A **Show unpaid only** checkbox (initially unchecked). When checked, only unpaid invoices are visible in the list; paid invoices are hidden. The checkbox does NOT affect the Summary view calculations.
- The view shows a live count label: `Showing X of Y invoices` where X is the number of invoices currently visible (after filtering) and Y is the total number of invoices.

**Summary** — a read-only derived stats panel.
- Shows the following text lines:
  - `Total invoices: N`
  - `Paid: N`
  - `Unpaid: N`
  - `Total outstanding: $X.XX` (sum of all unpaid invoice amounts, formatted to two decimal places)
  - `Total collected: $X.XX` (sum of all paid invoice amounts, formatted to two decimal places)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and it persists as the user navigates between views.

Seed the app with **no invoices** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
