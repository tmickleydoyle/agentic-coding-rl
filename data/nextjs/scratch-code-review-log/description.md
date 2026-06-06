# Code Review Log

Build a single-page React app for tracking code review sessions and their outcomes.

## Seed Data

The app starts with these review entries:

| id | reviewer    | pr_title                     | status    | comments | date       |
|----|-------------|------------------------------|-----------|----------|------------|
| 1  | alice        | Add user authentication      | approved  | 3        | 2024-01-10 |
| 2  | bob          | Fix null pointer exception   | rejected  | 7        | 2024-01-11 |
| 3  | carol        | Refactor database layer      | pending   | 2        | 2024-01-12 |
| 4  | alice        | Add caching middleware       | approved  | 1        | 2024-01-13 |
| 5  | dave         | Update API endpoints         | pending   | 4        | 2024-01-14 |

## Fields

- **reviewer**: string — name of reviewer
- **pr_title**: string — title of the PR being reviewed
- **status**: "approved" | "rejected" | "pending"
- **comments**: number — count of review comments
- **date**: string — ISO date (YYYY-MM-DD)

## Behaviors

### Display
- Show a heading "Code Review Log".
- Render a table with columns: Reviewer, PR Title, Status, Comments, Date.
- Each row has `data-testid="review-row-{id}"`.
- Status cells display colored badges: approved=green, rejected=red, pending=yellow. Each badge has `data-testid="status-badge-{id}"`.
- Comment count cell has `data-testid="comments-{id}"`.

### Add Review
- A form with fields: reviewer (text input `data-testid="input-reviewer"`), pr_title (text input `data-testid="input-pr-title"`), status (select `data-testid="select-status"` with options approved/rejected/pending), comments (number input `data-testid="input-comments"`), date (date input `data-testid="input-date"`).
- Submit button `data-testid="btn-add-review"` labeled "Add Review".
- On submit, append new entry with auto-incremented id, clear the form.
- Do not submit if reviewer or pr_title is empty.

### Filter by Status
- Three filter buttons: "All" (`data-testid="filter-all"`), "Approved" (`data-testid="filter-approved"`), "Rejected" (`data-testid="filter-rejected"`), "Pending" (`data-testid="filter-pending"`).
- Clicking a filter shows only matching rows (or all rows for "All").

### Summary Stats
- Display total count: `data-testid="stat-total"` showing total reviews.
- Display approved count: `data-testid="stat-approved"`.
- Display average comments: `data-testid="stat-avg-comments"` (one decimal place, e.g. "3.4").

### Delete
- Each row has a delete button `data-testid="btn-delete-{id}"`.
- Clicking removes that review from the list.

## Edge Cases
- Submitting with empty reviewer or pr_title: no new row added.
- After filtering, stats reflect ALL entries (not just filtered).
- Deleting all entries shows an empty table body.
- Comments input defaults to 0 if left blank.
