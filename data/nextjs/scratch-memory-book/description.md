# Memory Book

Build a single-page memory book application in React.

## Seed Data

Start with these 3 memories pre-loaded:

```
id: 1, title: "First Day of School", date: "2023-09-05", mood: "excited", tags: ["school", "milestone"], note: "Nervous but so ready for this new chapter"
id: 2, title: "Family Reunion", date: "2023-07-04", mood: "happy", tags: ["family", "summer"], note: "BBQ and fireworks with everyone together"
id: 3, title: "Rainy Sunday", date: "2023-11-12", mood: "peaceful", tags: ["home", "relax"], note: "Books and hot cocoa all afternoon"
```

## Fields

Each memory has:
- `id` (number, auto-increment)
- `title` (string, required)
- `date` (string, YYYY-MM-DD format, required)
- `mood` (string, one of: "happy", "excited", "peaceful", "sad", "grateful")
- `tags` (array of strings — comma-separated input)
- `note` (string, optional)

## UI Layout

- Page heading: "Memory Book"
- List of memory cards
- Each card shows: title, date, mood badge, tags, note
- An "Add Memory" form with inputs for all fields
- A filter dropdown to filter by mood

## Behaviors

1. **Display**: All seed memories shown on load. Each card has `data-testid="memory-card"`.
2. **Add Memory**: Form has labeled inputs. Clicking "Add Memory" appends the new memory. Form clears after submission.
3. **Validation**: If title or date is empty, show `data-testid="form-error"` with "Title and date are required". Do not add the memory.
4. **Tags**: Tags input accepts a comma-separated string (e.g. "family, summer"). Split and trim into array on save. Each tag rendered with `data-testid="tag"`.
5. **Mood badge**: Each card shows the mood with `data-testid="mood-badge"`.
6. **Filter by mood**: A `<select>` with `data-testid="mood-filter"` lets users filter by mood. Default option "All Moods" shows all memories.
7. **Memory count**: `data-testid="memory-count"` shows "X memories" (filtered count).
8. **Delete**: Each card has a "Delete" button (`data-testid="delete-btn"`).
9. **Empty state**: When filtered list is empty, show `data-testid="empty-state"` with "No memories found".

## Edge Cases

- Filtering shows only matching mood; count updates accordingly.
- Deleting a memory while a mood filter is active only removes that memory.
- Empty tags input results in an empty tags array (no tags rendered).
- After failed validation, inputs retain their values.
