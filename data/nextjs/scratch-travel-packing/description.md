# Travel Packing List

A single-page app for managing a travel packing checklist.

## Seed Data

Six pre-existing packing items across categories:
- Passport | Category: Documents | Packed: false
- Phone charger | Category: Electronics | Packed: false
- T-shirts (3) | Category: Clothing | Packed: false
- Toothbrush | Category: Toiletries | Packed: true
- Sunscreen | Category: Toiletries | Packed: false
- Laptop | Category: Electronics | Packed: true

## Categories
Documents, Electronics, Clothing, Toiletries, Other

## UI Elements

- Page heading: "Travel Packing List"
- Category filter select (aria-label="Filter by category") with options: All, Documents, Electronics, Clothing, Toiletries, Other
- Packed/Unpacked toggle filter: two buttons "Show All" and "Show Unpacked" to filter by packed status
- List of items (filtered). Each <li> has data-testid="packing-item" showing item name, category, and packed status.
  Each item has:
  - A checkbox (aria-label="{item name}") reflecting packed state; clicking toggles it
  - data-testid="packing-item" on the <li>
  - Item name and category visible in text
- Progress display (data-testid="pack-progress"): e.g. "2 / 6 packed" (counts all items, not filtered)
- Form fields:
  - Label "Item Name" → text input
  - Label "Category" → select with all category options
  - Button "Add Item"
- Button "Remove" (data-testid="remove-item") on each item to delete it

## Behaviors

### Add Item
- Item Name required. If empty, does nothing.
- Added item starts as unpacked (packed: false).
- Updates progress; clears Item Name input; category resets to "Documents".

### Toggle Packed
- Clicking the checkbox for an item toggles its packed state.
- Progress count updates immediately.

### Remove Item
- Removes the item; updates progress.

### Category Filter
- Filters displayed items by category. "All" shows all.

### Packed Filter
- "Show All" shows all items (default).
- "Show Unpacked" shows only unpacked items.
- Both filters can be combined (category AND packed filter).

### Progress
- Always counts from the full unfiltered list.
- Format: "{packed_count} / {total_count} packed"

## Edge Cases
- All items packed: progress shows "{n} / {n} packed".
- After remove, progress count decreases.
