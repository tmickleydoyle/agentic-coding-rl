# Trial Tracker

A single-page app to track free trial sign-ups for software tools.

## Seed Data (5 trials)

| Service | Start Date | End Date | Notes | Status |
|---------|-----------|----------|-------|--------|
| Datadog | 2024-01-01 | 2024-01-14 | Monitoring evaluation | expired |
| Postman | 2024-01-10 | 2024-02-10 | API testing team trial | active |
| Sentry | 2024-01-15 | 2024-02-15 | Error tracking | active |
| PlanetScale | 2023-12-01 | 2023-12-15 | DB scaling test | expired |
| Retool | 2024-01-20 | 2024-02-20 | Internal tools | active |

## Fields

Each trial has:
- `id`: unique number
- `service`: string
- `startDate`: string (YYYY-MM-DD)
- `endDate`: string (YYYY-MM-DD)
- `notes`: string
- `status`: "active" | "expired" | "converted"

## UI Layout

- Page heading: "Trial Tracker"
- Summary stats:
  - Count of active trials in element with data-testid="active-trials-count"
  - Count of expired trials in element with data-testid="expired-trials-count"
  - Count of converted trials in element with data-testid="converted-trials-count"
- Filter buttons for status: "All", "Active", "Expired", "Converted"
- Trial list: each item in a div with data-testid="trial-item"
  - Shows service name, start date, end date, notes
  - Status badge with data-testid="trial-status-badge" showing the status
- Add Trial form:
  - Text input, label "Service", data-testid="input-service"
  - Date input, label "Start Date", data-testid="input-start-date"
  - Date input, label "End Date", data-testid="input-end-date"
  - Textarea, label "Notes", data-testid="input-notes"
  - Select, label "Status", data-testid="input-status" options: active, expired, converted
  - Submit button: "Add Trial"
- Each trial item has:
  - "Delete" button with data-testid="delete-trial-btn" to remove it
  - "Mark Converted" button with data-testid="convert-btn" that sets status to "converted"

## Behaviors

- Filter buttons filter the displayed list by status
- Summary counts always reflect the full dataset (not filtered view)
- Adding a trial appends to the list and clears the form
- Deleting removes the trial entirely
- "Mark Converted" changes status to "converted" regardless of current status
- If filter results are empty, show div with data-testid="empty-message"

## Edge Cases

- "Mark Converted" button should still appear even on expired trials
- Service name must be non-empty to submit the form
- Dates are displayed as-is (YYYY-MM-DD format)
