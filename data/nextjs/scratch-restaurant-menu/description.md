# Restaurant Menu App

Build a single-page restaurant menu app where users can browse menu items by category and add them to a cart.

## Seed Data

Three categories with items:

**Appetizers**
- Soup of the Day — $5.99
- Bruschetta — $7.49
- Calamari — $9.99

**Mains**
- Grilled Salmon — $18.99
- Pasta Carbonara — $14.99
- Veggie Burger — $12.49

**Desserts**
- Cheesecake — $6.99
- Chocolate Lava Cake — $7.99
- Tiramisu — $6.49

## UI Layout

- Page heading: "Restaurant Menu"
- A row of category filter buttons: "All", "Appetizers", "Mains", "Desserts"
- A grid of menu item cards. Each card shows:
  - Item name
  - Price formatted as "$X.XX"
  - Category label
  - "Add to Cart" button
- A cart summary section at the bottom showing:
  - List of cart items (name + price each)
  - Total item count (data-testid="cart-count")
  - Total price (data-testid="cart-total") formatted as "$X.XX"
  - A "Clear Cart" button

## Interactions

1. **Filter by category**: Clicking a category button filters displayed menu items to only that category. "All" shows all items. Active filter button has aria-pressed="true".
2. **Add to Cart**: Clicking "Add to Cart" on a card appends that item to the cart. The same item can be added multiple times.
3. **Cart count**: Total number of items in cart (including duplicates).
4. **Cart total**: Sum of prices of all cart items.
5. **Clear Cart**: Empties the cart.

## Edge Cases

- When cart is empty, cart-total shows "$0.00" and cart-count shows "0".
- Adding the same item twice shows it twice in the cart list.
- Filtering does not affect the cart.
