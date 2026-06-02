# Build a Subscriber MRR Tracker

Build a complete single-page React application — a subscriber management tool — with **three views** the user navigates between using a top navigation bar: **Subscribers**, **Dashboard**, and **Settings**. The app starts on the Subscribers view. State is shared across all views and kept in memory (no backend).

Navigation: a nav bar with a button for each view (**Subscribers**, **Dashboard**, **Settings**) switches the active view.

## Seed data

Start the app with these three subscribers already present:
- Name: **Alice**, Plan: **Pro**, Active: **true**
- Name: **Bob**, Plan: **Basic**, Active: **true**
- Name: **Carol**, Plan: **Pro**, Active: **false**

## Plans and prices

There are exactly three plans with fixed monthly prices:
- **Basic** — $9
- **Pro** — $29
- **Enterprise** — $99

## Subscribers view

Shows a list of all subscribers. Above the list, display the total MRR and active count as two lines of text:
- `MRR: $X` where X is the sum of the monthly plan price for every **active** subscriber (whole dollars, no decimals)
- `Active: N` where N is the count of active subscribers

Below those summary lines, show an **Add subscriber** form with:
- An input labeled **Name**
- A `<select>` labeled **Plan** with options **Basic**, **Pro**, **Enterprise**
- An **Add** button that adds the subscriber as active (ignore a blank name)

Each subscriber row shows:
- The subscriber's name
- Their plan name
- Their status: the word **Active** if active, or **Inactive** if not
- A toggle button labeled **Deactivate** if currently active, or **Activate** if currently inactive
- A **Remove** button that permanently deletes the subscriber

## Dashboard view

A read-only summary (derived from subscriber data) showing these exact text lines:
- `Total subscribers: N`
- `Active subscribers: N`
- `Inactive subscribers: N`
- `MRR: $X` (same calculation as above — sum of plan prices for active subscribers only)
- `Basic subscribers: N`
- `Pro subscribers: N`
- `Enterprise subscribers: N`

## Settings view

- A **Toggle theme** button switches the theme between **light** and **dark**. The current theme is applied as a `data-theme` attribute (`"light"` or `"dark"`) on a root element, and it persists as the user navigates between views.

Implement the root component as the default export of `app/page.tsx`. Use only `react` and `react-dom` — no other libraries, no Next.js APIs (routing is in-app state, not the file router).