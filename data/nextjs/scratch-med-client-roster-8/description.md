# Build a Client Roster app

Build a complete single-page React application — a client roster tool for a small agency — with **three views** navigated via a top nav bar: **Clients**, **Summary**, and **Settings**. The app starts on the **Clients** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Clients**, **Summary**, **Settings**) switches the active view.

**Clients** — the main list of clients.
- A form with an input labeled **Name**, a select labeled **Status** (options: `active`, `lead`, `churned`), and an input labeled **Lifetime Value** (a non-negative number).
- An **Add Client** button adds the client to the list (ignore entries with a blank name or a negative/non-numeric lifetime value).
- Below the form, show three filter buttons: **All**, **Active**, **Lead**, **Churned**. Only one is active at a time; the app starts with **All** selected.
- Display the filtered list of clients. Each row shows the client's name, their status (one of `active`, `lead`, `churned`), and their lifetime value formatted as a dollar amount with two decimal places, e.g. `$1200.00`.
- Each row has a **Delete** button (labeled `Delete <name>`, e.g. `Delete Acme`) that removes that client.
- Below the list show a line: `Showing: N clients` where N is the count of currently visible (filtered) clients.

Seed the app with three initial clients:
- Name: `Acme Corp`, Status: `active`, Lifetime Value: `5000`
- Name: `Globex`, Status: `lead`, Lifetime Value: `0`
- Name: `Initech`, Status: `churned`, Lifetime Value: `3200`

**Summary** — a read-only stats panel computed from ALL clients (not the filtered view):
- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Total value: $N` formatted with two decimal places, e.g. `Total value: $8200.00`
- `Active value: $N` formatted with two decimal places — the sum of lifetime values for active clients only, e.g. `Active value: $5000.00`

**Settings** — a single control:
- A **Toggle theme** button that switches between `light` and `dark`. The current theme is stored as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
