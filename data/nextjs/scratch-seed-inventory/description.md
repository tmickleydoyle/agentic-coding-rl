# Seed Inventory

Build a single-page React app for managing a seed packet inventory.

## Seed Data

```
const SEEDS = [
  { id: 1, name: "Beefsteak Tomato", variety: "Heirloom", quantity: 50, unit: "seeds", expiryYear: 2025, planted: false },
  { id: 2, name: "Basil", variety: "Genovese", quantity: 3, unit: "packets", expiryYear: 2024, planted: false },
  { id: 3, name: "Zucchini", variety: "Black Beauty", quantity: 12, unit: "seeds", expiryYear: 2026, planted: true },
  { id: 4, name: "Sunflower", variety: "Giant Russian", quantity: 25, unit: "seeds", expiryYear: 2025, planted: false },
]
```

## UI Layout

- `<h1>` with text "Seed Inventory"
- An "Add Seed" form (data-testid="add-seed-form") with:
  - Name text input (data-testid="seed-name-input")
  - Variety text input (data-testid="seed-variety-input")
  - Quantity number input (data-testid="seed-quantity-input")
  - Unit select: "seeds", "packets", "grams" (data-testid="seed-unit-select")
  - Expiry year number input (data-testid="seed-expiry-input")
  - Submit button "Add Seed" (data-testid="add-seed-btn")
- A filter row with:
  - Checkbox "Show only unplanted" (data-testid="unplanted-filter")
  - Checkbox "Show only expiring soon (≤ current year + 1)" (data-testid="expiring-filter")
- A seed table (data-testid="seed-table") with columns: Name, Variety, Quantity, Unit, Expiry Year, Planted, Actions
- Each row has:
  - data-testid="seed-row-{id}"
  - A "Mark Planted" button (data-testid="mark-planted-{id}") — disabled if already planted
  - A "Delete" button (data-testid="delete-seed-{id}")
- A summary line "Total: X seed entries, Y unplanted" (data-testid="summary")

## Behaviors

1. On load, all 4 seed entries are displayed.
2. Submitting the form adds a new seed entry. Name, variety, quantity, and expiry year are required.
3. Quantity must be > 0. Expiry year must be a 4-digit year >= 2020. Invalid values prevent submission.
4. The form clears after successful submission.
5. "Mark Planted" toggles planted to true and disables the button.
6. Deleting a seed removes it from the table.
7. "Show only unplanted" filter hides planted seeds.
8. "Expiring soon" filter shows only seeds with expiryYear <= current year + 1 (use 2025 as current year in tests).
9. Both filters can be active simultaneously (AND logic).
10. Summary counts update whenever the inventory changes (not affected by filters — counts all items).

## Edge Cases

- Adding a seed with quantity 0 should be rejected
- Expiry year 2019 should be rejected
- A newly added seed starts as unplanted
- Variety is required (cannot be empty)
