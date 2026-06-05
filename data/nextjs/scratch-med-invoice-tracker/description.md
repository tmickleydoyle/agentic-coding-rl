# Build an Invoice Tracker app

Build a complete single-page React application — an invoice tracker for a small business — with **three views** the user navigates between using a top navigation bar: **Invoices**, **Summary**, and **Settings**. The app starts on the Invoices view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Invoices**, **Summary**, **Settings**) switches the active view.

**Invoices** — the main list of invoices.
- An input labeled **Client** for the client name.
- An input labeled **Amount** for the invoice amount (a number).
- An **Add Invoice** button that adds the invoice (ignore if Client is blank or Amount is not a positive number). After adding, clear both inputs.
- Each invoice row shows the client name, the amount formatted as `$X.XX` (two decimal places), and a status badge showing either **Unpaid** or **Paid**.
- Each unpaid invoice has a **Mark Paid** button. Paid invoices do not have this button.
- A **Filter** control: a set of three buttons labeled **All**, **Unpaid**, and **Paid** that filter the visible list. The default filter is **All**.
- The count of currently visible invoices is shown as `Showing: N`.

**Summary** — a read-only derived stats view:
- `Total invoices: N`
- `Paid: N`
- `Unpaid: N`
- `Total outstanding: $X.XX` (sum of all unpaid invoice amounts, formatted to two decimal places)
- `Total paid: $X.XX` (sum of all paid invoice amounts, formatted to two decimal places)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with these three invoices already present on load:
- Client: **Acme Corp**, Amount: **1200.00**, Status: **Unpaid**
- Client: **Bright Ideas**, Amount: **450.50**, Status: **Paid**
- Client: **Cloud Nine**, Amount: **875.00**, Status: **Unpaid**
