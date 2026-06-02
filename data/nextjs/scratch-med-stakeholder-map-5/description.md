# Build a Stakeholder Map app

Build a complete single-page React application — a stakeholder management tool — with **three views** the user navigates between using a top navigation bar: **Stakeholders**, **Summary**, and **Settings**. The app starts on the **Stakeholders** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Stakeholders**, **Summary**, **Settings**) switches the active view.

## Seed data

The app starts with these three stakeholders already loaded:
- Name: `Alice`, Influence: `high`, Supportive: true
- Name: `Bob`, Influence: `med`, Supportive: false
- Name: `Carol`, Influence: `low`, Supportive: true

## Stakeholders view

This is the main list view.

- An input labeled **Name** and a dropdown labeled **Influence** (options: `high`, `med`, `low`) plus an **Add stakeholder** button adds a new stakeholder. New stakeholders default to **not supportive**. Ignore a blank name.
- Each stakeholder row shows their name, their influence level, and a **Toggle support** button that flips their supportive status between `Supportive` and `Not supportive`. The current status label (`Supportive` or `Not supportive`) is visible in the row.
- Each stakeholder row has a **Remove** button that deletes that stakeholder.
- A dropdown labeled **Filter by influence** with options `all`, `high`, `med`, `low` filters the displayed list. The filter affects only what is shown — it does not delete rows.
- The heading above the list reads **Stakeholders** and a live count of currently-displayed stakeholders appears as `Showing: N`.

## Summary view

A read-only derived stats panel. Shows (as visible text lines):
- `Total: N` — total number of stakeholders
- `High: N` — count with influence = high
- `Med: N` — count with influence = med
- `Low: N` — count with influence = low
- `Supportive: N` — count where supportive is true
- `Not supportive: N` — count where supportive is false
- `Support rate: P%` — supportive ÷ total as a whole-number percent (0% when total is 0)

## Settings view

- A **Toggle theme** button switches the theme between `light` and `dark`. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.
