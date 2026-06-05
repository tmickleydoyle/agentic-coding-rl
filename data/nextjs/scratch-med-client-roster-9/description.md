# Build a Client Roster app

Build a complete single-page React application — a client roster tool for a small agency — with **three views** the user navigates between using a top navigation bar: **Roster**, **Summary**, and **Settings**. The app starts on the Roster view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roster**, **Summary**, **Settings**) switches the active view.

**Roster** — the main client list.
- A form with three fields:
  - An input labeled **Client name**
  - A select labeled **Status** with options: `active`, `lead`, `churned`
  - An input labeled **Lifetime value** (a non-negative number)
- An **Add client** button adds the client to the list (ignore if Client name is blank or Lifetime value is not a valid non-negative number).
- Each client row shows the client's name, status, and lifetime value formatted as `$N` (whole dollars, no decimals, e.g. `$1200`).
- Each row has a **Remove** button (accessible as `Remove <name>`) that deletes the client.
- A filter control: a set of buttons labeled **All**, **active**, **lead**, **churned** that filter the visible list. The active filter button has `aria-pressed="true"`; all others have `aria-pressed="false"`. The default filter is **All**.
- When a filter is applied, only clients matching that status are shown. The count of visible clients is shown as `Showing: N clients`.

**Summary** — a read-only dashboard derived from ALL clients (not just the filtered view):
- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Total value: $N` (sum of all lifetime values, formatted as whole dollars)
- `Active value: $N` (sum of lifetime values for active clients only)

**Settings**
- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates between views.

Seed the app with these three clients already present on first load:
- Name: `Acme Corp`, Status: `active`, Lifetime value: `5000`
- Name: `Globex`, Status: `lead`, Lifetime value: `0`
- Name: `Initech`, Status: `churned`, Lifetime value: `3200`

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
