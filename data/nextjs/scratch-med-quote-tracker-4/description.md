# Build a Quote Tracker app

Build a complete single-page React application — a sales quote tracker — with **three views** the user navigates between using a top navigation bar: **Quotes**, **Dashboard**, and **Settings**. The app starts on the Quotes view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Quotes**, **Dashboard**, **Settings**) switches the active view.

**Quotes** — the main list of sales quotes.
- An input labeled **Client** for the client name, an input labeled **Amount** for the quote amount (a number), and a **Status** select with options **sent**, **won**, and **lost**. A button labeled **Add Quote** adds the quote (ignore if Client is blank or Amount is not a positive number).
- Each quote row shows the client name, the amount formatted as a dollar value with two decimal places (e.g. `$1200.00`), and the status.
- Each row has a **Delete** button that removes that quote.
- A **Filter** select (labeled **Filter by status**) with options **all**, **sent**, **won**, **lost** that filters the visible list (default **all**). Filtering does not affect Dashboard stats — those always use all quotes.
- The total value of the currently **filtered** quotes is shown as `Filtered total: $X.XX` (e.g. `Filtered total: $0.00` when none are visible).

**Dashboard** — a read-only summary computed from ALL quotes (ignores the filter):
- `Total quotes: N`
- `Pending value: $X.XX` (sum of all **sent** quotes)
- `Won value: $X.XX` (sum of all **won** quotes)
- `Win rate: P%` where P is won ÷ (won + lost) as a whole-number percent, 0% when there are no won or lost quotes.

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.

Seed the app with NO initial quotes (empty list).