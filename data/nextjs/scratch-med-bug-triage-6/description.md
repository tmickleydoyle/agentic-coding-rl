# Build a Bug Triage app

Build a complete single-page React application — a lightweight internal bug tracker — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the Bugs view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

**Bugs** — the main list of bugs.
- A form with:
  - An input labeled **Title** for the bug title.
  - A select labeled **Severity** with options **low**, **medium**, **high**.
  - An **Add Bug** button that appends the bug to the list with status **open** (ignore a blank title).
- A filter control: a set of buttons labeled **All**, **Open**, **Closed** that filter which bugs are shown. The active filter defaults to **All**.
- Each bug shows its title, severity badge, and a toggle button: if the bug is **open** show a button labeled **Close**, if the bug is **closed** show a button labeled **Reopen**. Toggling changes the bug's status in place.
- A summary line above the list showing the total visible count like `Showing: 3 bugs`.

Seed the app with these three bugs already present at startup:
1. Title: `Login page crash`, Severity: `high`, Status: `open`
2. Title: `Typo in footer`, Severity: `low`, Status: `closed`
3. Title: `Slow dashboard load`, Severity: `medium`, Status: `open`

**Stats** — a read-only derived summary:
- `Total bugs: N`
- `Open: N`
- `Closed: N`
- Open bugs broken down by severity (only counts bugs whose status is open):
  - `Open high: N`
  - `Open medium: N`
  - `Open low: N`

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
