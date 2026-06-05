# Build an Investor CRM app

Build a complete single-page React application — a lightweight investor relationship manager — with **three views** the user navigates between using a top navigation bar: **Investors**, **Summary**, and **Settings**. The app starts on the Investors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Investors**, **Summary**, **Settings**) switches the active view.

**Investors** — the main list of investor records.
- An input labeled **Firm** for the firm name, a select labeled **Stage** with options **intro**, **pitched**, and **committed** (default **intro**), and an input labeled **Check size** for a dollar amount (a positive integer, e.g. `50000`). A button **Add investor** adds the record (ignore blank firm or non-positive check size).
- Each investor row shows the firm name, stage, and check size formatted as `$N` (e.g. `$50000`). Each row also has an **Edit stage** select (with the same three options) that updates that investor's stage in place, and a **Remove** button that deletes the row.
- A filter select labeled **Filter by stage** with options **All**, **intro**, **pitched**, **committed** (default **All**) that shows only matching rows (or all rows when **All** is selected).
- The count of currently visible investors is shown as `Showing: N`.

**Summary** — a read-only stats panel computed from ALL investors (not the filtered view):
- `Total investors: N`
- `Intro: N`
- `Pitched: N`
- `Committed: N`
- `Total committed: $N` — the sum of check sizes for investors whose stage is **committed** (formatted as `$N` with no decimals; `$0` when none).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Seed the app with these three investors already present at startup:
- Firm: **Acme Ventures**, Stage: **intro**, Check size: **25000**
- Firm: **Blue Horizon**, Stage: **pitched**, Check size: **100000**
- Firm: **Crestwood Capital**, Stage: **committed**, Check size: **500000**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
