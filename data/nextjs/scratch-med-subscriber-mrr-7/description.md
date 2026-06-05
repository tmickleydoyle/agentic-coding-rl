# Build a Subscriber MRR Tracker

Build a complete single-page React application — a subscriber management tool — with **three views** the user navigates between using a top navigation bar: **Subscribers**, **Dashboard**, and **Settings**. The app starts on the **Subscribers** view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Subscribers**, **Dashboard**, **Settings**) switches the active view.

## Seed data

The app should start with the following three subscribers already present:

| Name | Plan | Active |
|------|------|--------|
| Alice Chen | Pro | true |
| Bob Smith | Basic | true |
| Carol White | Enterprise | false |

Plan monthly prices: **Basic = $9**, **Pro = $29**, **Enterprise = $99**.

---

**Subscribers** — the main list view.
- An input labeled **Name** and a `<select>` labeled **Plan** (options: `Basic`, `Pro`, `Enterprise`) plus an **Add subscriber** button adds a new subscriber (default active = true; ignore a blank name).
- Each subscriber row shows the subscriber's name, their plan, and a toggle button. When active the button reads **Deactivate**; when inactive it reads **Activate**.
- Above the list, show the active count and total count as: `Active: N of N`.

**Dashboard** — a read-only summary computed from the subscriber list:
- `Total subscribers: N`
- `Active subscribers: N`
- `Monthly Recurring Revenue: $N` (whole-number dollars, sum of plan prices for **active** subscribers only)
- `Basic subscribers: N`
- `Pro subscribers: N`
- `Enterprise subscribers: N`

**Settings**
- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Hide inactive** checkbox; when checked, inactive subscribers are hidden on the **Subscribers** view (they still count in Dashboard stats).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).