# Scratch Pantry Tracker — Pantry Inventory

Build a single-page React app for tracking pantry food items with quantities and expiry dates.

## Seed Data

Pre-loaded items:
- id:1, name:"Rice", quantity:2, unit:"kg", category:"Grains", expiryDate:"2026-12-01", lowStock:false
- id:2, name:"Olive Oil", quantity:1, unit:"bottle", category:"Oils", expiryDate:"2026-08-15", lowStock:false
- id:3, name:"Canned Tomatoes", quantity:3, unit:"cans", category:"Canned", expiryDate:"2027-01-10", lowStock:false
- id:4, name:"Flour", quantity:0.5, unit:"kg", category:"Grains", expiryDate:"2026-07-01", lowStock:true
- id:5, name:"Honey", quantity:1, unit:"jar", category:"Condiments", expiryDate:"2028-05-20", lowStock:false

## Fields

Each pantry item has:
- id (number)
- name (string)
- quantity (number)
- unit (string)
- category (string — "Grains" | "Oils" | "Canned" | "Condiments" | "Other")
- expiryDate (string — YYYY-MM-DD format)
- lowStock (boolean — true when quantity < 1)

## Layout

- Page heading: "Pantry Tracker"
- Add form:
  - Text input "Item Name" (data-testid="item-name-input")
  - Number input "Quantity" (data-testid="quantity-input")
  - Text input "Unit" (data-testid="unit-input")
  - Select "Category" (data-testid="category-select") options: Grains, Oils, Canned, Condiments, Other
  - Date input "Expiry Date" (data-testid="expiry-date-input")
  - Button "Add Item" (data-testid="add-item-btn")
- Summary:
  - Total items (data-testid="total-items-count")
  - Low stock items count (data-testid="low-stock-count") — items where lowStock is true
- Filter buttons: "All", "Low Stock" (data-testid="filter-all", "filter-low-stock")
- Item cards:
  - data-testid="item-card-{id}"
  - data-testid="item-name-{id}" — item name
  - data-testid="item-quantity-{id}" — "{quantity} {unit}"
  - data-testid="item-category-{id}" — category
  - data-testid="item-expiry-{id}" — expiry date string
  - data-testid="low-stock-badge-{id}" — rendered ONLY when lowStock is true, text "Low Stock"
  - Button "Update Qty" (data-testid="update-qty-btn-{id}") — clicking opens an inline quantity editor
  - Number input (data-testid="qty-edit-input-{id}") visible only while editing that item
  - Button "Save" (data-testid="save-qty-btn-{id}") to confirm new quantity
  - Delete button (data-testid="delete-item-{id}") labeled "Delete"

## Behaviors

1. Add Item: name non-empty (trimmed), quantity >= 0, unit non-empty. lowStock auto-set to true if quantity < 1. expiryDate optional (empty string if not provided). After adding, reset form.
2. Update Qty: clicking "Update Qty" shows the qty-edit-input for that item. Clicking "Save" updates the quantity and recalculates lowStock (< 1 → true). Hide the input after saving.
3. Delete: removes item.
4. Filter "Low Stock": shows only items where lowStock is true.
5. Summary counts always reflect the FULL dataset.
6. Low stock items have their card styled with a warning (className contains "bg-yellow" or "border-yellow" or similar — test checks for the low-stock-badge presence only).

## Edge Cases

- Adding with empty name does nothing.
- Adding item with quantity 0 sets lowStock to true.
- Saving a new qty that brings item below 1 sets lowStock to true and shows the badge.
- Saving a new qty >= 1 sets lowStock to false and hides the badge.
