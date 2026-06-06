# College Application Tracker

A single-page React app to track college applications, deadlines, and essay status.

## Seed Data

Start with these 4 applications pre-loaded:

| School | Deadline | Type | Essay Status | Decision |
|--------|----------|------|--------------|----------|
| MIT | 2024-01-01 | Early Action | Done | Pending |
| Stanford | 2024-01-05 | Regular Decision | In Progress | Pending |
| Harvard | 2023-11-01 | Early Decision | Done | Accepted |
| UCLA | 2024-11-30 | Regular Decision | Not Started | Pending |

## Fields

Each application has:
- **school** (string): School name
- **deadline** (string): Date (YYYY-MM-DD)
- **type** (string): One of "Early Action", "Early Decision", "Regular Decision"
- **essayStatus** (string): One of "Not Started", "In Progress", "Done"
- **decision** (string): One of "Pending", "Accepted", "Rejected", "Waitlisted"

## Layout

- Page heading: "College Application Tracker"
- Summary counts
- Add form
- Application list

## Add Form

- Text input labeled "School" (data-testid="input-school")
- Date input labeled "Deadline" (data-testid="input-deadline")
- Select labeled "Type" with options: Early Action, Early Decision, Regular Decision (data-testid="select-type")
- Select labeled "Essay Status" with options: Not Started, In Progress, Done (data-testid="select-essay")
- Select labeled "Decision" with options: Pending, Accepted, Rejected, Waitlisted (data-testid="select-decision")
- Submit button "Add Application" (data-testid="btn-add")

Validation: school is required. Show error with data-testid="error-message" if empty. Clear form on success.

## Application List

Each application rendered with:
- data-testid="app-item" on the container
- data-testid="app-school" showing school name
- data-testid="app-deadline" showing deadline
- data-testid="app-type" showing application type
- data-testid="app-essay" showing essay status
- data-testid="app-decision" showing decision
- "Delete" button with data-testid="btn-delete"

## Summary Counts

- data-testid="count-total": total applications
- data-testid="count-accepted": number with decision "Accepted"
- data-testid="count-pending": number with decision "Pending"

## Filter by Decision

Buttons to filter:
- "All" (data-testid="filter-all") — default
- "Pending" (data-testid="filter-Pending")
- "Accepted" (data-testid="filter-Accepted")
- "Rejected" (data-testid="filter-Rejected")
- "Waitlisted" (data-testid="filter-Waitlisted")

## Edge Cases

- Empty school shows error
- Delete removes targeted application and updates counts
- Filter shows correct subset; All restores full list
