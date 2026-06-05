# Build a Sales Lead Pipeline App

Build a complete single-page React application — a sales lead tracker — with **three views** the user navigates between using a top navigation bar: **Leads**, **Pipeline**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Pipeline**, **Settings**) switches the active view.

**Leads** — the main list of sales leads.
- An input labeled **Company** for the company name.
- A select labeled **Stage** with options **new**, **demo**, and **won**.
- An input labeled **Deal Value** for a numeric dollar amount (whole numbers only).
- An **Add Lead** button that adds the lead (ignore if Company is blank or Deal Value is not a positive number).
- Each lead row shows the company name, its stage, and the deal value formatted as `$N` (e.g. `$5000`).
- Each lead row has a **Delete** button (labeled `Delete <Company>`) that removes it.
- Above the list, show a **Stage** filter with buttons: **All**, **New**, **Demo**, **Won**. The active filter highlights the currently selected stage. Filtering changes which leads are shown but does NOT remove them.
- When a filter is active, show only leads matching that stage. When **All** is selected, show all leads.
- The heading above the list reflects the active filter and count, e.g. `All Leads (3)`, `New Leads (1)`, `Demo Leads (2)`, `Won Leads (0)`.

Seed the app with these three leads on first load:
- Company: **Acme Corp**, Stage: **new**, Deal Value: **$12000**
- Company: **Globex**, Stage: **demo**, Deal Value: **$8500**
- Company: **Initech**, Stage: **won**, Deal Value: **$3200**

**Pipeline** — a read-only summary computed from all leads (ignoring the active filter):
- `Total Leads: N`
- `New: N`
- `Demo: N`
- `Won: N`
- `Total Pipeline: $N` (sum of all deal values, formatted with a dollar sign and no decimals)
- `Won Pipeline: $N` (sum of deal values for won leads only)
- `Win Rate: P%` where P is won ÷ total as a whole-number percent (0% when there are no leads)

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
