# Build a Quote Tracker app

Build a complete single-page React application — a sales quote tracker for a small business — with **three views** the user navigates between using a top navigation bar: **Quotes**, **Dashboard**, and **Settings**. The app starts on the Quotes view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Quotes**, **Dashboard**, **Settings**) switches the active view.

**Quotes** — the main list of sales quotes.
- An input labeled **Client** for the client name, an input labeled **Amount** for the dollar amount (a positive number), and a **Status** dropdown (labeled **Status**) with options **sent**, **won**, and **lost**.
- An **Add Quote** button adds the quote (ignore entries where the client name is blank or the amount is not a positive number).
- The quote list shows each quote as a row with: the client name, the formatted amount like `$1,234.56`, and the status.
- Each row has a **Delete** button (aria-label `Delete <client>`) that removes it.
- Above the list, a **Filter** dropdown (labeled **Filter by status**) with options **all**, **sent**, **won**, **lost** — filters the displayed rows without affecting the underlying data.
- The total value of currently displayed (filtered) quotes is shown as `Showing total: $X,XXX.XX` (always two decimal places, comma-separated thousands).

**Dashboard** — a read-only summary derived from ALL quotes (ignores the filter).
- Shows these text lines:
  - `Total quotes: N`
  - `Pending value: $X,XXX.XX` — sum of all **sent** quotes
  - `Won value: $X,XXX.XX` — sum of all **won** quotes
  - `Win rate: P%` — won ÷ (won + lost) as a whole-number percent; show `Win rate: 0%` when there are no won or lost quotes

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates.
- A **Reset all quotes** button clears every quote (sets the list back to empty).

Seed the app with **no quotes** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
