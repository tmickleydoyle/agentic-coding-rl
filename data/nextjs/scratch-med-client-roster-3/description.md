# Build a Client Roster app

Build a complete single-page React application — a small internal CRM tool — with **three views** the user navigates between using a top navigation bar: **Clients**, **Summary**, and **Settings**. The app starts on the Clients view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Clients**, **Summary**, **Settings**) switches the active view.

**Clients** — the main list of clients.
- An input labeled **Name** and a select labeled **Status** (options: `active`, `lead`, `churned`) and an input labeled **Lifetime Value** plus an **Add Client** button adds a client (ignore a blank name or a non-positive lifetime value).
- Each client row shows its name, its status, and its lifetime value formatted with a dollar sign and two decimal places (e.g. `$1200.00`).
- Each client row has a **Remove** button that deletes that client.
- A filter control: a select labeled **Filter by status** with options `all`, `active`, `lead`, `churned`. When a filter is selected, only clients matching that status are shown in the list (all other views are unaffected — they always use the full unfiltered list).
- The list heading shows the count of currently displayed clients, e.g. `Clients (3)`.

**Summary** — a read-only stats panel derived from ALL clients (ignoring the filter):
- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Total value: $N` where N is the sum of all lifetime values formatted with a dollar sign and two decimal places (e.g. `Total value: $3600.00`).
- `Active value: $N` — sum of lifetime values for active clients only, same format.

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across views.

Seed the app with three clients already in the list:
- `Acme Corp`, status `active`, lifetime value `5000`
- `Globex`, status `lead`, lifetime value `1200`
- `Initech`, status `churned`, lifetime value `800`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
