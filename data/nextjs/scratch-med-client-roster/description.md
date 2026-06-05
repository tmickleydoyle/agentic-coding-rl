# Build a Client Roster app

Build a complete single-page React application — a lightweight CRM roster tool — with **three views** the user navigates between using a top navigation bar: **Roster**, **Summary**, and **Settings**. The app starts on the Roster view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roster**, **Summary**, **Settings**) switches the active view.

**Roster** — the main client list.
- An input labeled **Name** and a select labeled **Status** (options: `active`, `lead`, `churned`) and an input labeled **Lifetime Value** (a numeric dollar amount) plus an **Add Client** button adds a client to the list (ignore a blank name or a non-positive lifetime value).
- Each client row shows their name, their status, and their lifetime value formatted as `$N.NN` (two decimal places, e.g. `$1200.00`).
- Each row has a **Remove** button that deletes the client.
- Above the list, show three filter buttons: **All**, **Active**, **Lead**, **Churned**. Clicking one filters the visible list to only that status (or all). The active filter button reflects which filter is currently selected.
- Below the filter buttons, show the count of currently visible clients as `Showing: N clients`.

**Summary** — a read-only stats panel derived from ALL clients (ignoring the filter):
- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Total value: $N.NN` (sum of all lifetime values, two decimal places)
- `Active value: $N.NN` (sum of lifetime values of active clients only)

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Seed the app with these three clients already present:
- Name: `Acme Corp`, Status: `active`, Lifetime Value: `5000`
- Name: `Globex`, Status: `lead`, Lifetime Value: `1200`
- Name: `Initech`, Status: `churned`, Lifetime Value: `800`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
