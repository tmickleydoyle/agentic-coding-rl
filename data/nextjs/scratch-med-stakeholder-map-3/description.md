# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder management tool — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the Stakeholders view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

**Stakeholders** — the main list of stakeholders.
- An input labeled **Name** and a select labeled **Influence** (options: `high`, `med`, `low`) plus an **Add stakeholder** button adds a new stakeholder (ignore a blank name).
- Each stakeholder row shows their name, influence level, and a **Supportive** toggle button. When supportive, the button reads `Supportive: Yes`; when not, it reads `Supportive: No`. New stakeholders start as not supportive.
- Each stakeholder row has a **Remove** button that deletes the stakeholder.
- A filter section with three buttons — **All**, **High**, **Med**, **Low** — filters the displayed list by influence. The active filter button has `aria-pressed="true"`. Filtering does not affect the Summary counts.
- The heading above the list reads `Stakeholders (N)` where N is the number currently shown (after filtering).

**Summary** — a read-only stats panel computed from ALL stakeholders (no filter applied):
- `Total: N` — total number of stakeholders.
- `High influence: N` — count with influence `high`.
- `Med influence: N` — count with influence `med`.
- `Low influence: N` — count with influence `low`.
- `Supportive: N` — count where the supportive toggle is on.
- `Support rate: P%` — supportive ÷ total as a whole-number percent (0% when there are no stakeholders).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view navigation.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).