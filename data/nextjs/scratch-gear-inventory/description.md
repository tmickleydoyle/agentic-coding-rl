# Gear Inventory

A single-page app for tracking outdoor gear. Users can view their gear collection, add new items, edit quantities, and filter by category.

## Seed Data

Eight gear items pre-loaded:

| Name | Category | Quantity | Condition | Notes |
|------|----------|----------|-----------|-------|
| Tent | Shelter | 1 | Good | 3-season |
| Sleeping bag | Shelter | 2 | Excellent | Rated to 20°F |
| Trekking poles | Navigation | 1 | Fair | One tip worn |
| Headlamp | Lighting | 2 | Good | New batteries |
| Camp stove | Cooking | 1 | Good | Canister type |
| Water filter | Hydration | 1 | Excellent | |
| First aid kit | Safety | 1 | Good | Restocked 2024 |
| Bear canister | Safety | 1 | Good | Required in some parks |

## Fields

- Name (string)
- Category (Shelter | Navigation | Lighting | Cooking | Hydration | Safety)
- Quantity (positive integer)
- Condition (Excellent | Good | Fair | Poor)
- Notes (string, optional)

## Behaviors

1. Display all gear items in a list showing all fields.
2. Filter by category via a dropdown (options: All + each category). Only matching items are shown.
3. Add a new gear item via a form. Clicking "Add Gear" appends the item. Name must be non-empty and quantity must be >= 1.
4. Clicking "+" or "-" buttons next to an item's quantity increases or decreases it by 1. Quantity cannot go below 1.
5. Clicking "Remove" on an item deletes it.
6. A count badge shows "X items" reflecting the currently visible (filtered) count.
7. Condition is displayed as a colored badge: Excellent=green, Good=blue, Fair=yellow, Poor=red. Use data-testid="condition-badge-{id}" with a data-condition attribute set to the condition value.
8. The add form is cleared after a successful add.
9. Filtering does not affect the underlying list — switching back to "All" restores all items.

## Edge Cases

- Adding with empty name: nothing happens.
- Adding with quantity 0 or less: nothing happens.
- Decrement at quantity 1 keeps it at 1 (no going below 1).
- Notes field is optional; if empty, it is simply not shown (or shown as empty).
