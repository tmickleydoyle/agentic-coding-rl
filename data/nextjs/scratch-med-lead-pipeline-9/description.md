# Build a Sales Lead Pipeline App

Build a complete single-page React application — a sales lead tracker for a small sales team — with **three views** the user navigates between using a top navigation bar: **Leads**, **Pipeline**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Pipeline**, **Settings**) switches the active view.

**Leads** — the main list of sales leads.
- An input labeled **Company** and an input labeled **Deal Value** (a number in dollars), plus a dropdown labeled **Stage** with options **new**, **demo**, and **won**. A button labeled **Add Lead** adds the lead (ignore if Company is blank or Deal Value is not a positive number).
- Each lead shows its company name, stage, and deal value formatted as `$N` (whole dollars, e.g. `$1500`).
- A dropdown labeled **Filter by stage** with options **All**, **new**, **demo**, **won** filters the displayed leads. The count of currently visible leads appears as `Showing: N`.
- Each lead has a **Delete** button that removes it.

**Pipeline** — a read-only summary derived from ALL leads (ignoring the current filter):
- `Total leads: N`
- `New: N`
- `Demo: N`
- `Won: N`
- `Total value: $N` (sum of all deal values, whole dollars)
- `Won value: $N` (sum of won deal values only)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with these three leads already present on first render:
- Company: **Acme Corp**, Stage: **new**, Deal Value: **5000**
- Company: **Globex**, Stage: **demo**, Deal Value: **12000**
- Company: **Initech**, Stage: **won**, Deal Value: **8000**

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
