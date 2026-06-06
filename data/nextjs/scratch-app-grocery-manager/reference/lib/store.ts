import { GroceryItem } from "./types";

const SEED: GroceryItem[] = [
  { id: "g1", name: "Apples", quantity: 3, unit: "lbs", category: "produce", checked: false },
  { id: "g2", name: "Milk", quantity: 1, unit: "gallon", category: "dairy", checked: false },
  { id: "g3", name: "Chicken Breast", quantity: 2, unit: "lbs", category: "meat", checked: true },
  { id: "g4", name: "Bread", quantity: 1, unit: "loaf", category: "bakery", checked: false },
  { id: "g5", name: "Orange Juice", quantity: 1, unit: "carton", category: "beverages", checked: false },
];

let items: GroceryItem[] = SEED.map((i) => ({ ...i }));
let nextId = 6;

export function getItems(): GroceryItem[] { return items; }

export function addItem(data: Omit<GroceryItem, "id" | "checked">): GroceryItem {
  const item: GroceryItem = { ...data, id: `g${nextId++}`, checked: false };
  items = [...items, item];
  return item;
}

export function toggleItem(id: string): void {
  items = items.map((i) => i.id === id ? { ...i, checked: !i.checked } : i);
}

export function deleteItem(id: string): void {
  items = items.filter((i) => i.id !== id);
}

export function __reset(): void {
  items = SEED.map((i) => ({ ...i }));
  nextId = 6;
}
