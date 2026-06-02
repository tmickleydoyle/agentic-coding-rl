# Build a Bug Triage app

Build a complete single-page React application — a lightweight bug tracking tool — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the Bugs view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

## Bugs view

A form at the top lets the user add a new bug:
- An input labeled **Title** for the bug's title (ignore a blank title).
- A select labeled **Severity** with options **low**, **medium**, and **high** (default: **low**).
- An **Add Bug** button that appends the new bug to the list.

Below the form, a row of filter buttons lets the user filter the list by status:
- **All** — shows every bug.
- **Open** — shows only open bugs.
- **Closed** — shows only closed bugs.

The currently active filter button should have `aria-pressed="true"`; the others have `aria-pressed="false"`.

Each bug in the list shows:
- Its **title**.
- Its **severity** (low / medium / high).
- Its current **status** as a badge: `Open` or `Closed`.
- A **Close Bug** button (disabled when the bug is already closed) that sets the bug's status to closed.

The list heading shows the count of bugs currently visible under the active filter, e.g. `Bugs (3)` (updates as bugs are added or filtered).

## Stats view

A read-only summary derived from all bugs (ignoring the current filter). Show each of these as its own line of text:
- `Total: N` — total number of bugs ever added.
- `Open: N` — number of bugs with status open.
- `Closed: N` — number of bugs with status closed.
- `High open: N` — number of open bugs with severity high.
- `Medium open: N` — number of open bugs with severity medium.
- `Low open: N` — number of open bugs with severity low.

## Settings view

- A **Toggle theme** button that switches between **light** and **dark** themes. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and persists as the user navigates.
- Display the current theme inline, e.g. the button reads `Toggle theme (current: light)` or `Toggle theme (current: dark)`.

The default theme is **light**.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs. Routing is in-app state, not the file router.

## Seed data

The app starts with **no bugs**; all bugs are created through the UI.
