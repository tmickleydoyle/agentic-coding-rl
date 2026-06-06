# Subscription Tracker

Build a subscription tracker where users manage recurring services, filter by billing cycle, and see spending summaries.

## Seed Data

Pre-load these subscriptions:

| Name       | Cost  | Cycle   | Category    |
|------------|-------|---------|-------------|
| Netflix    | 15.99 | monthly | Entertainment|
| Spotify    | 9.99  | monthly | Entertainment|
| AWS        | 50.00 | monthly | Productivity |
| GitHub Pro | 4.00  | monthly | Productivity |
| NYT        | 17.00 | yearly  | News         |
| iCloud     | 2.99  | monthly | Storage      |

## Fields

- **Filter by cycle**: buttons or select to filter shown subscriptions — "All", "monthly", "yearly" (aria-label="Filter by cycle", or role="group" with individual toggle buttons)
- **Filter by category**: select dropdown (aria-label="Filter by category") with "All" plus each unique category
- **Subscription list**: each item has data-testid="subscription-row"
  - Shows name, cost (`$X.XX`), cycle, category
  - **Cancel** button to remove the subscription
- **Add Subscription form**:
  - Text input (aria-label="Subscription Name")
  - Number input (aria-label="Cost")
  - Select for cycle (aria-label="Billing Cycle") with options "monthly" and "yearly"
  - Text input (aria-label="Category")
  - **Add Subscription** button — disabled if name is empty
- **Summary section** (always reflects the full unfiltered list):
  - Monthly Total: sum of monthly subscriptions' costs (data-testid="monthly-total")
  - Yearly Total: sum of yearly subscriptions' costs + monthly costs * 12 (data-testid="yearly-total")
  - Subscription Count: total number of subscriptions (data-testid="subscription-count")

## Behaviors

- Filters affect displayed rows only; summaries always reflect ALL subscriptions.
- Applying a cycle filter shows only subscriptions of that cycle ("All" shows all).
- Applying a category filter shows only subscriptions in that category ("All" shows all).
- Both filters apply simultaneously (AND logic).
- Adding a subscription appends to full list, recalculates summary, and may appear in filtered view if it matches.
- Canceling a subscription removes it from full list; summary recalculates.
- After adding, form inputs reset to defaults (name="", cost="", cycle="monthly", category="").

## Edge Cases

- Yearly Total = (sum of monthly costs * 12) + (sum of yearly costs).
- If all subscriptions cancelled, all totals = $0.00, count = 0.
- Adding a subscription with empty name is prevented.
