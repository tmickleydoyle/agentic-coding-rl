# Build an Invoice Tracker app

Build a complete single-page React application — a small invoice management tool — with **three views** the user navigates between using a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the Invoices view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of all invoices.
- An input labeled **Client** for the client name, an input labeled **Amount** for the invoice amount, and an **Add Invoice** button. Ignore the entry if either field is blank or if the amount is not a positive number.
- Each invoice shows the client name, the amount formatted as a dollar value with two decimal places (e.g. `$120.00`), and a status badge showing either `Paid` or `Unpaid`.
- Each unpaid invoice has a **Mark Paid** button that toggles the invoice to paid. Paid invoices do NOT show a Mark Paid button.
- A **Filter** control with two options: **All** and **Unpaid Only**. When **Unpaid Only** is selected only unpaid invoices are shown in the list; the filter defaults to **All**.
- Below the list, always show the total outstanding (sum of all unpaid invoices), formatted as `Outstanding: $0.00` (two decimal places).

Seed the app with these three invoices already present on load:
- Client: `Acme Corp`, Amount: `500.00`, Status: `Unpaid`
- Client: `Globex`, Amount: `250.00`, Status: `Paid`
- Client: `Initech`, Amount: `750.00`, Status: `Unpaid`

**Summary** — a read-only stats view computed from the invoices:
- `Total invoices: N`
- `Paid: N`
- `Unpaid: N`
- `Total billed: $N.NN` (sum of all invoices, two decimal places)
- `Total outstanding: $N.NN` (sum of all unpaid invoices, two decimal places)
- `Paid rate: P%` where P is paid ÷ total as a whole-number percent (0% when there are no invoices)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists across view navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
