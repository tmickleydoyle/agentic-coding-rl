# Tattoo Planner

A single-page React app for planning tattoo ideas. Users can add new tattoo ideas, filter by style, and mark ideas as done (completed).

## Seed Data

Start with these 4 tattoo ideas pre-loaded:

| id | name | style | placement | done |
|----|------|-------|-----------|------|
| 1 | Geometric wolf | Neo-traditional | Upper arm | false |
| 2 | Minimalist sun | Fine line | Wrist | false |
| 3 | Floral sleeve | Watercolor | Full sleeve | false |
| 4 | Anchor with rope | Traditional | Calf | true |

## Fields

- **name** (string): short description of the tattoo idea
- **style** (string): tattoo style — one of: "Traditional", "Neo-traditional", "Fine line", "Watercolor", "Blackwork", "Realism"
- **placement** (string): body placement (free text)
- **done** (boolean): whether the tattoo has been completed

## UI Behaviors

### Add Form
- A form at the top with inputs for name, style (dropdown), and placement.
- "Add Idea" button submits the form and appends a new idea with `done: false`.
- After submission, clear the name and placement fields; keep the style selection.
- If name or placement is empty, do not submit (button disabled or no-op).

### Filter
- A dropdown to filter by style. Options: "All", "Traditional", "Neo-traditional", "Fine line", "Watercolor", "Blackwork", "Realism".
- Default filter is "All" (shows all ideas).
- Filtering updates the visible list without removing items from state.

### Idea List
- Each idea is rendered as a card with `data-testid="idea-card"`.
- Display the name, style, and placement.
- A checkbox or button to toggle `done`. When done, the card should show `data-testid="idea-done"`.
- Show a count of total ideas and completed ideas: e.g. "2 / 4 completed" with `data-testid="completion-count"`.

### Delete
- Each card has a delete button. Clicking it removes that idea from the list.

## Edge Cases

- Adding with empty name or empty placement does nothing.
- Filtering to a style with no ideas shows an empty list (no cards rendered).
- Deleting all items leaves an empty list.
- The completion count reflects only the currently visible (filtered) ideas.
