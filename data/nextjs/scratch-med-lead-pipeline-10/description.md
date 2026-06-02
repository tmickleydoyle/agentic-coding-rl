# Build a Sales Lead Pipeline app

Build a complete single-page React application — a sales lead pipeline tool — with **three views** the user navigates between using a top navigation bar: **Leads**, **Pipeline**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Pipeline**, **Settings**) switches the active view.

**Leads** — the main list of sales leads.
- An input labeled **Company** and an input labeled **Deal Value** (a number in dollars), plus a dropdown labeled **Stage** with options **new**, **demo**, and **won**. An **Add Lead** button adds the lead (ignore if Company is blank or Deal Value is not a positive number).
- Each lead row shows the company name, its stage, and its deal value formatted as a dollar amount with two decimal places (e.g. `$1500.00`).
- Each lead has a **Delete** button that removes it.
- A dropdown labeled **Filter by stage** with options **all**, **new**, **demo**, **won** — selecting a value filters the visible list to only leads with that stage (default **all**). The count of currently visible leads is shown as `Showing: N leads`.
- The filter persists when the user navigates away and back.

**Pipeline** — a read-only summary, shown as text lines:
`Total leads: N`, `New: N`, `Demo: N`, `Won: N`, and `Total value: $X` where X is the sum of all lead deal values formatted to two decimal places (e.g. `Total value: $3200.00`). Also show `Won value: $X` which is the sum of deal values for won leads only. All counts and totals reflect every lead regardless of the Leads filter.

**Settings**
- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three leads already present at startup:
- Company **Acme Corp**, stage **new**, deal value **1000**
- Company **Globex**, stage **demo**, deal value **2500**
- Company **Initech**, stage **won**, deal value **800**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
