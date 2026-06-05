# Build a Quote Tracker app

Build a complete single-page React application — a sales quote tracker for a small business — with **three views** the user navigates between using a top navigation bar: **Quotes**, **Dashboard**, and **Settings**. The app starts on the Quotes view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Quotes**, **Dashboard**, **Settings**) switches the active view.

**Quotes** — the main list of sales quotes.
- Three inputs: one labeled **Client**, one labeled **Amount** (a number), and one labeled **Status** (a `<select>` with options `sent`, `won`, `lost`). A button labeled **Add Quote** adds a new quote (ignore if Client is blank or Amount is blank/non-positive).
- Each quote row shows the client name, the amount formatted as `$X.XX` (two decimal places), and the status.
- Each quote row has a **Delete** button that removes it.
- A filter control: a `<select>` labeled **Filter by status** with options `all`, `sent`, `won`, `lost`. When a filter other than `all` is selected, only quotes with that status are shown in the list. The filter does NOT affect Dashboard totals (those always use all quotes).
- The list heading reads **Quotes (N)** where N is the number of quotes currently visible (after filtering).

**Dashboard** — a read-only summary always computed across ALL quotes (ignoring the filter):
- `Total quotes: N`
- `Pending value: $X.XX` — the sum of amounts for quotes with status `sent`, formatted to two decimal places.
- `Won value: $X.XX` — the sum of amounts for quotes with status `won`, formatted to two decimal places.
- `Win rate: P%` — won ÷ (won + lost) as a whole-number percent; `0%` when there are no won or lost quotes.

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- The button label reads `Toggle theme (current: light)` or `Toggle theme (current: dark)` to reflect the active theme.

Seed the app with **no quotes** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
