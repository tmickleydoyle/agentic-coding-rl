# Build a Quote Tracker app

Build a complete single-page React application — a sales quote tracker — with **three views** the user navigates between using a top navigation bar: **Quotes**, **Dashboard**, and **Settings**. The app starts on the Quotes view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Quotes**, **Dashboard**, **Settings**) switches the active view.

**Quotes** — the main list of sales quotes.
- An input labeled **Client** and an input labeled **Amount** plus an **Add quote** button adds a new quote with status **sent** (ignore if either field is blank or Amount is not a positive number).
- Each quote row shows the client name, the amount formatted as `$N.NN` (two decimal places), and the current status.
- Each quote has a **Mark won** button (disabled if already won) and a **Mark lost** button (disabled if already lost).
- A dropdown labeled **Filter by status** with options **All**, **Sent**, **Won**, **Lost** filters the visible list. The count of visible quotes appears as `Showing: N`.

**Dashboard** — a read-only summary derived from all quotes (unaffected by the filter):
- `Total quotes: N`
- `Pending value: $N.NN` — the sum of amounts for quotes with status **sent**
- `Won value: $N.NN` — the sum of amounts for quotes with status **won**
- `Win rate: P%` — won ÷ (won + lost) as a whole-number percent, shown as `0%` when there are no won or lost quotes

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no quotes** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).