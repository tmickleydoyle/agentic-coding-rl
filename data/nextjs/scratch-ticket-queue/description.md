# Ticket Queue Manager

Build a single-page React app that manages a support ticket queue with priority levels and status tracking.

## Seed Data

Start with these 5 tickets:

```
id: 1, title: "Login page broken", priority: "high", status: "open", submitter: "Alice", created: "2025-01-10"
id: 2, title: "Export CSV feature", priority: "low", status: "open", submitter: "Bob", created: "2025-01-11"
id: 3, title: "Dashboard slow", priority: "medium", status: "in-progress", submitter: "Carol", created: "2025-01-12"
id: 4, title: "Password reset email", priority: "high", status: "resolved", submitter: "Dave", created: "2025-01-13"
id: 5, title: "Mobile nav broken", priority: "medium", status: "open", submitter: "Eve", created: "2025-01-14"
```

## UI Layout

- `<h1>` with text "Ticket Queue"
- Summary stats row
- Filter controls
- Ticket list
- Add ticket form

## Summary Stats

- "Open: X" (data-testid="count-open") — tickets with status "open"
- "In Progress: X" (data-testid="count-in-progress") — tickets with status "in-progress"
- "Resolved: X" (data-testid="count-resolved") — tickets with status "resolved"

## Filter Controls

- Select dropdown (aria-label="Filter by status") with options: "all", "open", "in-progress", "resolved"
- Select dropdown (aria-label="Filter by priority") with options: "all", "high", "medium", "low"
- Filters are independent and combine (AND logic)
- Default: both filters set to "all"

## Ticket List

Each ticket displayed as a row (data-testid="ticket-{id}"):
- Title text
- Priority badge (data-testid="priority-{id}") showing "high", "medium", or "low"
- Status select (aria-label="Status for {title}") with options: "open", "in-progress", "resolved"
  - Changing this select updates the ticket's status immediately
- Submitter name
- Created date as-is (e.g. "2025-01-10")

Tickets are displayed in order: high priority first, then medium, then low. Within same priority, preserve original order (by id).

## Add Ticket Form

Fields:
- Text input (aria-label="Ticket title")
- Select (aria-label="Priority") with options: "high", "medium", "low" (default "medium")
- Text input (aria-label="Submitter name")
- "Add Ticket" button

Behavior:
- On submit: add ticket with status "open" and today's date (use new Date().toISOString().slice(0,10))
- If title or submitter is empty after trim, do nothing
- After adding, clear title and submitter inputs, reset priority to "medium"
- New ticket id = max existing id + 1

## Derived Display

After filtering, show "Showing X tickets" (data-testid="showing-count") based on filtered results.
