# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder management tool — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — the main list view.
- An input labeled **Name** and a select labeled **Influence** (with options **high**, **med**, **low**) plus an **Add stakeholder** button adds a new stakeholder (ignore a blank name).
- Each stakeholder row shows their name, their influence level, and a **Supportive** toggle button. When supportive the button reads **Supportive**; when not supportive it reads **Not supportive**. Clicking it toggles the state.
- A filter select labeled **Filter by influence** with options **all**, **high**, **med**, **low** filters the visible list. The heading above the list shows the count of currently visible stakeholders like `Stakeholders (3)`.
- Each stakeholder row has a **Remove** button that deletes that stakeholder.

**Summary** — a read-only derived stats view:
- Shows `Total: N` (all stakeholders regardless of filter).
- Shows `High: N`, `Med: N`, `Low: N` counts.
- Shows `Supportive: N` (count of stakeholders whose supportive toggle is on).
- Shows `Support rate: P%` where P is supportive ÷ total as a whole-number percent (0% when there are no stakeholders).

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with these three stakeholders already present on first render:
- Name: **Alice**, Influence: **high**, Supportive: true
- Name: **Bob**, Influence: **med**, Supportive: false
- Name: **Carol**, Influence: **low**, Supportive: true

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
