# Grocery Manager App

Build a multi-route React app for managing a grocery shopping list.

## Routes
- `/` — Shopping List: shows all items grouped by category, with check-off capability
- `/add-item` — Form to add a grocery item
- `/categories` — Shows a summary count per category

## Data Model (lib/types.ts)
```ts
type GroceryCategory = "produce" | "dairy" | "meat" | "bakery" | "frozen" | "pantry" | "beverages";

interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;       // e.g. "lbs", "oz", "count"
  category: GroceryCategory;
  checked: boolean;
}
```

## State (lib/store.ts)
- `getItems(): GroceryItem[]`
- `addItem(data: Omit<GroceryItem, "id" | "checked">): GroceryItem`
- `toggleItem(id: string): void` — flips checked
- `deleteItem(id: string): void`
- `__reset(): void`

## Seed Data (5 items)
1. id:"g1", name:"Apples", quantity:3, unit:"lbs", category:"produce", checked:false
2. id:"g2", name:"Milk", quantity:1, unit:"gallon", category:"dairy", checked:false
3. id:"g3", name:"Chicken Breast", quantity:2, unit:"lbs", category:"meat", checked:true
4. id:"g4", name:"Bread", quantity:1, unit:"loaf", category:"bakery", checked:false
5. id:"g5", name:"Orange Juice", quantity:1, unit:"carton", category:"beverages", checked:false

## API (app/api/items/route.ts)
- GET /api/items — returns { items: GroceryItem[] }
- POST /api/items — body { name, quantity, unit, category } — returns created item, status 201

## UI Behaviors
- Shopping list shows items with data-testid="grocery-item"
- Each item has a checkbox with data-testid="item-checkbox-{id}"
- Checked items appear with strikethrough styling (or "checked" class)
- Unchecked count shown with data-testid="unchecked-count"
- Total item count shown with data-testid="total-count"
- Categories page shows data-testid="category-row" for each category that has items
- Add item form validates: name required; quantity must be > 0

## data-testid attributes
- "nav-shopping-list", "nav-add-item", "nav-categories"
- "grocery-item", "item-checkbox-{id}"
- "unchecked-count", "total-count"
- "add-item-form", "input-name", "input-quantity", "input-unit", "select-category", "submit-btn", "error-message"
- "category-row"
- "delete-btn-{id}"
