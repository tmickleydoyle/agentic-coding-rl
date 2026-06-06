# Bug Tracker

A single-page bug tracking application.

## Seed Data

Three bugs pre-loaded:
1. id:1, title:"Login page crashes on Safari", status:"open", priority:"high", assignee:"Alice"
2. id:2, title:"Dashboard slow to load", status:"in-progress", priority:"medium", assignee:"Bob"
3. id:3, title:"Export button missing", status:"closed", priority:"low", assignee:"Alice"

## Fields and Layout

- Heading: "Bug Tracker"
- Summary counts (data-testid):
  - `count-open`: number of bugs with status "open"
  - `count-in-progress`: number of bugs with status "in-progress"
  - `count-closed`: number of bugs with status "closed"

## Add Bug Form

Fields:
- Text input, aria-label "Title" — bug title
- Select, aria-label "Priority" — options: low, medium, high (default: medium)
- Text input, aria-label "Assignee" — person name

Button "Add Bug": adds a new bug with status "open" and the given title/priority/assignee. Clears fields after add. Does nothing if title is empty.

## Bug List

Each bug rendered as a list item with:
- `data-testid="bug-item"` on the container
- `data-testid="bug-title"` showing the title
- `data-testid="bug-status"` showing the current status
- `data-testid="bug-priority"` showing the priority
- `data-testid="bug-assignee"` showing the assignee

## Status Cycling

Each bug has a button "Next Status" that cycles: open -> in-progress -> closed -> open.

## Filter

A select with aria-label "Filter by status" with options: All, open, in-progress, closed.
Selecting a value shows only bugs with that status (or all). Default: "All".

## Delete

Each bug has a "Delete" button that removes it from the list.

## Edge Cases

- Adding a bug with empty title does nothing.
- Filter updates counts to reflect only what is shown (NO — counts always show global totals regardless of filter).
- Priority dropdown defaults to "medium" when adding a new bug.
