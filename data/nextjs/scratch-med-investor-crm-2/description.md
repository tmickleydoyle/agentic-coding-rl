# Build an Investor CRM app

Build a complete single-page React application — a lightweight investor relationship tracker — with **three views** the user navigates between using a top navigation bar: **Investors**, **Summary**, and **Settings**. The app starts on the Investors view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Investors**, **Summary**, **Settings**) switches the active view.

**Investors** — the main list of investor contacts.
- A form with three inputs:
  - **Firm** (text) — the investor's firm name
  - **Check Size** (number) — the check size in whole dollars
  - **Stage** (a `<select>`) — one of `intro`, `pitched`, or `committed` (in that order)
  - A button labeled **Add Investor** that adds the entry (ignore if Firm is blank or Check Size is not a positive number).
- Below the form, a **Filter by stage** `<select>` with options `all`, `intro`, `pitched`, `committed` (default `all`). Changing it filters the displayed list but does NOT remove entries.
- Each investor entry shows: the firm name, the stage, and the check size formatted as `$N` (whole dollars, no decimals, e.g. `$50000`), plus a **Remove** button that permanently deletes that investor.
- The list heading reads `Investors (N)` where N is the count of currently **displayed** (filtered) investors.

**Summary** — a read-only stats panel computed from ALL investors (ignoring the filter):
- `Total investors: N`
- `Intro: N`
- `Pitched: N`
- `Committed: N`
- `Total committed: $N` — sum of check sizes for committed investors only, formatted as `$N` (whole dollars)
- `Conversion: P%` — committed ÷ total investors as a whole-number percent (0% when there are no investors)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a wrapping root element and persists across view navigations.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with NO initial investors (empty state).
