# Build a Sales Lead Pipeline app

Build a complete single-page React application — a sales lead tracker for a small sales team — with **three views** the user navigates between using a top navigation bar: **Leads**, **Pipeline**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Pipeline**, **Settings**) switches the active view.

## Seed data

The app starts with these three leads already in the list:
- Company: `Acme Corp`, Stage: `new`, Deal Value: `5000`
- Company: `Globex`, Stage: `demo`, Deal Value: `12000`
- Company: `Initech`, Stage: `won`, Deal Value: `8500`

**Leads** — the main list of sales leads.
- An input labeled **Company** and an input labeled **Deal Value** (a number), plus a dropdown/select labeled **Stage** with options **new**, **demo**, and **won**, plus an **Add Lead** button adds a new lead (ignore if Company is blank or Deal Value is not a positive number).
- Each lead row shows the company name, the stage badge, and the deal value formatted as `$N` (whole dollars, no decimals, e.g. `$5000`).
- Each lead row has a **Delete** button (labeled `Delete <Company>`) that removes that lead.
- A filter control: a dropdown/select labeled **Filter by stage** with options **all**, **new**, **demo**, **won**. When a stage is selected, only leads with that stage are shown in the list. The heading above the list reads `Leads (N)` where N is the count of currently visible leads (after filtering).

**Pipeline** — a read-only summary derived from all leads (regardless of filter):
- `Total leads: N`
- `New: N`
- `Demo: N`
- `Won: N`
- `Total pipeline: $N` (sum of all deal values, whole dollars)
- `Won pipeline: $N` (sum of deal values for won leads only)

**Settings**
- A **Toggle theme** button switches the theme between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
