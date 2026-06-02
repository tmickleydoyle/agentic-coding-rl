# Build a Bug Triage app

Build a complete single-page React application — a lightweight internal bug triage tool — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the **Bugs** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

**Bugs** — the main bug list.
- An input labeled **Title** and a select labeled **Severity** (options: **Low**, **Medium**, **High**) plus an **Add Bug** button adds a new bug (ignore a blank title). New bugs start with status **open**.
- A filter control labeled **Filter by status** with options **All**, **Open**, **Closed** (default: **All**) filters the visible list without affecting stored data.
- Each bug row shows its title, severity, and a **Close** button (disabled if already closed) and a **Reopen** button (disabled if already open). Closed bugs show the label **closed**; open bugs show the label **open**.
- The heading above the list reads `Bugs (N)` where N is the count of bugs matching the current filter.

**Stats** — a read-only summary derived from ALL bugs (ignores the filter):
- `Total bugs: N`
- `Open: N`
- `Closed: N`
- `High (open): N` — count of open bugs with severity High
- `Medium (open): N` — count of open bugs with severity Medium
- `Low (open): N` — count of open bugs with severity Low

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with NO bugs initially (empty state).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
