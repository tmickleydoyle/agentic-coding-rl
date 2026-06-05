# Build an Invoice Tracker app

Build a complete single-page React application — a small invoice management tool — with **three views** the user navigates between using a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the Invoices view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of invoices.
- An input labeled **Client** for the client name, an input labeled **Amount** for the invoice amount (a number), and an **Add Invoice** button that adds a new invoice with status **unpaid** (ignore if Client is blank or Amount is not a positive number).
- Each invoice row shows the client name, the amount formatted as `$X.XX` (two decimal places), and its status (`unpaid` or `paid`).
- Each invoice has a **Mark Paid** button (disabled if already paid) that sets the invoice status to paid.
- A **Show unpaid only** checkbox (unchecked by default) that, when checked, hides paid invoices from the list (they are still counted in Summary).
- The total outstanding amount (unpaid invoices only) is shown as `Outstanding: $X.XX` below the list.

**Summary** — a read-only derived stats view:
- `Total invoices: N`
- `Paid: N`
- `Unpaid: N`
- `Total outstanding: $X.XX` (sum of all unpaid invoice amounts)
- `Collection rate: P%` where P is paid ÷ total as a whole-number percent (0% when there are no invoices).

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with the following invoices already present on first render:
- Client: **Acme Corp**, Amount: **1500.00**, Status: **unpaid**
- Client: **Globex**, Amount: **250.50**, Status: **paid**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
