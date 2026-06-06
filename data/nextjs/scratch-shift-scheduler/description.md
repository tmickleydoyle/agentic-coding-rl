# Shift Scheduler

Build a single-page shift scheduling app where managers can assign employees to shifts for a work week.

## Seed Data

Employees:
```
id: 1, name: "Alice Johnson"
id: 2, name: "Bob Martinez"
id: 3, name: "Carol White"
id: 4, name: "David Lee"
```

Days of week (always in this order): Monday, Tuesday, Wednesday, Thursday, Friday

Shift slots per day: Morning (6am-2pm), Afternoon (2pm-10pm), Night (10pm-6am)

Initial schedule: all slots empty (no assignments).

## UI Layout

- Page heading: "Shift Scheduler"
- A week schedule table with:
  - Columns: Day, Morning, Afternoon, Night
  - One row per day (Monday through Friday)
  - Each cell (day+shift) shows the assigned employee name or "Unassigned"
- An assignment form below the table with:
  - Day select (aria-label: "Day") — options: Monday, Tuesday, Wednesday, Thursday, Friday
  - Shift select (aria-label: "Shift") — options: Morning, Afternoon, Night
  - Employee select (aria-label: "Employee") — options: (blank/placeholder), Alice Johnson, Bob Martinez, Carol White, David Lee
  - "Assign" button
- A summary section showing total shifts assigned per employee (only employees with at least 1 shift shown)
- "Clear All" button that resets all assignments

## Interactions

- Selecting Day, Shift, Employee and clicking "Assign" sets that slot.
- Assigning to an already-filled slot replaces the previous assignment.
- Assigning with no employee selected (blank option) does nothing.
- The slot display updates immediately.
- Employee summary updates after each assignment.
- "Clear All" resets every slot to empty.

## data-testid Attributes

- `shift-cell-{day}-{shift}` — each schedule cell, e.g. `shift-cell-Monday-Morning`
- `summary-row` — each row in the employee summary
- `clear-all` — the clear all button
- `assign-button` — the assign button
