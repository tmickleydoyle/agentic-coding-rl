# Scratch Grocery List — Grocery Manager

Build a single-page React app for managing a grocery shopping list.

## Seed Data

Pre-loaded items:
- id:1, name:"Milk", quantity:2, unit:"liters", category:"Dairy", purchased:false
- id:2, name:"Bread", quantity:1, unit:"loaf", category:"Bakery", purchased:false
- id:3, name:"Apples", quantity:6, unit:"pcs", category:"Produce", purchased:true
- id:4, name:"Chicken Breast", quantity:500, unit:"grams", category:"Meat", purchased:false
- id:5, name:"Cheddar Cheese", quantity:200, unit:"grams", category:"Dairy", purchased:false

## Fields

Each grocery item has:
- id (number)
- name (string)
- quantity (number)
- unit (string)
- category (string — "Dairy" | "Bakery" | "Produce" | "Meat" | "Other")
- purchased (boolean)

## Layout

- Page heading: "Grocery List"
- Add form with:
  - Text input labeled "Item Name" (data-testid="item-name-input")
  - Number input labeled "Quantity" (data-testid="quantity-input")
  - Text input labeled "Unit" (data-testid="unit-input")
  - Select for Category (data-testid="category-select") options: Dairy, Bakery, Produce, Meat, Other
  - Button "Add Item" (data-testid="add-item-btn")
- Summary: show remaining items (not purchased) as data-testid="remaining-count" and total items as data-testid="total-items-count"
- Filter by category buttons: "All", "Dairy", "Bakery", "Produce", "Meat", "Other" (data-testid="filter-{lowercase category}", e.g. "filter-all", "filter-dairy")
- A "Clear Purchased" button (data-testid="clear-purchased-btn") that removes all purchased items
- Item list. Each item card:
  - data-testid="item-card-{id}"
  - data-testid="item-name-{id}" showing name
  - data-testid="item-quantity-{id}" showing quantity and unit (e.g. "2 liters")
  - data-testid="item-category-{id}" showing category
  - Checkbox (data-testid="item-checkbox-{id}") to toggle purchased
  - Delete button (data-testid="delete-item-{id}") labeled "Delete"

## Behaviors

1. Add Item: name must be non-empty (trimmed), quantity must be > 0. Unit defaults to "pcs" if empty. Category defaults to "Other". After adding, reset name, quantity, and unit inputs.
2. Toggle purchased: checkbox flips purchased state. Purchased items appear visually struck through (className contains "line-through").
3. Delete: removes item from list.
4. Clear Purchased: removes all items where purchased === true.
5. Filter: category buttons filter the visible list. The remaining-count and total-items-count always reflect the FULL dataset.
6. Quantity display format: "{quantity} {unit}" in data-testid="item-quantity-{id}".

## Edge Cases

- Adding with empty name does nothing.
- Adding with quantity 0 or negative does nothing.
- "Clear Purchased" with no purchased items does nothing (no crash).
- Filter + clear purchased: cleared items are removed from full list regardless of current filter.
