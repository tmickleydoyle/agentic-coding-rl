# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder tracking tool for small teams — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — the main list of stakeholders.
- An input labeled **Name** and a select labeled **Influence** (options: `high`, `med`, `low`) plus an **Add** button adds a new stakeholder (ignore a blank name).
- Each stakeholder row shows their name, influence level, and a **Supportive** toggle button. The button label reads **Supportive: Yes** when the stakeholder is supportive, and **Supportive: No** when they are not. New stakeholders start as **not supportive**.
- Each row also has a **Remove** button that deletes that stakeholder.
- A filter control labeled **Filter by influence** (a select with options: `all`, `high`, `med`, `low`) filters the visible list. The heading above the list reads `Stakeholders (N)` where N is the count of currently **visible** (filtered) stakeholders.
- Navigating away and back preserves all stakeholder data and the current filter selection.

**Summary** — a read-only derived view:
- Shows a line `Total: N` (total stakeholders, ignoring filter).
- Shows `High: N`, `Med: N`, `Low: N` counts (unfiltered totals per influence level).
- Shows `Supportive: N` (count of stakeholders with supportive toggled on, unfiltered).
- Shows `Support rate: P%` where P is the number of supportive stakeholders divided by total stakeholders as a whole-number percent (show `0%` when there are no stakeholders).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
