# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder management tool for small teams — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — the main list view.
- An input labeled **Name** and a dropdown labeled **Influence** (options: `High`, `Med`, `Low`) plus an **Add stakeholder** button adds a stakeholder to the list (ignore a blank name).
- Each stakeholder row shows their name, their influence level, and a **Supportive** toggle button. When supportive the button reads `Supportive`; when not supportive it reads `Not supportive`. New stakeholders start as supportive.
- Each stakeholder row also has a **Remove** button (labeled `Remove <name>`) that deletes that stakeholder.
- A filter control labeled **Filter by influence** (a dropdown with options: `All`, `High`, `Med`, `Low`) filters the visible list; rows not matching are hidden but still count in the Summary.
- The list heading shows the count of currently visible stakeholders like `Stakeholders (3)`.

**Summary** — a read-only derived view:
- Shows `Total: N` (all stakeholders),
- `High: N`, `Med: N`, `Low: N` counts by influence level,
- `Supportive: N` (count of stakeholders whose toggle is on),
- `Support rate: P%` where P is supportive ÷ total as a whole-number percent (0% when there are no stakeholders).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).

Seed the app with **no initial stakeholders** (empty list on first load).
