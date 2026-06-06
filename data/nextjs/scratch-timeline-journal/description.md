# Timeline Journal

Build a single-page timeline journal application in React.

## Seed Data

Start with these 4 entries pre-loaded:

```
id: 1, title: "Started new job", date: "2024-01-15", category: "career", content: "First day at the new company. Everyone was welcoming."
id: 2, title: "Adopted a dog", date: "2024-03-02", category: "personal", content: "Brought home a golden retriever puppy named Biscuit."
id: 3, title: "Completed marathon", date: "2024-05-19", category: "health", content: "Finished in 4 hours 12 minutes. Couldn't believe it."
id: 4, title: "Moved to new apartment", date: "2024-09-01", category: "personal", content: "Finally have my own space in a great neighborhood."
```

## Fields

Each entry has:
- `id` (number, auto-increment)
- `title` (string, required)
- `date` (string, YYYY-MM-DD format, required)
- `category` (string, one of: "personal", "career", "health", "travel", "other")
- `content` (string, required)

## UI Layout

- Page heading: "Timeline Journal"
- Vertical timeline showing all entries sorted by date descending (newest first)
- Each entry card shows: title, date, category badge, content
- An "Add Entry" form below
- A category filter dropdown

## Behaviors

1. **Display**: Seed entries shown on load, sorted newest-first. Each entry has `data-testid="entry-card"`.
2. **Sort**: Entries always display newest date first regardless of insertion order.
3. **Add Entry**: Form with labeled inputs for title, date, category (select), content. "Add Entry" button appends entry and clears form.
4. **Validation**: If title, date, or content is empty, show `data-testid="form-error"` with "Title, date, and content are required". Do not add entry.
5. **Category badge**: Each card shows category with `data-testid="category-badge"`.
6. **Filter**: A `<select>` with `data-testid="category-filter"` filters entries. Default "All Categories" shows all.
7. **Entry count**: `data-testid="entry-count"` shows "X entries".
8. **Delete**: Each card has "Delete" button with `data-testid="delete-btn"`.
9. **Empty state**: `data-testid="empty-state"` with "No entries yet" when list is empty.

## Edge Cases

- Newly added entry appears in correct date-sorted position.
- Filtering and sorting both apply simultaneously.
- After deleting all entries the empty state shows.
- After failed validation, form inputs retain their values.
