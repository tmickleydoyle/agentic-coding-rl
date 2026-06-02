# Build an Investor CRM app

Build a complete single-page React application — a simple investor relationship manager — with **three views** the user navigates between using a top navigation bar: **Investors**, **Dashboard**, and **Settings**. The app starts on the Investors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Investors**, **Dashboard**, **Settings**) switches the active view.

**Investors** — the main list of investor contacts.
- An input labeled **Firm** for the firm name, a select labeled **Stage** with options **intro**, **pitched**, and **committed**, and an input labeled **Check size** for a dollar amount (a plain number like `50000`). A button labeled **Add investor** adds the entry (ignore if Firm is blank or Check size is not a positive number).
- Each investor row shows: the firm name, the stage, and the check size formatted as a dollar amount with no decimals, e.g. `$50,000`.
- Each row has a **Remove** button that deletes that investor.
- Above the list, a select labeled **Filter by stage** with options **All**, **intro**, **pitched**, and **committed** filters the visible rows (does not delete them). When a filter is active only matching rows are shown.
- The list heading reads `Investors (N)` where N is the count of **currently visible** rows.

**Dashboard** — a read-only summary derived from all investors (ignoring any active filter):
- `Total investors: N`
- `Intro: N`
- `Pitched: N`
- `Committed: N`
- `Total committed: $X` where X is the sum of check sizes for committed investors only, formatted with commas and no decimals (e.g. `$125,000`). Shows `$0` when there are none.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists as the user navigates.

Seed the app with these three investors already present on first render:
1. Firm: **Sequoia**, Stage: **committed**, Check size: **500000**
2. Firm: **Accel**, Stage: **pitched**, Check size: **250000**
3. Firm: **Lightspeed**, Stage: **intro**, Check size: **100000**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.