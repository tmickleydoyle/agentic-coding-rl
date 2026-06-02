# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder management tool — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — the main list view.
- An input labeled **Name** and a select labeled **Influence** (options: `high`, `med`, `low`) plus an **Add stakeholder** button adds a new stakeholder (ignore blank name).
- Each stakeholder row shows their name, influence level, and a **Supportive** toggle button. When supportive, the button label is `Supportive`; when not supportive, it is `Not supportive`. New stakeholders start as **not supportive**.
- Each row also has a **Remove** button (with aria-label `Remove <name>`) that deletes the stakeholder.
- A filter control — a select labeled **Filter by influence** — with options `all`, `high`, `med`, `low` that filters the list to only show stakeholders of the chosen influence level (or all). The count shown in the heading updates based on the current filter: `Stakeholders (<n>)` where n is the number currently visible.
- The Influence select for new stakeholders defaults to `high`.

**Summary** — a read-only stats view computed from all stakeholders (ignores filter).
- Shows the following text lines:
  - `Total: N`
  - `High influence: N`
  - `Med influence: N`
  - `Low influence: N`
  - `Supportive: N`
  - `Support rate: P%` where P is supportive ÷ total as a whole-number percent (0% when there are no stakeholders).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
