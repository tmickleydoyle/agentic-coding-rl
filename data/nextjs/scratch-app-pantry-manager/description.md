# Pantry Manager App

Build a multi-route React app for tracking pantry inventory.

## Routes
- `/` — Inventory: full list of pantry items with current stock levels
- `/add-item` — Form to add a new pantry item
- `/low-stock` — Shows items where quantity <= threshold (default threshold = 2)

## Data Model (lib/types.ts)
```ts
type PantryCategory = "grain" | "canned" | "spice" | "oil" | "snack" | "condiment" | "other";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: PantryCategory;
  threshold: number;  // alert when quantity <= threshold
  expiresAt: string;  // ISO date string
}
```

## State (lib/store.ts)
- `getItems(): PantryItem[]`
- `addItem(data: Omit<PantryItem, "id">): PantryItem`
- `updateQuantity(id: string, delta: number): void` — adds delta to quantity (min 0)
- `deleteItem(id: string): void`
- `getLowStock(): PantryItem[]` — items where quantity <= threshold
- `__reset(): void`

## Seed Data (5 items)
1. id:"p1", name:"Rice", quantity:5, unit:"cups", category:"grain", threshold:2, expiresAt:"2025-12-01T00:00:00.000Z"
2. id:"p2", name:"Olive Oil", quantity:1, unit:"bottle", category:"oil", threshold:2, expiresAt:"2025-06-01T00:00:00.000Z"
3. id:"p3", name:"Salt", quantity:10, unit:"oz", category:"spice", threshold:2, expiresAt:"2026-01-01T00:00:00.000Z"
4. id:"p4", name:"Canned Tomatoes", quantity:2, unit:"cans", category:"canned", threshold:3, expiresAt:"2025-08-01T00:00:00.000Z"
5. id:"p5", name:"Honey", quantity:1, unit:"jar", category:"condiment", threshold:1, expiresAt:"2026-03-01T00:00:00.000Z"

## API (app/api/pantry/route.ts)
- GET /api/pantry — returns { items: PantryItem[] }
- POST /api/pantry — body is full item minus id — returns created item, status 201

## UI Behaviors
- Inventory shows all items with data-testid="pantry-item"
- Each item has increment/decrement buttons: data-testid="increment-{id}", "decrement-{id}"
- Total item count: data-testid="total-items"
- Low stock page shows items with data-testid="low-stock-item"
- Low stock count badge: data-testid="low-stock-count"
- Add item form validates: name required
- Delete button: data-testid="delete-btn-{id}"

## data-testid attributes
- "nav-inventory", "nav-add-item", "nav-low-stock"
- "pantry-item", "increment-{id}", "decrement-{id}", "delete-btn-{id}"
- "total-items", "low-stock-count"
- "add-item-form", "input-name", "input-quantity", "input-unit", "select-category", "input-threshold", "input-expires", "submit-btn", "error-message"
- "low-stock-item"
