# Craft Supplies Inventory

A single-page React app to track a craft supplies inventory.

## Seed Data

Start with these 5 items pre-loaded:

| id | name | category | quantity | unit |
|----|------|----------|----------|------|
| 1 | "Red Acrylic Paint" | "Paint" | 3 | "bottles" |
| 2 | "Watercolor Set" | "Paint" | 1 | "set" |
| 3 | "Scissors" | "Tools" | 2 | "pairs" |
| 4 | "Canvas 8x10" | "Surface" | 10 | "sheets" |
| 5 | "Hot Glue Sticks" | "Adhesive" | 50 | "sticks" |

## Fields

- **name** (string): supply name
- **category** (string): one of "Paint", "Tools", "Surface", "Adhesive", "Fabric", "Other"
- **quantity** (number): how many in stock
- **unit** (string): unit label (e.g. "bottles", "sheets")

## UI Layout

- Page heading: "Craft Supplies Inventory"
- **Add Supply form**:
  - text input labeled "Supply Name" (data-testid="input-name")
  - select labeled "Category" (data-testid="select-category") with options: Paint, Tools, Surface, Adhesive, Fabric, Other
  - number input labeled "Quantity" (data-testid="input-quantity")
  - text input labeled "Unit" (data-testid="input-unit")
  - submit button "Add Supply" (data-testid="btn-add")
- **Category filter**: a select (data-testid="filter-category") with "All" plus each category
- **Supply list**: each item in a row with:
  - data-testid="supply-{id}" on the row
  - data-testid="supply-name-{id}" showing name
  - data-testid="supply-category-{id}" showing category
  - data-testid="supply-quantity-{id}" showing quantity
  - data-testid="supply-unit-{id}" showing unit
  - A button "+" (data-testid="btn-increment-{id}") to add 1 to quantity
  - A button "-" (data-testid="btn-decrement-{id}") to subtract 1 (minimum 0)
  - A button "Delete" (data-testid="btn-delete-{id}")
- **Total items count** (data-testid="total-count"): "Total: X items" where X is count of supply entries

## Behaviors

1. **Add Supply**: all fields required. Quantity must be > 0. Appends new supply. Form resets.
2. **Empty name guard**: blank name = no-op.
3. **Increment**: clicking "+" increases quantity by 1.
4. **Decrement**: clicking "-" decreases quantity by 1, minimum 0.
5. **Delete**: removes supply from list.
6. **Filter by Category**: selecting a category shows only matching rows. "All" shows everything.
7. **Total count**: always reflects total number of supply entries (not filtered).

## Edge Cases

- Quantity cannot go below 0 via decrement.
- If no supplies match filter, show data-testid="empty-msg" with "No supplies found".
- Adding a supply with quantity 0 or negative is a no-op.
