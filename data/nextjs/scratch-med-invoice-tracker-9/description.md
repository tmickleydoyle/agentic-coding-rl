# Build an Invoice Tracker app

Build a complete single-page React application — an invoice management tool for a small business — with **three views** the user navigates between using a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the Invoices view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of invoices.
- An input labeled **Client** for the client name, an input labeled **Amount** for the invoice amount (a positive number), and an **Add Invoice** button. Ignore submissions where client is blank or amount is not a positive number.
- Each invoice row shows the client name, the amount formatted as currency with two decimal places (e.g. `$120.00`), and a status badge showing either **Paid** or **Unpaid**.
- Each unpaid invoice has a **Mark Paid** button that marks it as paid. Paid invoices do not show a **Mark Paid** button.
- A **Filter** control (a set of buttons or toggle) lets the user filter the list: **All**, **Paid**, **Unpaid**. The active filter label is shown, and the default is **All**.
- The count of currently visible invoices is shown as `Showing: N`.

**Summary** — a read-only dashboard derived from invoice data:
- `Total invoices: N`
- `Paid: N`
- `Unpaid: N`
- `Outstanding: $X.XX` — the sum of all unpaid invoice amounts, formatted with two decimal places.
- `Collected: $X.XX` — the sum of all paid invoice amounts, formatted with two decimal places.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with **no invoices** on first load (empty state). Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
