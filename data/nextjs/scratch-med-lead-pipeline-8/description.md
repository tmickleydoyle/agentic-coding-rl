# Build a Sales Lead Pipeline app

Build a complete single-page React application — a sales lead pipeline tracker — with **three views** the user navigates between using a top navigation bar: **Leads**, **Summary**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Summary**, **Settings**) switches the active view.

**Leads** — the main list of sales leads.
- A form with three inputs:
  - An input labeled **Company** for the company name.
  - A select labeled **Stage** with options **new**, **demo**, and **won**.
  - An input labeled **Deal Value** for a numeric dollar amount (whole numbers only).
  - An **Add Lead** button that adds the lead (ignore submissions where Company is blank or Deal Value is not a positive number).
- A filter section with a select labeled **Filter by stage** with options **all**, **new**, **demo**, **won**. When a stage is selected (not "all"), only leads matching that stage are shown in the list. The filter does NOT affect totals in Summary.
- Each lead in the list shows its company name, its stage, and its deal value formatted as `$N` (e.g. `$5000`).
- Each lead has a **Delete** button (accessible as `Delete <Company>`) that removes the lead entirely.
- Below the list, show a line: `Showing: N leads` where N is the number of currently visible leads (after filtering).

**Summary** — a read-only derived stats panel. All numbers here reflect ALL leads regardless of the current filter.
- Show these lines of text:
  - `Total leads: N`
  - `New: N`
  - `Demo: N`
  - `Won: N`
  - `Total pipeline: $N` (sum of all deal values, e.g. `Total pipeline: $15000`)
  - `Won value: $N` (sum of deal values for won leads only)

**Settings** — a simple preferences panel.
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element, and it persists across view switches.

Seed the app with these three initial leads so tests can rely on them:
1. Company: **Acme Corp**, Stage: **new**, Deal Value: **5000**
2. Company: **Beta LLC**, Stage: **demo**, Deal Value: **12000**
3. Company: **Gamma Inc**, Stage: **won**, Deal Value: **8000**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
