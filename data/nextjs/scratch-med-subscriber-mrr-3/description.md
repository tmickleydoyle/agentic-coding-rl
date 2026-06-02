# Build a Subscriber MRR Tracker

Build a complete single-page React application — a subscriber management tool — with **three views** the user navigates between using a top navigation bar: **Subscribers**, **Dashboard**, and **Settings**. The app starts on the Subscribers view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Subscribers**, **Dashboard**, **Settings**) switches the active view.

## Seed Data

The app must start with these three subscribers already in the list:

| Name | Plan | Active |
|------|------|--------|
| Acme Corp | Pro | true |
| Globex | Starter | true |
| Initech | Enterprise | false |

## Plans and Prices

The three available plans and their monthly prices are:
- **Starter** — $29/mo
- **Pro** — $99/mo
- **Enterprise** — $299/mo

## Subscribers View

- Shows a list of all subscribers. Each subscriber row displays:
  - Their **name**
  - Their **plan** name
  - Their **monthly price** formatted as `$29/mo`, `$99/mo`, or `$299/mo`
  - An **Active** / **Inactive** toggle button that flips the subscriber's active status
  - A **Remove** button that deletes that subscriber
- Below the list, a form to add a new subscriber:
  - An input labeled **Name**
  - A select/dropdown labeled **Plan** with options **Starter**, **Pro**, **Enterprise**
  - An **Add Subscriber** button — clicking it adds the subscriber as **active** and clears the inputs (ignore a blank name)
- At the top of the view, show a summary line: `Active: N | MRR: $X` where N is the count of active subscribers and X is the total monthly recurring revenue from active subscribers only, formatted with no decimal places (e.g. `Active: 2 | MRR: $128`).

## Dashboard View

A read-only summary panel showing:
- `Total subscribers: N`
- `Active subscribers: N`
- `Inactive subscribers: N`
- `MRR: $N` (sum of plan prices for active subscribers only, no decimal)
- `Starter subscribers: N` (count of ALL subscribers on Starter regardless of active)
- `Pro subscribers: N`
- `Enterprise subscribers: N`

## Settings View

- A **Toggle theme** button that switches between light and dark. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element and persists as the user navigates.
- A **Filter inactive** checkbox. When checked, the Subscribers view hides inactive subscribers (they still count in Dashboard stats).

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs.