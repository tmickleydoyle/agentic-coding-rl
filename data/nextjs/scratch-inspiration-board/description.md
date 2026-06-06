# Inspiration Board

Build a single-page inspiration board where a creative can collect and organize ideas.

## Seed Data

Start with these 4 inspiration items pre-loaded:

| id | title              | category  | notes                           | pinned |
|----|--------------------|-----------|---------------------------------|--------|
| 1  | Brutalist Shapes   | Design    | Bold geometry, raw concrete     | true   |
| 2  | Ocean Textures     | Nature    | Wave patterns, tidal erosion    | false  |
| 3  | 70s Color Palettes | Color     | Muted earth tones, mustard      | true   |
| 4  | Street Typography  | Type      | Hand-painted signs, worn edges  | false  |

## Fields per Inspiration Item

- `id` — unique number
- `title` — string
- `category` — string
- `notes` — string
- `pinned` — boolean

## Layout & Components

### Header
- `<h1>` with text "Inspiration Board"
- `data-testid="item-count"` — text "{n} items"
- `data-testid="pinned-count"` — text "{n} pinned"

### Filter Bar
- Text input `data-testid="filter-input"` — filters by title (case-insensitive substring)
- Select `data-testid="filter-category"` — options: "All" plus each unique category. Filters by category.
- Checkbox `data-testid="filter-pinned"` labeled "Pinned Only" — when checked, shows only pinned items

### Inspiration List
- Pinned items appear FIRST in the list, then unpinned items (both groups maintain their original order relative to each other)
- Each item in a card `data-testid="inspiration-card"`
  - `data-testid="item-title"` — title
  - `data-testid="item-category"` — category
  - `data-testid="item-notes"` — notes
  - `data-testid="item-pinned"` — text "Pinned" if pinned, "Unpinned" if not
  - Button `data-testid="toggle-pin"` — text "Unpin" when pinned, "Pin" when not pinned
  - Button `data-testid="delete-item"` — removes the item

### Add Item Form
- `data-testid="add-form"`
- Inputs:
  - `data-testid="input-title"` — text, placeholder "Title"
  - `data-testid="input-category"` — text, placeholder "Category"
  - `data-testid="input-notes"` — text, placeholder "Notes"
  - `data-testid="input-pinned"` — checkbox labeled "Pin this item"
- Submit button `data-testid="submit-item"` — "Add Item"
- On submit: add item with new unique id, clear form
- Validation: if title or category is empty, show `data-testid="form-error"` with text "Title and category are required."

## Behaviors

- item-count shows total items (not filtered)
- pinned-count shows count of ALL pinned items (not filtered)
- All 3 filters can be active simultaneously
- Pinned items always sort before unpinned in the displayed list
- Toggling a pin updates pinned-count and re-sorts the list immediately
