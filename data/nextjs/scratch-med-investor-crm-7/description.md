# Build an Investor CRM app

Build a complete single-page React application — a lightweight investor relationship manager — with **three views** the user navigates between using a top navigation bar: **Investors**, **Dashboard**, and **Settings**. The app starts on the Investors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Investors**, **Dashboard**, **Settings**) switches the active view.

**Investors** — the main list of investors.
- An input labeled **Firm name** and an input labeled **Check size ($)** plus a **Stage** select with options **intro**, **pitched**, and **committed** (default **intro**), plus an **Add investor** button that adds the investor (ignore if firm name is blank or check size is not a positive number).
- Each investor row shows the firm name, stage, and check size formatted as `$N` (whole dollars, e.g. `$25000`).
- Each investor row has a **Remove** button that deletes the investor.
- A **Filter by stage** select with options **All**, **intro**, **pitched**, **committed** (default **All**) filters the visible list. The count of visible rows updates live.
- The heading above the list reads `Investors (N)` where N is the number of currently visible investors after filtering.
- A **Stage** select on each existing investor row (labeled `Stage for <firm name>`) lets the user change that investor's stage in place.

**Dashboard** — a read-only summary computed from all investors (ignoring the current filter):
- `Total investors: N`
- `Intro: N`
- `Pitched: N`
- `Committed: N`
- `Total committed: $N` — sum of check sizes for investors whose stage is **committed**, formatted as `$N` whole dollars.
- `Conversion: P%` — committed ÷ total investors as a whole-number percent (0% when there are no investors).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with these three investors already in the list on first render:
- Firm: **Acme Ventures**, Stage: **intro**, Check size: **50000**
- Firm: **Blue Horizon**, Stage: **pitched**, Check size: **100000**
- Firm: **Capital Peak**, Stage: **committed**, Check size: **250000**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
