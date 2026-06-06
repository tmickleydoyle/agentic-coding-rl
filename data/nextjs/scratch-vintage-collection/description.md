# Vintage Collection Manager

Build a single-page React app for managing a vintage item collection.

## Seed Data

Start with these items pre-loaded:

| id | name | category | year | price | sold |
|----|------|----------|------|-------|------|
| 1 | Art Deco Lamp | Furniture | 1925 | 450 | false |
| 2 | Bakelite Radio | Electronics | 1938 | 320 | false |
| 3 | Victorian Brooch | Jewelry | 1890 | 180 | true |
| 4 | Tin Toy Train | Toys | 1952 | 95 | false |
| 5 | Tiffany Vase | Glassware | 1910 | 780 | false |

## Fields

Each item has:
- `id` (number, auto-increment)
- `name` (string)
- `category` (string: Furniture | Electronics | Jewelry | Toys | Glassware | Other)
- `year` (number)
- `price` (number, USD)
- `sold` (boolean)

## UI Layout

1. **Header**: "Vintage Collection" heading (`data-testid="heading"`)
2. **Add Item Form** (`data-testid="add-form"`):
   - Text input for name (`data-testid="input-name"`)
   - Select for category (`data-testid="select-category"`)
   - Number input for year (`data-testid="input-year"`)
   - Number input for price (`data-testid="input-price"`)
   - Submit button labeled "Add Item" (`data-testid="btn-add"`)
3. **Filter Bar**:
   - Select to filter by category (`data-testid="filter-category"`), default "All"
   - Checkbox to hide sold items (`data-testid="filter-hide-sold"`)
4. **Item List** (`data-testid="item-list"`):
   - Each item rendered as a row/card with `data-testid="item-{id}"`
   - Shows name (`data-testid="item-name-{id}"`), category, year, price formatted as "$X"
   - Shows sold badge "SOLD" when sold (`data-testid="item-sold-{id}"`)
   - "Mark Sold" button (`data-testid="btn-sold-{id}"`) — only visible when not sold
   - "Remove" button (`data-testid="btn-remove-{id}"`)
5. **Summary** (`data-testid="summary"`):
   - Total items count
   - Total value of unsold items (sum of prices of items where sold=false)

## Behaviors

- **Add Item**: filling form and clicking "Add Item" appends item to list; form clears after add; new item has sold=false; id auto-increments from max existing id + 1.
- **Validation**: name must be non-empty, year must be a 4-digit number (1000–2999), price must be > 0; if invalid, do not add; show an error message (`data-testid="form-error"`) describing the issue.
- **Mark Sold**: clicking "Mark Sold" sets that item's sold=true; "Mark Sold" button disappears; "SOLD" badge appears.
- **Remove**: clicking "Remove" removes the item from the list permanently.
- **Filter by Category**: selecting a category shows only items of that category; "All" shows every item.
- **Hide Sold**: checking "hide sold" hides items where sold=true from the displayed list.
- **Filters combine**: category filter and hide-sold filter apply simultaneously.
- **Summary updates**: total count and total unsold value update whenever items change or filters change (summary reflects ALL items, not just filtered view).

## Edge Cases

- Adding an item with an empty name shows error "Name is required".
- Adding with year outside 1000–2999 shows error "Year must be between 1000 and 2999".
- Adding with price <= 0 shows error "Price must be greater than 0".
- Removing all items of a category then switching filter back to "All" still shows remaining items.
- A sold item's price is excluded from the total unsold value.
