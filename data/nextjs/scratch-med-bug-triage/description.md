# Build a Bug Triage Tool

Build a complete single-page React application — a lightweight bug triage tool for a small engineering team — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the **Bugs** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

**Bugs** — the main bug list.
- An input labeled **Title** and a `<select>` labeled **Severity** (options: `low`, `medium`, `high`) plus an **Add Bug** button adds a new bug (ignore a blank title). New bugs always start with status **open**.
- A `<select>` labeled **Filter by status** with options `all`, `open`, `closed`. When set to `open`, only open bugs are shown; when `closed`, only closed bugs; when `all`, all bugs are shown. The filter defaults to `all`.
- Each bug row shows its title, severity badge, and a status toggle button. When the bug is open the button reads **Close**; when the bug is closed the button reads **Reopen**. Clicking toggles the bug's status between open and closed.
- A summary line below the list reads `Showing: N bugs` where N is the count of currently visible bugs (matching the active filter).

**Stats** — a read-only derived summary:
- `Total bugs: N`
- `Open: N`
- `Closed: N`
- `Open high severity: N`
- `Open medium severity: N`
- `Open low severity: N`
- `Closed rate: P%` where P is closed ÷ total as a whole-number percent (0% when there are no bugs).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across view navigation.

Seed the app with the following three bugs already present on first render:
1. Title: `Login page crashes`, Severity: `high`, Status: `open`
2. Title: `Tooltip flicker`, Severity: `low`, Status: `open`
3. Title: `Wrong favicon`, Severity: `low`, Status: `closed`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
