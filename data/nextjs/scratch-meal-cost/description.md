# Meal Cost Splitter App

Build a single-page app for splitting a meal bill among multiple people, with per-person item assignment, tip, and final totals.

## Seed Data

Start with 3 people and 4 items:

**People**: Alice, Bob, Carol

**Items**:
| Name            | Price  | Assigned to |
|-----------------|--------|-------------|
| Caesar Salad    | $8.50  | Alice       |
| Margherita Pizza| $14.00 | Bob         |
| Pasta Arrabiata | $12.50 | Carol       |
| Garlic Bread    | $4.00  | Alice       |

## UI Layout

- Page heading: "Meal Cost Splitter"
- An "Add Person" section: text input labeled "Person Name" + "Add Person" button
- An "Add Item" section with:
  - Text input labeled "Item Name"
  - Number input labeled "Item Price"
  - Select dropdown labeled "Assign To" listing current people
  - "Add Item" button
- A list of items (data-testid="bill-item" per row) showing name, price, assignee, and a "Delete" button
- A tip section: number input labeled "Tip %" pre-filled with 15
- A results section showing per-person totals (data-testid="person-total" per row) formatted as "Name: $X.XX" including their share of the tip
- Grand total (data-testid="grand-total") showing total bill + tip formatted as "$X.XX"

## Calculations

- Each person's subtotal = sum of their assigned item prices
- Tip is applied proportionally: person_tip = person_subtotal / bill_subtotal * tip_amount
- tip_amount = bill_subtotal * (tip_pct / 100)
- person_total = person_subtotal + person_tip
- grand_total = bill_subtotal + tip_amount

## Interactions

1. **Add Person**: Typing a name and clicking "Add Person" adds them to the people list (and to the "Assign To" dropdown). Empty name is ignored.
2. **Add Item**: Filling in name, price (> 0), and selecting a person then clicking "Add Item" adds the item. Clears form on success.
3. **Delete Item**: Clicking "Delete" removes the item from the list.
4. **Tip %**: Changing tip percentage recalculates all totals.
5. **Person totals**: Update live as items are added/removed.

## Edge Cases

- If bill subtotal is 0, all person totals show $0.00.
- Empty item name or zero price prevents adding.
- grand-total includes tip.
