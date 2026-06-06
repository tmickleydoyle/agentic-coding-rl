# Art Portfolio

Build a single-page art portfolio manager where an artist can track their artworks.

## Seed Data

Start with these 4 artworks pre-loaded:

| id | title             | medium       | year | forSale | price |
|----|-------------------|--------------|------|---------|-------|
| 1  | Sunset Over Hills | Oil on Canvas| 2021 | true    | 450   |
| 2  | Urban Fragments   | Watercolor   | 2022 | false   | 0     |
| 3  | Silent Forest     | Acrylic      | 2023 | true    | 320   |
| 4  | Abstract Mind     | Mixed Media  | 2020 | false   | 0     |

## Fields per Artwork

- `id` — unique number
- `title` — string
- `medium` — string
- `year` — number (1900–2099)
- `forSale` — boolean
- `price` — number (only meaningful when forSale is true)

## Layout & Components

### Header
- `<h1>` with text "Art Portfolio"
- Show total artwork count: `data-testid="artwork-count"` — text "{n} works"

### Filter Bar
- A text input `data-testid="filter-input"` that filters artworks by title (case-insensitive substring match)
- A checkbox `data-testid="filter-for-sale"` labeled "For Sale Only" — when checked, show only artworks where forSale is true

### Artwork List
- Each artwork rendered in a card with `data-testid="artwork-card"`
- Inside each card:
  - `data-testid="artwork-title"` — the title
  - `data-testid="artwork-medium"` — the medium
  - `data-testid="artwork-year"` — the year
  - `data-testid="artwork-price"` — shows "$NNN" when forSale is true, "Not for Sale" when false
  - A button `data-testid="toggle-sale"` — text "Mark For Sale" when not for sale, "Remove from Sale" when for sale. Clicking toggles the forSale flag (and sets price to 0 when removing from sale).
  - A button `data-testid="delete-artwork"` — removes the artwork from the list

### Add Artwork Form
- `data-testid="add-form"`
- Inputs:
  - `data-testid="input-title"` — text input, placeholder "Title"
  - `data-testid="input-medium"` — text input, placeholder "Medium"
  - `data-testid="input-year"` — number input, placeholder "Year"
  - `data-testid="input-price"` — number input, placeholder "Price"
  - `data-testid="input-for-sale"` — checkbox labeled "For Sale"
- Submit button `data-testid="submit-artwork"` with text "Add Artwork"
- On submit: add the artwork with a new unique id, clear the form inputs
- Validation: if title or medium is empty, or year is not between 1900 and 2099, do NOT add and show `data-testid="form-error"` with text "Please fill in all required fields correctly."
- If valid, hide the error message (or don't show it)

## Behaviors

- The artwork-count updates whenever artworks are added or deleted
- Filters apply in real time (no submit needed)
- Both filters (text + for-sale checkbox) can be active simultaneously
- The artwork-count reflects the TOTAL count of all artworks, not the filtered count
- Deleting an artwork removes it from all views immediately
