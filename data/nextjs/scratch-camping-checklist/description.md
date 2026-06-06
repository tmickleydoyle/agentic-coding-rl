# Camping Checklist

A single-page app for managing a camping trip checklist. Users can view, add, check off, and remove items grouped by category.

## Seed Data

Three categories with items pre-loaded:

**Shelter**
- Tent (packed: false)
- Sleeping bag (packed: true)
- Sleeping pad (packed: false)

**Food & Water**
- Water filter (packed: false)
- Camp stove (packed: true)
- Food supplies (packed: false)

**Clothing**
- Rain jacket (packed: true)
- Hiking boots (packed: true)
- Warm layers (packed: false)

## Fields

- Item name (string)
- Category (one of: Shelter, Food & Water, Clothing)
- Packed status (boolean)

## Behaviors

1. Display all items grouped under their category headings.
2. Each item shows a checkbox. Checking it marks the item as packed; unchecking marks it unpacked.
3. A packed item's text is displayed with a strikethrough style.
4. Users can add a new item by typing a name in the input and selecting a category from a dropdown, then clicking "Add Item". The item is added as unpacked.
5. Clicking "Remove" next to an item deletes it from the list.
6. A summary at the top shows "X of Y items packed" where X is the count of packed items and Y is total items.
7. A "Clear Packed" button removes all items that are currently marked as packed.
8. Empty input: clicking "Add Item" with an empty name field does nothing (no item added).
9. Category headings show how many items are packed in that category, e.g. "Shelter (1/3)".

## Edge Cases

- After removing all items in a category, that category heading should no longer appear.
- After clearing all packed items, the summary reflects the new count.
- The new-item input is cleared after a successful add.
