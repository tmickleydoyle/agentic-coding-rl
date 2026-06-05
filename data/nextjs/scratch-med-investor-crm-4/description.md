# Build an Investor CRM app

Build a complete single-page React application — a lightweight investor relationship manager — with **three views** the user navigates between using a top navigation bar: **Investors**, **Dashboard**, and **Settings**. The app starts on the Investors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Investors**, **Dashboard**, **Settings**) switches the active view.

**Investors** — the main list of investors.
- A form with three inputs:
  - **Firm** (text) — the name of the investment firm
  - **Check Size** (number) — the investment amount in whole dollars
  - **Stage** (select with options **intro**, **pitched**, **committed**)
  - An **Add Investor** button that adds the investor (ignore the submission if Firm is blank or Check Size is not a positive number)
- The list shows every investor as a row with the firm name, stage badge, and check size formatted as `$N` (e.g. `$50000`).
- A **Stage filter** select above the list with options **All**, **intro**, **pitched**, **committed** that filters which investors are shown. Filtering does NOT remove investors from the data — navigating away and back preserves the filter selection.
- Each investor row has a **Remove** button that permanently deletes that investor.
- The investor count shown above the list (below the filter) reflects only the currently visible (filtered) investors, formatted as `Showing: N`.

**Dashboard** — a read-only summary computed from ALL investors (ignoring any active filter):
- `Total investors: N`
- `Intro: N`
- `Pitched: N`
- `Committed: N`
- `Total committed: $N` — the sum of check sizes for investors whose stage is **committed** (formatted as `$N`, e.g. `$150000`; `$0` when none)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists across view navigations.

Seed the app with these three investors already present on first render:
1. Firm: **Acme Ventures**, Stage: **intro**, Check Size: **25000**
2. Firm: **Blue Capital**, Stage: **committed**, Check Size: **100000**
3. Firm: **Crest Fund**, Stage: **pitched**, Check Size: **75000**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
