# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder tracking tool — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — the main list of stakeholders.
- An input labeled **Name** and a select labeled **Influence** (options: `high`, `med`, `low`) plus an **Add stakeholder** button adds a new stakeholder (ignore a blank name).
- Each stakeholder row shows the name, influence level, and a **Supportive** toggle button. When supportive, the button reads `Supportive: Yes`; when not supportive, it reads `Supportive: No`. Newly added stakeholders default to **not supportive**.
- A filter control: a select labeled **Filter by influence** with options `all`, `high`, `med`, `low`. Selecting a value shows only stakeholders matching that influence level; selecting `all` shows everyone.
- The section heading shows a live count of currently **visible** stakeholders: `Stakeholders (N)` where N reflects the active filter.

**Summary** — a read-only derived view:
- Shows `Total: N` (all stakeholders regardless of filter).
- Shows `High: N`, `Med: N`, `Low: N` counts for each influence level.
- Shows `Supportive: N` (total supportive count across all stakeholders).
- Shows `Support rate: P%` where P is supportive ÷ total as a whole-number percent (0% when there are no stakeholders).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with **no stakeholders** on first load. Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
