# Leave Tracker

Build a single-page employee leave tracking app where HR can log, view, and manage leave requests.

## Seed Data

Start with these 4 leave requests:

```
id: 1, employee: "Alice Johnson", type: "Vacation",   startDate: "2024-07-01", endDate: "2024-07-05", status: "Approved"
id: 2, employee: "Bob Martinez",  type: "Sick Leave", startDate: "2024-06-10", endDate: "2024-06-11", status: "Approved"
id: 3, employee: "Carol White",   type: "Vacation",   startDate: "2024-08-12", endDate: "2024-08-16", status: "Pending"
id: 4, employee: "David Lee",     type: "Personal",   startDate: "2024-07-20", endDate: "2024-07-20", status: "Rejected"
```

## UI Layout

- Page heading: "Leave Tracker"
- Status filter tabs/buttons: "All", "Pending", "Approved", "Rejected" — clicking filters the list
- Leave request list showing each request as a row/card
- Each row shows: employee name, leave type, start date, end date, status, and action buttons
- Summary stats at top: total requests, pending count, approved count
- "Add Leave Request" button that shows/hides an add form

## Add Leave Request Form

Fields:
- Employee name input (aria-label: "Employee Name")
- Leave Type select (aria-label: "Leave Type") — options: Vacation, Sick Leave, Personal
- Start Date input type="date" (aria-label: "Start Date")
- End Date input type="date" (aria-label: "End Date")

Buttons: "Submit Request" and "Cancel"

Validation: all fields required; end date must be >= start date. If invalid, do not add.

## Per-Request Actions

Each leave request row has:
- "Approve" button (only shown when status is Pending) — sets status to Approved
- "Reject" button (only shown when status is Pending) — sets status to Rejected
- "Delete" button — removes the request from the list

## data-testid Attributes

- `leave-row` — each leave request row
- `leave-employee` — employee name in each row
- `leave-type` — leave type in each row
- `leave-status` — status in each row
- `leave-start` — start date in each row
- `leave-end` — end date in each row
- `stat-total` — total requests count
- `stat-pending` — pending count
- `stat-approved` — approved count
- `add-form` — the add leave request form
