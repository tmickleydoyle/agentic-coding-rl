# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder management tool for small teams — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — the main list of stakeholders.
- An input labeled **Name** plus a dropdown labeled **Influence** (options: `high`, `med`, `low`) and an **Add stakeholder** button adds a new stakeholder (ignore a blank name).
- Each stakeholder row shows their name, their influence level, and a **Supportive** toggle button. When supportive, the button reads `Supportive: Yes`; when not supportive, it reads `Supportive: No`. New stakeholders default to **not supportive**.
- Each stakeholder row also has a **Remove** button that deletes them from the list.
- A dropdown labeled **Filter by influence** (options: `all`, `high`, `med`, `low`) filters the visible list. The filter does NOT affect the data — only what is displayed. Counts in this view are based on the **filtered** list.
- Below the filter, show a line: `Showing: N stakeholders` where N is the number currently visible after filtering.

**Summary** — a read-only derived stats panel.
- Shows `Total: N` where N is the total number of stakeholders (all, unfiltered).
- Shows `High: N`, `Med: N`, `Low: N` counts for each influence level (unfiltered).
- Shows `Supportive: N` — the count of stakeholders whose toggle is on (unfiltered).
- Shows `Support rate: P%` where P is supportive ÷ total as a whole-number percent (0% when there are no stakeholders).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
