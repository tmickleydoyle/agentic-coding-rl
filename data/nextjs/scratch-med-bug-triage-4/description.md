# Build a Bug Triage app

Build a complete single-page React application — a lightweight bug tracking tool — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the Bugs view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

**Bugs** — the main list of bugs.
- An input labeled **Title** and a `<select>` labeled **Severity** (options: `low`, `medium`, `high`) plus an **Add Bug** button adds a new bug with status `open` (ignore a blank title).
- Each bug row shows its title, its severity, and its current status (`open` or `closed`).
- Each bug row has a **Close** button that sets the bug's status to `closed` (the button is disabled or absent when the bug is already closed).
- A `<select>` labeled **Filter by status** with options `all`, `open`, `closed` filters the visible list. The heading above the list shows the live count of currently visible bugs, e.g. `Bugs (3)`. When the filter is `all` every bug is shown; `open` shows only open bugs; `closed` shows only closed bugs.
- Seed the app with **two** pre-existing bugs on first load: `Login page crash` with severity `high` and status `open`; `Typo in footer` with severity `low` and status `open`.

**Stats** — a read-only summary computed from all bugs (regardless of the active filter):
- `Total bugs: N`
- `Open: N`
- `Closed: N`
- `High (open): N` — count of open bugs with severity high
- `Medium (open): N` — count of open bugs with severity medium
- `Low (open): N` — count of open bugs with severity low

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
