# Supplies Inventory

Build a single-page art supplies inventory tracker to manage stock levels.

## Seed Data

Start with these 5 supplies pre-loaded:

| id | name              | category  | quantity | reorderAt | unit   |
|----|-------------------|-----------|----------|-----------|--------|
| 1  | Titanium White    | Paint     | 3        | 2         | tubes  |
| 2  | Cadmium Red       | Paint     | 1        | 3         | tubes  |
| 3  | Flat Brush Set    | Brushes   | 8        | 2         | pieces |
| 4  | Linen Canvas 12x16| Canvas    | 2        | 5         | pieces |
| 5  | Palette Knife     | Tools     | 6        | 1         | pieces |

## Fields per Supply

- `id` — unique number
- `name` — string
- `category` — string
- `quantity` — number (>= 0)
- `reorderAt` — number (low-stock threshold; alert when quantity <= reorderAt)
- `unit` — string (e.g. "tubes", "pieces")

## Layout & Components

### Header
- `<h1>` with text "Supplies Inventory"
- `data-testid="low-stock-count"` — text "{n} low stock" where n = number of supplies with quantity <= reorderAt

### Filter Bar
- Text input `data-testid="filter-input"` — filters by name (case-insensitive substring)
- Select `data-testid="filter-category"` — options: "All" plus one option per unique category from current supplies. Filters by category.

### Supplies List
- Each supply in a card `data-testid="supply-card"`
  - `data-testid="supply-name"` — name
  - `data-testid="supply-category"` — category
  - `data-testid="supply-quantity"` — "{n} {unit}" (e.g. "3 tubes")
  - `data-testid="supply-status"` — "Low Stock" if quantity <= reorderAt, "OK" otherwise
  - Button `data-testid="increment-qty"` — increases quantity by 1
  - Button `data-testid="decrement-qty"` — decreases quantity by 1, minimum 0 (cannot go below 0)
  - Button `data-testid="delete-supply"` — removes the supply

### Add Supply Form
- `data-testid="add-form"`
- Inputs:
  - `data-testid="input-name"` — text, placeholder "Supply Name"
  - `data-testid="input-category"` — text, placeholder "Category"
  - `data-testid="input-quantity"` — number, placeholder "Quantity"
  - `data-testid="input-reorder-at"` — number, placeholder "Reorder At"
  - `data-testid="input-unit"` — text, placeholder "Unit"
- Submit button `data-testid="submit-supply"` — "Add Supply"
- On submit: add supply with new unique id, clear form
- Validation: if name or category is empty, or quantity < 0, or reorderAt < 0, show `data-testid="form-error"` with text "Please fill in all fields with valid values."

## Behaviors

- low-stock-count updates whenever quantities change or supplies are added/removed
- Decrement cannot reduce quantity below 0
- Filters apply in real time; both can be active simultaneously
- Category filter dropdown must include all categories currently in the list
