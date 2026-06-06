# Home Inventory

A single-page React app to track household items by room and category.

## Seed Data

Start with these items pre-loaded:

| Name | Room | Category | Quantity | Value ($) |
|------|------|----------|----------|-----------|
| 65" TV | Living Room | Electronics | 1 | 800 |
| Sofa | Living Room | Furniture | 1 | 1200 |
| Coffee Table | Living Room | Furniture | 1 | 300 |
| Refrigerator | Kitchen | Appliances | 1 | 950 |
| Microwave | Kitchen | Appliances | 1 | 120 |
| Bed Frame | Bedroom | Furniture | 1 | 600 |
| Laptop | Bedroom | Electronics | 1 | 1100 |

## Fields

Each item has:
- **Name** (text, required)
- **Room** (select: Living Room, Kitchen, Bedroom, Bathroom, Garage, Other)
- **Category** (select: Furniture, Electronics, Appliances, Clothing, Tools, Other)
- **Quantity** (number, min 1)
- **Value** (number in dollars, min 0)

## Behaviors

### Add Item
- A form with inputs for Name, Room, Category, Quantity, Value
- "Add Item" button submits the form
- New item appears in the list
- Form clears after submission
- If Name is empty, do not add the item

### Display
- Show all items in a table or list
- Each item row shows: Name, Room, Category, Quantity, Value formatted as "$X"
- Each item has a "Delete" button to remove it

### Filter by Room
- A dropdown filter (default "All Rooms") to show items for a specific room
- When a room is selected, only items in that room are displayed

### Summary Stats
- Display total item count (across all items, not just filtered)
- Display total value of all items formatted as "$X" (sum of quantity * value for each item)

## Edge Cases
- Deleting an item removes it from the list immediately
- Filter does not affect summary totals (totals always reflect all items)
- Quantity defaults to 1 if not specified
- Value defaults to 0 if not specified
- Name field is trimmed before validation
