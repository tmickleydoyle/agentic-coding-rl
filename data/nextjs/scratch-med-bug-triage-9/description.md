# Build a Bug Triage app

Build a complete single-page React application — a lightweight bug triage tool for a small engineering team — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the **Bugs** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

**Bugs** — the main list of reported bugs.
- An input labeled **Title** and a `<select>` labeled **Severity** (options: `low`, `medium`, `high`, `critical`) plus an **Add bug** button adds a new bug. The initial status of every new bug is `open`. Ignore a blank title.
- A `<select>` labeled **Filter by status** with options **all**, **open**, and **closed** filters the displayed list (default: `all`).
- Each bug row shows its title, its severity, and its status (`open` or `closed`).
- Each open bug has a **Close** button that sets its status to `closed`.
- Each closed bug has a **Reopen** button that sets its status back to `open`.
- A summary line below the filter reads `Showing: N bugs` where N is the number of bugs currently visible after filtering.

**Stats** — a read-only derived summary (no inputs):
- `Total bugs: N`
- `Open: N`
- `Closed: N`
- `Critical open: N` — count of open bugs with severity `critical`
- `High open: N` — count of open bugs with severity `high`
- `Medium open: N` — count of open bugs with severity `medium`
- `Low open: N` — count of open bugs with severity `low`

**Settings** — a single control:
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with **zero** bugs on first load. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Implement the root component as the default export of `app/page.tsx`. Routing is in-app state only.
