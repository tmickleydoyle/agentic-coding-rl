# Subscription Log

A single-page app to track your software subscriptions.

## Seed Data (5 subscriptions)

| Name | Cost ($/mo) | Renewal Date | Category | Status |
|------|-------------|--------------|----------|--------|
| GitHub Pro | 4.00 | 2024-02-15 | Development | active |
| Figma | 15.00 | 2024-03-01 | Design | active |
| Linear | 8.00 | 2024-01-20 | Productivity | paused |
| Vercel Pro | 20.00 | 2024-02-28 | Hosting | active |
| Notion | 10.00 | 2024-04-05 | Productivity | cancelled |

## Fields

Each subscription has:
- `id`: unique number
- `name`: string
- `costPerMonth`: number (USD)
- `renewalDate`: string (YYYY-MM-DD)
- `category`: string
- `status`: "active" | "paused" | "cancelled"

## UI Layout

- Page heading: "Subscription Log"
- Summary bar showing:
  - Total monthly cost (sum of active subscriptions only), displayed as "$X.XX/mo" in element with data-testid="total-cost"
  - Count of active subscriptions in element with data-testid="active-count"
- Status filter buttons: "All", "Active", "Paused", "Cancelled" — clicking filters the list
- Subscription list: each item in a div with data-testid="subscription-item"
  - Shows name, cost formatted as "$X.XX/mo", renewal date, category, and a status badge
  - Status badge: data-testid="status-badge" with text matching the status value
- Add Subscription form with fields:
  - Text input, label "Name", data-testid="input-name"
  - Number input, label "Cost ($/mo)", data-testid="input-cost"
  - Date input, label "Renewal Date", data-testid="input-renewal-date"
  - Text input, label "Category", data-testid="input-category"
  - Select, label "Status", data-testid="input-status" with options: active, paused, cancelled
  - Submit button with text "Add Subscription"
- Each subscription item has a "Delete" button (data-testid="delete-btn") that removes it
- Each subscription item has a "Toggle Status" button that cycles: active -> paused -> cancelled -> active

## Behaviors

- Filter buttons update the displayed list without removing items
- "All" filter shows all subscriptions regardless of status
- Total monthly cost sums only active subscriptions' costPerMonth
- Active count reflects current number of active subscriptions
- Adding a subscription appends it to the list and clears the form
- Deleting removes the subscription from all views
- Toggle Status cycles the status of a subscription
- Form validation: name and cost must be non-empty to submit (cost > 0)

## Edge Cases

- If no subscriptions match the current filter, show a div with data-testid="empty-message"
- Cost display always shows 2 decimal places
- Cancelled subscriptions do NOT count toward total monthly cost
- Paused subscriptions do NOT count toward total monthly cost
