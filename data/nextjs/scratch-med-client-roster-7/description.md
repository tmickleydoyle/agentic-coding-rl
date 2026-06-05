# Build a Client Roster app

Build a complete single-page React application — a small client management tool for a consulting business — with **three views** the user navigates between using a top navigation bar: **Clients**, **Summary**, and **Settings**. The app starts on the Clients view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Clients**, **Summary**, **Settings**) switches the active view.

**Clients** — the main client list view.
- A form with:
  - An input labeled **Name** for the client name.
  - A select labeled **Status** with options **active**, **lead**, and **churned**.
  - An input labeled **Lifetime Value** for a dollar amount (numeric).
  - An **Add Client** button that adds the client to the list (ignore entries with a blank name or non-positive lifetime value).
- A filter control: a select labeled **Filter by status** with options **all**, **active**, **lead**, and **churned**. Changing it filters the list below.
- The client list shows each client as a row with their **name**, **status**, and lifetime value formatted as `$N.00` (two decimal places, e.g. `$1200.00`).
- Each client row has a **Remove** button (accessible as `Remove <name>`) that deletes that client.
- When the filter is set to **all**, show all clients; otherwise show only clients matching the selected status.
- Below the list, show the count and total of the currently visible (filtered) clients as two lines:
  - `Visible: N clients`
  - `Visible Total: $N.00`

Seed the app with these three clients on startup (do NOT let the user see a blank list initially):
- Name: **Acme Corp**, Status: **active**, Lifetime Value: **5000**
- Name: **Globex**, Status: **lead**, Lifetime Value: **1200**
- Name: **Initech**, Status: **churned**, Lifetime Value: **800**

**Summary** — a read-only stats dashboard computed from ALL clients (not filtered):
- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Total Lifetime Value: $N.00`
- `Active Value: $N.00` (sum of lifetime values for active clients only)

**Settings** — a simple preferences view.
- A **Toggle theme** button that switches between light and dark mode. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists across view changes.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
