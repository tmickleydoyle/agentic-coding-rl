# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder management tool for internal teams — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — a list of stakeholders with filtering controls.
- An input labeled **Name** and a select labeled **Influence** (options: `High`, `Medium`, `Low`) plus an **Add stakeholder** button adds a new stakeholder (ignore a blank name).
- Each stakeholder row shows their name, their influence level, and a **Supportive** toggle button. When supportive, the button reads `Supportive: Yes`; when not supportive, it reads `Supportive: No`. Newly added stakeholders start as **not supportive**.
- A filter select labeled **Filter by influence** with options `All`, `High`, `Medium`, `Low` filters the visible list. The heading above the list shows the count of currently visible stakeholders like `Stakeholders (3)`.
- Each stakeholder row also has a **Remove** button that deletes that stakeholder from the list.

**Summary** — a read-only derived view.
- Shows `Total stakeholders: N`.
- Shows counts for each influence tier: `High: N`, `Medium: N`, `Low: N`.
- Shows `Supportive: N` (count of stakeholders with supportive toggled on).
- Shows `Support rate: P%` where P is supportive ÷ total as a whole-number percent (0% when there are no stakeholders).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed no initial data; the app starts with an empty stakeholder list.