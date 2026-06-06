# Tech Debt Log

Build a single-page React app for logging and tracking technical debt items.

## Seed Data

| id | title                              | area      | severity | effort | status   | created    |
|----|------------------------------------|-----------|----------|--------|----------|------------|
| 1  | Replace deprecated lodash methods  | frontend  | high     | 3      | open     | 2024-02-01 |
| 2  | Add database connection pooling     | backend   | high     | 5      | open     | 2024-02-03 |
| 3  | Remove dead code in auth module     | backend   | low      | 1      | resolved | 2024-02-05 |
| 4  | Upgrade webpack to v5               | frontend  | medium   | 4      | open     | 2024-02-07 |
| 5  | Improve test coverage for API layer | backend   | medium   | 3      | open     | 2024-02-09 |
| 6  | Fix memory leak in event listeners  | frontend  | high     | 2      | resolved | 2024-02-11 |

## Fields

- **title**: string
- **area**: "frontend" | "backend" | "devops"
- **severity**: "low" | "medium" | "high"
- **effort**: number (1-5 scale)
- **status**: "open" | "resolved"
- **created**: string (YYYY-MM-DD)

## Behaviors

### Display
- Heading "Tech Debt Log".
- Render a table with columns: Title, Area, Severity, Effort, Status, Created, Actions.
- Each row has `data-testid="debt-row-{id}"`.
- Severity cells: `data-testid="severity-{id}"`.
- Status cells: `data-testid="status-{id}"`.
- Effort cells: `data-testid="effort-{id}"`.

### Add Item
- Form with: title (text, `data-testid="input-title"`), area (select, `data-testid="select-area"` options frontend/backend/devops), severity (select, `data-testid="select-severity"` options low/medium/high), effort (number 1-5, `data-testid="input-effort"`), created (date, `data-testid="input-created"`).
- Submit button `data-testid="btn-add-debt"` labeled "Add Debt".
- Auto-increments id, status defaults to "open".
- Do not submit if title is empty.

### Resolve Toggle
- Each row has `data-testid="btn-toggle-{id}"` labeled "Resolve" or "Reopen".
- Clicking toggles between "open" and "resolved".

### Filter by Area
- Buttons: "All" (`data-testid="filter-all"`), "Frontend" (`data-testid="filter-frontend"`), "Backend" (`data-testid="filter-backend"`), "DevOps" (`data-testid="filter-devops"`).

### Filter by Status
- Buttons: "Open" (`data-testid="filter-open"`), "Resolved" (`data-testid="filter-resolved-status"`).
- These combine with area filter (both must match, or use whichever is active).
- Actually: status filter and area filter are independent toggles; rows must match both active filters.
- "All" area button clears the area filter; similarly there should be a "All Status" button `data-testid="filter-all-status"` to clear status filter.

### Summary Stats
- `data-testid="stat-total"` — total items.
- `data-testid="stat-open"` — open items.
- `data-testid="stat-avg-effort"` — average effort across all items (one decimal place).

### Delete
- Each row has `data-testid="btn-delete-{id}"`.

## Edge Cases
- Submitting with empty title: no row added.
- Stats always reflect all items ignoring filters.
- New items start as "open".
- Average effort is 0.0 when no items exist.
