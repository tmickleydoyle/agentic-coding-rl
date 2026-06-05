# Build a Quote Tracker app

Build a complete single-page React application — a simple sales quote tracker — with **three views** the user navigates between using a top navigation bar: **Quotes**, **Dashboard**, and **Settings**. The app starts on the Quotes view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Quotes**, **Dashboard**, **Settings**) switches the active view.

**Quotes** — the main list view for managing sales quotes.
- An input labeled **Client** for the client name, an input labeled **Amount** for the quote value (a positive number), and a **Status** select with options **sent**, **won**, and **lost**.
- An **Add Quote** button adds the quote (ignore if Client is blank or Amount is not a positive number).
- Each quote row shows the client name, the amount formatted as `$X.XX` (two decimal places), and the status.
- Each quote row has a **Delete** button that removes it.
- Each quote row has a **Status** select (with the same three options) that lets the user change the quote's status in-place.
- A **Filter** select above the list with options **All**, **sent**, **won**, **lost** — filters the displayed rows to only that status (default **All**). The filter does NOT affect the Dashboard stats.
- The total value of currently **displayed** quotes (after filtering) is shown as `Showing total: $X.XX`.

**Dashboard** — a read-only summary of ALL quotes (unaffected by the filter).
- Shows `Total quotes: N`.
- Shows the total value of all quotes with status **sent** or **won** as `Pending value: $X.XX`.
- Shows the win rate (won ÷ (won + lost), as a whole-number percent; 0% if no won or lost quotes exist) as `Win rate: P%`.
- Shows `Won: N`, `Lost: N`, `Sent: N`.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with NO initial quotes. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
