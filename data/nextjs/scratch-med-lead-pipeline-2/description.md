# Build a Sales Lead Pipeline app

Build a complete single-page React application — a sales lead tracker — with **three views** the user navigates between using a top navigation bar: **Leads**, **Pipeline**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Pipeline**, **Settings**) switches the active view.

## Seed Data

The app starts with the following three leads already loaded:
- Company: **Acme Corp**, Stage: **new**, Deal Value: **12000**
- Company: **Globex**, Stage: **demo**, Deal Value: **8500**
- Company: **Initech**, Stage: **won**, Deal Value: **22000**

## Leads view

Shows a list of sales leads and lets the user add new ones.

- An input labeled **Company** for the company name.
- An input labeled **Deal Value** for a numeric dollar amount.
- A select/dropdown labeled **Stage** with options **new**, **demo**, and **won**.
- An **Add Lead** button that adds the lead (ignore entries where Company is blank or Deal Value is not a positive number).
- Each lead row shows the company name, the stage, and the deal value formatted as a dollar amount with no decimals, e.g. `$12000`.
- Each lead row has a **Delete** button (accessible as `Delete <Company>`) that removes it.
- A stage filter at the top labeled **Filter by stage** with options **all**, **new**, **demo**, **won**. When a filter other than **all** is selected, only matching leads are shown in the list. The filter does NOT affect the Pipeline stats.
- Below the filter, show a count of currently visible leads as `Showing: N leads`.

## Pipeline view

A read-only summary derived from ALL leads (ignoring the filter). Shows:
- `Total leads: N`
- `New: N`
- `Demo: N`
- `Won: N`
- `Total pipeline: $N` — sum of all deal values, no decimals, e.g. `Total pipeline: $42500`
- `Won value: $N` — sum of won deal values only, e.g. `Won value: $22000`
- `Win rate: P%` — won ÷ total as a whole-number percent (0% when there are no leads), e.g. `Win rate: 33%`

## Settings view

- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- The button label shows the current theme, e.g. `Toggle theme (current: light)`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
