# Build a Sales Lead Pipeline app

Build a complete single-page React application — a sales lead tracker — with **three views** the user navigates between using a top navigation bar: **Leads**, **Summary**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Summary**, **Settings**) switches the active view.

**Leads** — the main list of sales leads.
- An input labeled **Company** and an input labeled **Deal Value** (a number) plus a **Stage** select with options **new**, **demo**, and **won**, plus an **Add Lead** button. Clicking **Add Lead** adds the lead (ignore if Company is blank or Deal Value is not a positive number).
- Each lead shows its company name, stage, and deal value formatted as `$N` (whole dollars, no decimals, e.g. `$5000`).
- Each lead has a **Delete** button that removes it.
- A **Filter by stage** select with options **All**, **new**, **demo**, **won** filters the visible list. When a filter is active, only matching leads are shown. The count shown in the list area heading updates to reflect filtered results: `Showing N leads`.
- The filter persists when navigating away and back.

**Summary** — a read-only derived stats view.
- Shows `Total leads: N`, `New: N`, `Demo: N`, `Won: N`.
- Shows `Pipeline total: $N` (sum of ALL leads' deal values, whole dollars).
- Shows `Won total: $N` (sum of only won leads' deal values).
- Shows `Win rate: P%` where P is won ÷ total as a whole-number percent (0% when no leads).

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- Seed the app with these three leads already in the list on first load:
  - Company: **Acme Corp**, Stage: **new**, Deal Value: **5000**
  - Company: **Globex**, Stage: **demo**, Deal Value: **12000**
  - Company: **Initech**, Stage: **won**, Deal Value: **8000**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).