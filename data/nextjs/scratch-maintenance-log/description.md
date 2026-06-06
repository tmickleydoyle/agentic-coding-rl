# Maintenance Log

A single-page React app for logging home maintenance tasks with priority and status tracking.

## Seed Data

Pre-loaded entries:

| id | title | area | priority | status | date |
|----|-------|------|----------|--------|------|
| 1 | Fix leaky faucet | Kitchen | High | Open | 2024-01-15 |
| 2 | Replace air filter | HVAC | Medium | Completed | 2024-01-20 |
| 3 | Patch ceiling crack | Bedroom | Low | Open | 2024-02-05 |
| 4 | Unclog drain | Bathroom | High | In Progress | 2024-02-10 |
| 5 | Touch up paint | Living Room | Low | Open | 2024-03-01 |
| 6 | Seal window gaps | Living Room | Medium | Open | 2024-03-15 |

## UI Layout

- `<h1>` with text "Maintenance Log"
- Summary stats:
  - `data-testid="open-count"` — "Open: N"
  - `data-testid="in-progress-count"` — "In Progress: N"
  - `data-testid="completed-count"` — "Completed: N"
- Filter controls:
  - Select labeled "Status Filter" with options: All, Open, In Progress, Completed
  - Select labeled "Priority Filter" with options: All, High, Medium, Low
- Log entries list; each entry has `data-testid="log-entry"` and displays:
  - Title in a heading element
  - Area text
  - Priority badge: `data-testid="priority-badge"` with the priority value
  - Status badge: `data-testid="status-badge"` with the status value
  - Date text
  - A status-change select labeled "Change Status" with options: Open, In Progress, Completed — current value is the entry's status
  - A "Delete" button
- Add entry form:
  - Text input labeled "Title"
  - Text input labeled "Area"
  - Select labeled "Priority" with options: High, Medium, Low
  - Date input labeled "Date"
  - "Add Entry" button

## Behaviors

- Changing the "Change Status" select for an entry immediately updates that entry's status and the summary counts.
- Deleting removes the entry.
- Adding appends a new entry with status "Open" and clears the title, area, and date inputs.
- Adding with empty title or empty area does nothing.
- Status Filter and Priority Filter work as AND logic.
- Summary counts always reflect all entries regardless of filters.
