# Bar Inventory Manager

A single-page React app for managing a bar's bottle inventory with low-stock alerts and category filtering.

## Seed Data

The app starts with the following bottles pre-loaded:

| Name | Category | Quantity | Unit | Low Stock Threshold |
|------|----------|----------|------|---------------------|
| Hendrick's Gin | Gin | 3 | bottles | 2 |
| Grey Goose Vodka | Vodka | 1 | bottles | 2 |
| Bulleit Bourbon | Whiskey | 5 | bottles | 2 |
| Patron Silver | Tequila | 2 | bottles | 2 |
| Bacardi White Rum | Rum | 0 | bottles | 2 |
| Campari | Liqueur | 4 | bottles | 2 |

## Fields

Each inventory item has:
- **name** (string): product name
- **category** (string): spirit category
- **quantity** (number): bottles on hand
- **unit** (string): always "bottles"
- **threshold** (number): low-stock alert level

## UI Layout

- Page heading: "Bar Inventory"
- Category filter: "All" + one button per unique category
- Low-stock banner: if any items have quantity <= threshold, show a banner "Low Stock Alert: {count} item(s) need restocking"
- Item list: each item as a card
- Each card: name, category, quantity display, and two buttons: "+" (increase qty by 1) and "−" (decrease qty by 1, minimum 0)
- Add item form: Name, Category, Quantity (number), Threshold (number)
- Submit button "Add Item"

## Behaviors

1. **Filter by Category**: Clicking a category button filters the list. "All" shows all.
2. **Quantity controls**: "+" increments quantity by 1. "−" decrements by 1, clamped at 0.
3. **Low-stock banner**: Dynamically updates as quantities change. Shows count of items (across ALL items, not just filtered) with quantity <= threshold.
4. **Add Item**: Submitting the form with non-empty Name appends a new item. Form resets after save.
5. **Empty guard**: Clicking "Add Item" with empty Name does nothing.
6. **Low-stock card highlight**: Cards where quantity <= threshold show a visual indicator — a data-testid `low-stock-indicator` within the card.

## Data-testids

- `inventory-list` — container for all item cards
- `inventory-card` — each item card
- `item-name` — name in card
- `item-category` — category in card
- `item-quantity` — quantity display in card
- `increment-qty` — "+" button on each card
- `decrement-qty` — "−" button on each card
- `low-stock-indicator` — indicator element present only when quantity <= threshold
- `low-stock-banner` — the top-level low-stock alert banner (shown only when at least one item is low)
- `filter-all` — All filter button
- `category-filter` — each category filter button (multiple)
- `input-name` — Name input
- `input-category` — Category input
- `input-quantity` — Quantity input
- `input-threshold` — Threshold input
- `submit-item` — Add Item button

## Edge Cases

- Quantity cannot go below 0 (clicking "−" at 0 does nothing).
- Adding a new item with a new category creates a new category filter button.
- The low-stock banner count considers ALL items, not just the filtered view.
- An item with quantity exactly equal to threshold IS considered low stock.
