# Build a Client Roster app

Build a complete single-page React application — a client roster tool for a small agency — with **three views** the user navigates between using a top navigation bar: **Roster**, **Stats**, and **Settings**. The app starts on the Roster view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Roster**, **Stats**, **Settings**) switches the active view.

## Seed data

The app starts with these four clients already loaded:

| Name | Status | Lifetime Value |
|---|---|---|
| Acme Corp | active | 12000 |
| Bright Labs | lead | 0 |
| Cloud Nine | churned | 4500 |
| Delta Works | active | 8750 |

## Roster view

- Shows a list of all clients (after any active filter).
- An input labeled **Client name**, an input labeled **Lifetime value**, a dropdown labeled **Status** (options: `active`, `lead`, `churned`), and an **Add client** button add a new client. Ignore the submission if the name is blank or the lifetime value is not a valid non-negative number.
- Each client row shows the client's name, its status (`active`, `lead`, or `churned`), and its lifetime value formatted as a dollar amount with two decimal places, e.g. `$12000.00`.
- A **Filter by status** dropdown (labeled **Filter by status**) with options **All**, **active**, **lead**, **churned** filters the displayed list. When a filter is active, only matching clients are shown, but ALL clients still count in Stats.
- Each client row has a **Remove** button (labeled `Remove <name>`) that permanently deletes that client.

## Stats view

A read-only summary computed from ALL clients (ignoring any filter). Shows these lines of text:

- `Total clients: N`
- `Active: N`
- `Leads: N`
- `Churned: N`
- `Total value: $N` where N is the sum of all lifetime values formatted with two decimal places, e.g. `Total value: $25250.00`
- `Active value: $N` where N is the sum of lifetime values for active clients only, formatted with two decimal places

## Settings view

- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).
