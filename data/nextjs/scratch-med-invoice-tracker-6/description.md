# Build an Invoice Tracker app

Build a complete single-page React application — a simple invoice management tool for freelancers — with **three views** navigated via a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the **Invoices** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of invoices.
- A form with three fields: an input labeled **Client**, a number input labeled **Amount**, and a **Add Invoice** button. Ignore submissions where Client is blank or Amount is 0 or empty.
- Each invoice row shows the client name, the amount formatted as `$X.XX` (two decimal places), and a status badge showing either `Unpaid` or `Paid`.
- Each invoice has a **Mark Paid** button that marks it as paid (disabled if already paid).
- A **Show unpaid only** checkbox (unchecked by default) that, when checked, hides paid invoices from the list (they still count in Summary).
- Pre-seed the app with these three invoices already present on load: client `Acme Corp`, amount `1500.00`, status Unpaid; client `Globex`, amount `200.50`, status Paid; client `Initech`, amount `750.00`, status Unpaid.

**Summary** — a read-only derived stats view showing:
- `Total invoices: N`
- `Paid: N`
- `Unpaid: N`
- `Total outstanding: $X.XX` (sum of all unpaid invoice amounts, formatted to two decimal places)
- `Total collected: $X.XX` (sum of all paid invoice amounts, formatted to two decimal places)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
