# PR Review Notes

Build a single-page React app for capturing and managing pull request review notes.

## Seed Data

| id | author  | pr_number | note                                      | category   | resolved |
|----|---------|-----------|-------------------------------------------|------------|----------|
| 1  | alice   | 42        | Missing error handling in fetch calls     | bug        | false    |
| 2  | bob     | 42        | Consider extracting this into a hook      | suggestion | false    |
| 3  | carol   | 55        | Unused import on line 12                  | nit        | true     |
| 4  | alice   | 55        | This function is too long, refactor it    | suggestion | false    |
| 5  | dave    | 67        | Security: sanitize user input             | bug        | false    |
| 6  | carol   | 67        | Typo in variable name: `usesr` -> `user`  | nit        | true     |

## Fields

- **author**: string
- **pr_number**: number
- **note**: string — the review note text
- **category**: "bug" | "suggestion" | "nit"
- **resolved**: boolean

## Behaviors

### Display
- Heading "PR Review Notes".
- Render each note as a card with `data-testid="note-card-{id}"`.
- Each card shows the author, PR number (`data-testid="pr-number-{id}"`), note text (`data-testid="note-text-{id}"`), and category badge (`data-testid="category-badge-{id}"`).
- Resolved notes have `data-testid="resolved-indicator-{id}"` showing "Resolved".
- Unresolved notes do not show the resolved indicator.

### Add Note
- Form fields: author (text, `data-testid="input-author"`), pr_number (number, `data-testid="input-pr-number"`), note (textarea, `data-testid="input-note"`), category (select, `data-testid="select-category"` with options bug/suggestion/nit).
- Submit button `data-testid="btn-add-note"` labeled "Add Note".
- Append on submit with auto-incremented id, resolved defaults to false.
- Do not submit if author or note is empty.

### Resolve Toggle
- Each card has a button `data-testid="btn-resolve-{id}"` labeled "Resolve" when unresolved, "Unresolve" when resolved.
- Clicking toggles the resolved state.

### Filter by Category
- Buttons: "All" (`data-testid="filter-all"`), "Bug" (`data-testid="filter-bug"`), "Suggestion" (`data-testid="filter-suggestion"`), "Nit" (`data-testid="filter-nit"`).
- Filters visible cards by category; "All" shows everything.

### Summary
- `data-testid="stat-total"` — total note count.
- `data-testid="stat-resolved"` — count of resolved notes.
- `data-testid="stat-unresolved"` — count of unresolved notes.

### Delete
- Each card has `data-testid="btn-delete-{id}"` to remove the note.

## Edge Cases
- Submitting with empty author or note: no card added.
- Stats always reflect all notes regardless of filter.
- New notes start as unresolved.
