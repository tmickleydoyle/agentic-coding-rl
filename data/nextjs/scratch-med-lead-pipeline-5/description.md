# Build a Sales Lead Pipeline app

Build a complete single-page React application — a sales lead pipeline tracker — with **three views** the user navigates between using a top navigation bar: **Leads**, **Pipeline**, and **Settings**. The app starts on the Leads view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Leads**, **Pipeline**, **Settings**) switches the active view.

**Leads** — a list of sales leads.
- An input labeled **Company** and an input labeled **Deal Value** (a number in dollars) and a select labeled **Stage** (options: `new`, `demo`, `won`) plus an **Add Lead** button adds a lead (ignore a blank company name or a non-positive deal value).
- Each lead shows its company name, stage, and deal value formatted as `$X.XX` (two decimal places).
- A select labeled **Filter by stage** with options `all`, `new`, `demo`, `won` filters the visible list; choosing a stage shows only leads with that stage. Choosing `all` shows every lead.
- Each lead row has a **Delete** button that removes that lead from the list entirely.
- The heading above the list shows the count of currently visible leads, like `Leads (3)`.

**Pipeline** — a read-only summary derived from all leads (not filtered by the Leads filter):
- `Total leads: N` — total number of leads regardless of stage.
- `New: N` — count of leads with stage `new`.
- `Demo: N` — count of leads with stage `demo`.
- `Won: N` — count of leads with stage `won`.
- `Total pipeline: $X.XX` — sum of all lead deal values formatted to two decimal places.
- `Won value: $X.XX` — sum of deal values for leads with stage `won`, formatted to two decimal places.
- `Win rate: P%` — won ÷ total leads as a whole-number percent (0% when there are no leads).

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.
- The button label shows the current theme, like `Toggle theme (current: light)`.

Seed the app with these three leads already present when it loads:
- Company `Acme Corp`, stage `new`, deal value `5000`
- Company `Globex`, stage `demo`, deal value `12000`
- Company `Initech`, stage `won`, deal value `8500`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
