# Body Art Ideas

A single-page React app for collecting body art inspiration. Users can add ideas with tags, mark favorites, search by keyword, and delete ideas.

## Seed Data

Start with these 4 ideas pre-loaded:

| id | title | description | tags | favorite |
|----|-------|-------------|------|----------|
| 1 | Mandala back piece | Full back mandala in dotwork | dotwork, mandala, back | false |
| 2 | Snake arm wrap | Black and grey snake wrapping forearm | blackgrey, snake, forearm | true |
| 3 | Watercolor hummingbird | Bright watercolor hummingbird on shoulder | watercolor, bird, shoulder | false |
| 4 | Script quote | Minimalist script on ribs | script, minimalist, ribs | true |

Tags are stored as comma-separated strings internally but displayed as individual chips/badges.

## Fields

- **title** (string): short title for the idea
- **description** (string): longer description
- **tags** (string): comma-separated tag list (e.g. "dotwork, mandala")
- **favorite** (boolean): whether the idea is favorited

## UI Behaviors

### Add Form
- Inputs for title, description, and tags.
- "Add Idea" button appends a new idea with `favorite: false`.
- Clear all fields after successful submission.
- If title is empty, do not submit.

### Search
- A text input with `data-testid="search-input"` that filters ideas by title or description (case-insensitive substring match).
- Filtering is live (no submit button).

### Favorite Toggle
- Each card has a favorite button (e.g. star icon text "Favorite" / "Unfavorite").
- When `favorite` is true, the card shows `data-testid="favorite-badge"`.

### Filter: Favorites Only
- A checkbox with label "Show favorites only" (`data-testid="favorites-filter"`).
- When checked, only show ideas where `favorite === true`.
- Search and favorites filter combine (AND logic).

### List
- Each idea is a card with `data-testid="idea-card"`.
- Show title, description, and tags as individual spans with `data-testid="tag-chip"`.
- Each card has a delete button.

### Count
- Show `data-testid="idea-count"` with text like "4 ideas" (reflects filtered count).

## Edge Cases

- Submitting with empty title is a no-op.
- Search with no matches shows empty list.
- Tags field empty means no tag chips rendered.
- Favorites filter + search both empty shows all ideas.
