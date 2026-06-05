# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder tracking tool — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — the main list of stakeholders.
- An input labeled **Name** and a select dropdown labeled **Influence** (options: `high`, `med`, `low`) plus an **Add stakeholder** button adds a new stakeholder (ignore a blank name).
- Each stakeholder row shows their name, their influence level, and a toggle button that switches their support status. When supportive the button reads **Supportive** and when not supportive it reads **Unsupportive**. New stakeholders start as **Supportive**.
- Each stakeholder row has a **Remove** button that deletes that stakeholder.
- A filter control labeled **Filter by influence** (a select with options: `all`, `high`, `med`, `low`) filters the visible list. The count of currently visible stakeholders is shown as `Showing: N`.

**Summary** — a read-only derived stats view:
- `Total stakeholders: N`
- `Supportive: N`
- `Unsupportive: N`
- `High influence: N`, `Med influence: N`, `Low influence: N`
- `Support rate: P%` where P is supportive ÷ total as a whole-number percent (0% when there are no stakeholders).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed NO initial stakeholders — the list starts empty. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
