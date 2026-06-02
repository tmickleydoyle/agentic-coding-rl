# Build a Bug Triage app

Build a complete single-page React application — an internal bug tracking tool — with **three views** the user navigates between using a top navigation bar: **Bugs**, **Stats**, and **Settings**. The app starts on the Bugs view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Bugs**, **Stats**, **Settings**) switches the active view.

**Bugs** — the main bug list.
- A form with an input labeled **Bug title**, a select labeled **Severity** (options: `Low`, `Medium`, `High`), and an **Add bug** button. Submitting with a blank title is ignored.
- Each bug shows its title, severity, and status. Each bug has a **Close** button that marks it closed; once closed, the button changes to **Reopen** to allow toggling back to open.
- A filter control labeled **Filter by status** with options: `All`, `Open`, `Closed`. Default is `All`. The filter only affects which bugs are displayed in the list — not the Stats view.
- The nav button label shows a live open count: **`Bugs (N)`** where N is the number of open bugs. When there are zero open bugs, it shows **`Bugs (0)`**.
- Seed the app with three initial bugs: `Login fails on Safari` (High, open), `Button misaligned on mobile` (Medium, open), `Tooltip flickers` (Low, open).

**Stats** — a read-only summary derived from all bugs (ignores the filter):
- `Total bugs: N`
- `Open: N`
- `Closed: N`
- `High open: N`
- `Medium open: N`
- `Low open: N`

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
