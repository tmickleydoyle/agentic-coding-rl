# Build a Bug Triage app

Build a complete single-page React application — a lightweight bug tracker for small teams — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the Bugs view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

**Bugs** — the main bug list.
- A form with an input labeled **Title**, a select labeled **Severity** (options: `Low`, `Medium`, `High`), and an **Add Bug** button. Ignore a blank title. New bugs start with status `open`.
- A filter control: a select labeled **Filter by status** with options `All`, `Open`, `Closed`. Default is `All`.
- Each bug row shows its title, severity, and a status badge (`open` or `closed`).
- Each bug row has a **Close** button (only visible when the bug is open) that sets its status to `closed`, and a **Reopen** button (only visible when the bug is closed) that sets its status to `open`.
- The heading above the list reads `Bugs (N)` where N is the number of bugs currently visible after filtering.

**Stats** — a read-only summary derived from all bugs (ignores the filter):
- `Total bugs: N`
- `Open: N`
- `Closed: N`
- `High (open): N` — count of open bugs with severity High
- `Medium (open): N` — count of open bugs with severity Medium
- `Low (open): N` — count of open bugs with severity Low

**Settings**
- A **Toggle theme** button that switches between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with **no bugs** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
