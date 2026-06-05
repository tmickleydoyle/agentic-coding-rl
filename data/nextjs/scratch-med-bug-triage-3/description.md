# Build a Bug Triage Tool

Build a complete single-page React application — a lightweight bug triage tool for a small dev team — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the **Bugs** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

**Bugs** — the main list of bugs.
- An input labeled **Title** and a dropdown labeled **Severity** (options: `low`, `medium`, `high`) plus an **Add Bug** button adds a new bug. Ignore a blank title. New bugs always start with status **open**.
- A filter control labeled **Filter by status** with options `all`, `open`, `closed` (default `all`) limits which bugs are shown in the list.
- Each bug in the list shows its title, its severity, and its status (`open` or `closed`).
- Each bug has a **Close** button (disabled when already closed) that sets its status to `closed`.
- Each bug has a **Reopen** button (disabled when already open) that sets its status to `open`.
- The list heading shows the count of bugs currently shown (after filtering), like `Bugs (3)`.

**Stats** — a read-only derived summary:
- `Total bugs: N`
- `Open: N`
- `Closed: N`
- `Open high: N` — count of open bugs with severity `high`
- `Open medium: N` — count of open bugs with severity `medium`
- `Open low: N` — count of open bugs with severity `low`
- `Closed rate: P%` — closed ÷ total as a whole-number percent (0% when there are no bugs)

**Settings**
- A **Toggle theme** button that switches between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with **no bugs** on first load.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
