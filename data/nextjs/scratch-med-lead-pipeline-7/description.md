# Build a Sales Lead Pipeline app

Build a complete single-page React application — a sales lead pipeline tracker — with **three views** the user navigates between using a top navigation bar: **Leads**, **Pipeline**, and **Settings**. The app starts on the **Leads** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Pipeline**, **Settings**) switches the active view.

**Leads** — the main list of sales leads.
- An input labeled **Company** and an input labeled **Deal Value** (a number) plus a **Stage** select with options **new**, **demo**, and **won**, and an **Add Lead** button. Adding a lead with a blank company name or a non-positive deal value is ignored.
- Each lead shows its company name, stage, and deal value formatted as `$N` (whole dollar, no decimals, e.g. `$1500`).
- Each lead has a **Delete** button that removes it.
- A **Filter by stage** select with options **all**, **new**, **demo**, **won** filters the visible list. When a filter is active, only leads matching that stage are shown. The heading reads `Leads (N)` where N is the number of currently visible leads (after filtering).
- Seed the app with these three leads on startup: company `Acme Corp`, stage `new`, deal value `5000`; company `Globex`, stage `demo`, deal value `12000`; company `Initech`, stage `won`, deal value `8000`.

**Pipeline** — a read-only summary dashboard computed from all leads (ignoring the filter):
- Shows the text `Total leads: N`.
- Shows `New: N`, `Demo: N`, `Won: N` (counts per stage).
- Shows `Total value: $N` (sum of all deal values, whole dollars, e.g. `Total value: $25000`).
- Shows `Won value: $N` (sum of deal values for leads in the won stage).

**Settings**
- A **Toggle theme** button switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across navigation.
- Shows the current theme label, e.g. `Toggle theme (current: light)`.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).