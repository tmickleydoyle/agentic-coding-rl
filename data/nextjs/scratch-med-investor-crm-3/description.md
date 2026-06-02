# Build an Investor CRM app

Build a complete single-page React application — a lightweight investor relationship manager — with **three views** the user navigates between using a top navigation bar: **Investors**, **Summary**, and **Settings**. The app starts on the Investors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Investors**, **Summary**, **Settings**) switches the active view.

**Investors** — a list of investor records.
- An input labeled **Firm** for the firm name, a select labeled **Stage** with options **intro**, **pitched**, and **committed**, and an input labeled **Check size** for a dollar amount (whole number, e.g. `50000`), plus an **Add investor** button. Ignore the entry if Firm is blank or Check size is not a positive number.
- Each investor row shows the firm name, the stage, and the check size formatted as `$N` (e.g. `$50000`), plus a **Remove** button that deletes the row.
- Each investor row also has a **Stage** select that lets the user change the stage in-place (values: **intro**, **pitched**, **committed**).
- Above the list, a select labeled **Filter by stage** with options **All**, **intro**, **pitched**, **committed** filters the visible rows. The heading above the list reads `Investors (N)` where N is the number of rows currently visible after filtering.

**Summary** — a read-only derived view:
- `Total investors: N` — total across all records regardless of filter.
- `Intro: N`, `Pitched: N`, `Committed: N` — counts per stage.
- `Total committed: $N` — sum of check sizes for investors whose stage is **committed**, formatted as `$N` (whole number, no decimals).
- `Average check: $N` — average check size across **all** investors rounded to a whole number, shown as `$0` when there are no investors.

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state).

Seed the app with these three investors already present on load:
- Firm: **Sequoia**, Stage: **committed**, Check size: **500000**
- Firm: **Accel**, Stage: **pitched**, Check size: **250000**
- Firm: **Y Combinator**, Stage: **intro**, Check size: **125000**
