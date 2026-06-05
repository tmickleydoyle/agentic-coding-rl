# Build an Invoice Tracker app

Build a complete single-page React application — a small invoice management tool for freelancers — with **three views** the user navigates between using a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the Invoices view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of invoices.
- An input labeled **Client** and an input labeled **Amount** plus an **Add invoice** button adds a new invoice with status **unpaid** (ignore a blank client name or a non-positive amount).
- Each invoice row shows the client name, the amount formatted as `$N.NN` (two decimal places), and its status (`unpaid` or `paid`).
- Each invoice has a **Mark paid** button that marks it as paid; once paid the button is disabled (or absent).
- A **Show unpaid only** checkbox (checked by default) filters the list to show only unpaid invoices when checked, and all invoices when unchecked.
- The total outstanding (sum of unpaid invoice amounts) is shown below the list as `Outstanding: $N.NN`.

**Summary** — a read-only derived stats panel:
- `Total invoices: N`
- `Paid: N`
- `Unpaid: N`
- `Total outstanding: $N.NN`
- `Total paid: $N.NN`

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no invoices** at startup. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).