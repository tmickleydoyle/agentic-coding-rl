# Build a Client Roster app

Build a complete single-page React application — a client roster tool for a small agency — with **three views** the user navigates between using a top navigation bar: **Roster**, **Stats**, and **Settings**. The app starts on the Roster view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roster**, **Stats**, **Settings**) switches the active view.

**Roster** — the main client list.
- An input labeled **Client name** and a select labeled **Status** (options: `active`, `lead`, `churned`) and an input labeled **Lifetime value** plus an **Add client** button adds a new client (ignore if name is blank or lifetime value is not a positive number).
- Each client row shows the client's name, status badge, and lifetime value formatted as `$N.NN` (two decimal places, e.g. `$1200.00`).
- A filter control labeled **Filter by status** with options `all`, `active`, `lead`, `churned` filters the visible list (default `all`). Only the matching rows are shown; all clients still count in Stats.
- Each client has a **Remove** button that permanently deletes that client.
- Below the list show the count of currently visible clients as `Showing: N clients`.

**Stats** — a read-only summary derived from ALL clients (ignoring the filter):
- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Total value: $N.NN` (sum of all lifetime values, two decimal places)
- `Active value: $N.NN` (sum of lifetime values for active clients only)

**Settings**
- A **Toggle theme** button that switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root wrapper element and persists across view navigation.

Seed the app with these three clients already present when it loads:
- Name: `Acme Corp`, Status: `active`, Lifetime value: `4200`
- Name: `Globex`, Status: `lead`, Lifetime value: `850`
- Name: `Initech`, Status: `churned`, Lifetime value: `3100`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
