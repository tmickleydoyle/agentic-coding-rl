# Build an Invoice Tracker app

Build a complete single-page React application — an invoice tracking tool for a small business — with **three views** the user navigates between using a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the Invoices view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of invoices.
- An input labeled **Client** for the client name.
- An input labeled **Amount** for the invoice amount (a positive number).
- An **Add Invoice** button that adds a new invoice with status **unpaid** (ignore entries where client is blank or amount is not a positive number).
- Each invoice row shows the client name, the amount formatted as `$X.XX` (two decimal places), and its status (`unpaid` or `paid`).
- Each invoice row has a **Mark paid** button; clicking it sets that invoice's status to `paid`. Once paid, the **Mark paid** button is disabled.
- A **Show unpaid only** checkbox (initially unchecked) that, when checked, hides paid invoices from the list. The heading above the list always shows the total count of ALL invoices regardless of the filter, like `Invoices (3)`.
- A **Total outstanding: $X.XX** line below the list that always shows the sum of all unpaid invoice amounts (ignoring the filter).

**Summary** — a read-only stats view computed from the invoice list:
- `Total invoices: N`
- `Paid: N`
- `Unpaid: N`
- `Total outstanding: $X.XX` (sum of unpaid amounts)
- `Paid rate: P%` where P is paid ÷ total as a whole-number percent (0% when there are no invoices).

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with NO invoices initially. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state).
