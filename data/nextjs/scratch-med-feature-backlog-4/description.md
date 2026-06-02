# Build a Feature Backlog app

Build a complete single-page React application — a lightweight product feature backlog tool — with **three views** the user navigates between using a top navigation bar: **Backlog**, **Stats**, and **Settings**. The app starts on the Backlog view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Backlog**, **Stats**, **Settings**) switches the active view.

**Backlog** — the main list of product features.
- An input labeled **Feature title** plus a **Priority** dropdown (options: `P0`, `P1`, `P2`) and an **Add feature** button adds a new feature. Ignore a blank title.
- Each new feature starts with status **idea**. Other statuses are **building** and **shipped**.
- Each feature row shows its title, its priority badge, and its current status.
- Each row has an **Advance** button that moves the status forward: `idea → building → shipped`. The button is disabled when status is already `shipped`.
- A **Filter by priority** dropdown (options: `All`, `P0`, `P1`, `P2`) filters the visible list. The heading below the filter shows the count of visible features, e.g. `Showing 3 of 5 features`.
- A **Delete** button on each row removes that feature entirely.

**Stats** — a read-only derived summary, shown as text lines:
`Total: N`, `P0: N`, `P1: N`, `P2: N`, `Idea: N`, `Building: N`, `Shipped: N`, and `Shipped: P%` where P is shipped ÷ total as a whole-number percent (0% when there are no features).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with these three features already present on first render:
1. Title: `OAuth login`, Priority: `P0`, Status: `idea`
2. Title: `CSV export`, Priority: `P1`, Status: `building`
3. Title: `Dark mode`, Priority: `P2`, Status: `shipped`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
