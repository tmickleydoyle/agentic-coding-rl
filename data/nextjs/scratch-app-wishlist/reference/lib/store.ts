import type { WishItem, Priority, Category } from "./types";

let items: WishItem[] = [
  { id: "1", name: "Mechanical Keyboard", price: 150, url: "https://example.com/kb", category: "Tech", priority: "high", purchased: false, addedAt: "2024-01-01" },
  { id: "2", name: "Running Shoes", price: 120, url: "https://example.com/shoes", category: "Sports", priority: "medium", purchased: false, addedAt: "2024-01-10" },
];
let categories: Category[] = [
  { id: "c1", name: "Tech" },
  { id: "c2", name: "Sports" },
];
let nextItemId = 3;
let nextCatId = 3;

export function getItems(): WishItem[] { return items; }
export function addItem(data: Omit<WishItem, "id" | "addedAt" | "purchased">): WishItem {
  const item: WishItem = { id: String(nextItemId++), ...data, purchased: false, addedAt: new Date().toISOString().slice(0, 10) };
  items.push(item);
  return item;
}
export function updateItem(id: string, patch: Partial<Pick<WishItem, "purchased">>): WishItem | null {
  const item = items.find((i) => i.id === id);
  if (!item) return null;
  if (patch.purchased !== undefined) item.purchased = patch.purchased;
  return item;
}
export function removeItem(id: string): boolean {
  const before = items.length;
  items = items.filter((i) => i.id !== id);
  return items.length < before;
}
export function getCategories(): Category[] { return categories; }
export function addCategory(name: string): Category {
  const cat: Category = { id: `c${nextCatId++}`, name };
  categories.push(cat);
  return cat;
}
export function __reset(): void {
  items = [
    { id: "1", name: "Mechanical Keyboard", price: 150, url: "https://example.com/kb", category: "Tech", priority: "high", purchased: false, addedAt: "2024-01-01" },
    { id: "2", name: "Running Shoes", price: 120, url: "https://example.com/shoes", category: "Sports", priority: "medium", purchased: false, addedAt: "2024-01-10" },
  ];
  categories = [{ id: "c1", name: "Tech" }, { id: "c2", name: "Sports" }];
  nextItemId = 3;
  nextCatId = 3;
}
