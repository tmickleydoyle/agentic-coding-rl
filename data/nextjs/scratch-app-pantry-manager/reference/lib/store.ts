import { PantryItem } from "./types";

const SEED: PantryItem[] = [
  { id: "p1", name: "Rice", quantity: 5, unit: "cups", category: "grain", threshold: 2, expiresAt: "2025-12-01T00:00:00.000Z" },
  { id: "p2", name: "Olive Oil", quantity: 1, unit: "bottle", category: "oil", threshold: 2, expiresAt: "2025-06-01T00:00:00.000Z" },
  { id: "p3", name: "Salt", quantity: 10, unit: "oz", category: "spice", threshold: 2, expiresAt: "2026-01-01T00:00:00.000Z" },
  { id: "p4", name: "Canned Tomatoes", quantity: 2, unit: "cans", category: "canned", threshold: 3, expiresAt: "2025-08-01T00:00:00.000Z" },
  { id: "p5", name: "Honey", quantity: 1, unit: "jar", category: "condiment", threshold: 1, expiresAt: "2026-03-01T00:00:00.000Z" },
];

let items: PantryItem[] = SEED.map((i) => ({ ...i }));
let nextId = 6;

export function getItems(): PantryItem[] { return items; }

export function addItem(data: Omit<PantryItem, "id">): PantryItem {
  const item: PantryItem = { ...data, id: `p${nextId++}` };
  items = [...items, item];
  return item;
}

export function updateQuantity(id: string, delta: number): void {
  items = items.map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i);
}

export function deleteItem(id: string): void {
  items = items.filter((i) => i.id !== id);
}

export function getLowStock(): PantryItem[] {
  return items.filter((i) => i.quantity <= i.threshold);
}

export function __reset(): void {
  items = SEED.map((i) => ({ ...i }));
  nextId = 6;
}
