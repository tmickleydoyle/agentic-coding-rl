# Build a Client Roster app

Build a complete single-page React application — a client roster tool for a small agency — with **three views** the user navigates between using a top navigation bar: **Roster**, **Summary**, and **Settings**. The app starts on the Roster view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roster**, **Summary**, **Settings**) switches the active view.

## Seed data

Preload the app with these three clients:
- Name: `Acme Corp`, Status: `active`, Lifetime Value: `12000`
- Name: `Globex`, Status: `lead`, Lifetime Value: `0`
- Name: `Initech`, Status: `churned`, Lifetime Value: `4500`

**Roster** — a list of all clients plus controls to add new ones and filter by status.
- An input labeled **Client name** and a numeric input labeled **Lifetime value** plus a **Status** dropdown (options: `active`, `lead`, `churned`) and an **Add client** button adds a new client (ignore a blank name or a missing/zero lifetime value for leads and actives; allow zero for churned).
- A **Filter** dropdown labeled **Filter by status** with options: `all`, `active`, `lead`, `churned`. Selecting a filter hides clients that do not match; the default is `all`.
- Each client row shows the client name, their status label (one of `active`, `lead`, `churned`), and their lifetime value formatted as `$N` (whole dollars, no decimals, e.g. `$12000`).
- Each client row has a **Delete** button (aria-label `Delete <name>`) that removes them permanently.

**Summary** — a read-only dashboard computed from all clients (ignoring the filter):
- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Total value: $N` (sum of all lifetime values, whole dollars)
- `Active value: $N` (sum of lifetime values of active clients only)

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
