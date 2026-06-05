# Build an Investor CRM app

Build a complete single-page React application — a lightweight investor relationship tracker — with **three views** the user navigates between using a top navigation bar: **Investors**, **Pipeline**, and **Settings**. The app starts on the Investors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Investors**, **Pipeline**, **Settings**) switches the active view.

**Investors** — the main list of investor contacts.
- A form with three fields:
  - An input labeled **Firm name** for the investor's firm.
  - A select labeled **Stage** with options **intro**, **pitched**, and **committed**.
  - An input labeled **Check size** for a dollar amount (entered as a plain number, e.g. `50000`).
- An **Add investor** button adds the entry (ignore submissions where Firm name is blank or Check size is not a positive number).
- Each investor row shows the firm name, stage badge, and check size formatted as `$N` (e.g. `$50000`).
- Each row has a **Remove** button that deletes that investor.
- A select labeled **Filter by stage** (options: **All**, **intro**, **pitched**, **committed**) filters the visible list. The filter does NOT affect the Pipeline stats.
- The heading above the list reads `Investors (N)` where N is the count of currently **visible** (filtered) investors.

**Pipeline** — a read-only summary derived from all investors (unaffected by the filter):
- `Total investors: N`
- `Intro: N`
- `Pitched: N`
- `Committed: N`
- `Total committed: $N` — sum of check sizes for all investors whose stage is **committed**, formatted as `$N` (e.g. `$150000`; `$0` when none).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with NO initial investors (empty list).
