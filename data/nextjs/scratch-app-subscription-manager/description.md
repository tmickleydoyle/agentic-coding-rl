# Subscription Manager

A single-page React app to track recurring subscriptions, billing dates, and total monthly cost.

## Routes / Pages

- **Home** (`home`): Dashboard — total subscriptions, active count, total monthly cost (sum of all active subscription monthlyCost values).
- **Subscriptions** (`subscriptions`): List all subscriptions. Add a subscription: name, monthlyCost (number), billingDay (1-31), category (string), status (`active`|`paused`). Toggle status between active/paused. Delete subscription.
- **Calendar** (`calendar`): Show subscriptions due this month, grouped by billingDay (ascending). Each item shows name and billingDay.
- **Stats** (`stats`): Show total monthly cost, count by category (each category shown with count and subtotal cost).

## Seed Data

- `{ id: "s1", name: "Netflix", monthlyCost: 15.99, billingDay: 1, category: "Entertainment", status: "active" }`
- `{ id: "s2", name: "Spotify", monthlyCost: 9.99, billingDay: 15, category: "Entertainment", status: "active" }`
- `{ id: "s3", name: "GitHub", monthlyCost: 4, billingDay: 20, category: "Dev Tools", status: "paused" }`

## Behaviors

- Total monthly cost = sum of monthlyCost for active subscriptions only.
- Calendar shows all subscriptions (active and paused) sorted by billingDay.
- Stats shows categories: for each unique category, display count of subscriptions and sum of monthlyCost (all statuses included).
- Adding a subscription requires name (non-empty), monthlyCost > 0, billingDay 1-31, category non-empty.
- NavBar: Home, Subscriptions, Calendar, Stats. Active route has `data-active="true"`.

## API Routes

`/api/subscriptions` — GET all; POST create `{ name, monthlyCost, billingDay, category, status }`; PATCH `?id=` toggles status; DELETE `?id=`.

## Data-testids

- `nav-home`, `nav-subscriptions`, `nav-calendar`, `nav-stats`
- `dashboard-total-count`, `dashboard-active-count`, `dashboard-monthly-cost`
- `sub-list`, `sub-item`, `sub-add-form`, `sub-name-input`, `sub-cost-input`, `sub-day-input`, `sub-category-input`, `sub-status-select`, `sub-submit`, `sub-toggle`, `sub-delete`
- `calendar-list`, `calendar-item`
- `stats-total-cost`, `stats-category-list`, `stats-category-item`
