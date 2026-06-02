# Build an Invoice Tracker app

Build a complete single-page React application — a small invoice management tool — with **three views** the user navigates between using a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the Invoices view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of invoices.
- A form with three fields:
  - An input labeled **Client** (the client name)
  - An input labeled **Amount** (a number, e.g. `150.00`)
  - A **Add Invoice** button that adds a new invoice with status **Unpaid** (ignore blank client or non-positive amount)
- Each invoice row shows: the client name, the amount formatted as `$X.XX` (two decimal places), and its status (`Paid` or `Unpaid`).
- Each invoice row has a **Mark Paid** button that marks that invoice as paid (the button should be disabled if the invoice is already paid).
- A **Show: All** / **Show: Unpaid** toggle button that filters the list. When showing unpaid only, paid invoices are hidden. The button label alternates: when currently showing all, the button reads **Show: Unpaid**; when showing unpaid only, it reads **Show: All**.
- A line at the bottom of the view showing the outstanding total: `Outstanding: $X.XX` (sum of all unpaid invoice amounts, always shown regardless of filter).

**Summary** — a read-only stats panel:
- `Total invoices: N`
- `Paid: N`
- `Unpaid: N`
- `Total outstanding: $X.XX` (sum of all unpaid amounts)
- `Collection rate: P%` where P is paid ÷ total as a whole-number percent (0% when there are no invoices)

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with these three invoices already present on first load:
1. Client: `Acme Corp`, Amount: `500.00`, Status: `Unpaid`
2. Client: `Globex`, Amount: `250.00`, Status: `Paid`
3. Client: `Initech`, Amount: `125.50`, Status: `Unpaid`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
