# Build a Client Roster app

Build a complete single-page React application — a client roster tool for a small agency — with **three views** the user navigates between using a top navigation bar: **Roster**, **Stats**, and **Settings**. The app starts on the Roster view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roster**, **Stats**, **Settings**) switches the active view.

**Roster** — the main client list.
- A form with three fields: an input labeled **Name**, a select labeled **Status** (options: `active`, `lead`, `churned`), and an input labeled **Lifetime Value** (a number). An **Add Client** button adds the client (ignore entries with a blank name or a non-positive lifetime value).
- Below the form, a filter bar with a select labeled **Filter by status** with options: `all`, `active`, `lead`, `churned`. Default is `all`.
- The filtered client list renders each client as a row showing their name, status, and lifetime value formatted as `$N` (whole dollar, no decimals, e.g. `$1200`).
- Each client row has a **Remove** button that permanently deletes that client.
- Below the list, show the total of the currently visible clients as `Total: $N` (same format, sum of filtered rows).

**Stats** — a read-only summary panel derived from ALL clients (ignoring the filter):
- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Active value: $N` (sum of lifetime values for active clients only)
- `Total value: $N` (sum of all clients' lifetime values)

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Seed the app with three clients on first render:
- Acme Corp, active, $5000
- Bright Ideas, lead, $1200
- Old Partner, churned, $800

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
