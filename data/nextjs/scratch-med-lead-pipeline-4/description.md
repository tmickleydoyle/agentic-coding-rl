# Build a Sales Lead Pipeline app

Build a complete single-page React application — a sales lead tracker — with **three views** the user navigates between using a top navigation bar: **Leads**, **Dashboard**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Dashboard**, **Settings**) switches the active view.

**Leads** — the main list of sales leads.
- An input labeled **Company** for the company name.
- An input labeled **Deal Value** for the deal value (a number in dollars).
- A select labeled **Stage** with options **new**, **demo**, and **won**.
- An **Add Lead** button that adds the lead to the list (ignore submissions where Company is blank or Deal Value is not a positive number).
- Below the form, a select labeled **Filter by stage** with options **all**, **new**, **demo**, **won** that filters the displayed list.
- Each lead in the list shows the company name, stage, and deal value formatted as `$X.XX` (two decimal places).
- Each lead has a **Delete** button that removes it from the list.
- Below the list, show the total of visible (filtered) leads as `Showing: N leads` and the sum of their deal values as `Filtered Total: $X.XX`.

**Dashboard** — a read-only summary of all leads (regardless of the current filter).
- Shows `Total Leads: N`.
- Shows `New: N`, `Demo: N`, `Won: N` (counts per stage).
- Shows `Pipeline Total: $X.XX` (sum of ALL lead deal values).
- Shows `Won Total: $X.XX` (sum of deal values for won leads only).
- Shows `Win Rate: P%` where P is won ÷ total leads as a whole-number percent (0% when there are no leads).

**Settings**
- A **Toggle theme** button that switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.

Seed the app with these three leads already in the list:
- Company: **Acme Corp**, Stage: **new**, Deal Value: **5000**
- Company: **Globex**, Stage: **demo**, Deal Value: **12000**
- Company: **Initech**, Stage: **won**, Deal Value: **8500**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
