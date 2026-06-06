# Milestone Tracker

Build a single-page milestone tracker application in React.

## Seed Data

Start with these 4 milestones pre-loaded:

```
id: 1, title: "Learn TypeScript", targetDate: "2024-03-31", category: "learning", completed: true, notes: "Finished the complete course"
id: 2, title: "Run a 5K", targetDate: "2024-06-15", category: "fitness", completed: true, notes: "Did it in under 30 minutes"
id: 3, title: "Read 12 books", targetDate: "2024-12-31", category: "personal", completed: false, notes: "Currently on book 8"
id: 4, title: "Launch side project", targetDate: "2025-02-28", category: "career", completed: false, notes: "MVP in progress"
```

## Fields

Each milestone has:
- `id` (number, auto-increment)
- `title` (string, required)
- `targetDate` (string, YYYY-MM-DD format, required)
- `category` (string, one of: "personal", "career", "learning", "fitness", "other")
- `completed` (boolean, default false)
- `notes` (string, optional)

## UI Layout

- Page heading: "Milestone Tracker"
- Stats bar showing completed count and total count
- List of milestone cards
- Each card shows: title, targetDate, category badge, notes, completed status
- An "Add Milestone" form
- A status filter: "All", "Completed", "In Progress"

## Behaviors

1. **Display**: All seed milestones shown on load. Each card has `data-testid="milestone-card"`.
2. **Add Milestone**: Form with labeled inputs. "Add Milestone" button adds and clears form. New milestones default to not completed.
3. **Validation**: If title or targetDate is empty, show `data-testid="form-error"` with "Title and target date are required". Do not add milestone.
4. **Toggle complete**: Each card has a checkbox (`data-testid="complete-checkbox"`) that toggles the `completed` state.
5. **Completed styling**: Completed milestone cards have `data-testid="milestone-card"` and additionally the title element has `data-testid="completed-title"` when completed.
6. **Stats**: `data-testid="stats"` shows "X / Y completed" where X is completed count and Y is total (unfiltered).
7. **Filter**: Buttons or select with `data-testid="filter-all"`, `data-testid="filter-completed"`, `data-testid="filter-progress"` to filter the list.
8. **Delete**: Each card has "Delete" button with `data-testid="delete-btn"`.
9. **Empty state**: `data-testid="empty-state"` with "No milestones found" when filtered list is empty.

## Edge Cases

- Stats always reflect full unfiltered counts even when a filter is active.
- Toggling complete on a filtered view updates stats immediately.
- After deleting all milestones the empty state appears.
- After failed validation, inputs retain their values.
