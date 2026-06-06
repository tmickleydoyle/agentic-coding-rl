import { GroceryItem } from "./types";

export function getItems(): GroceryItem[] { return []; }
export function addItem(_data: Omit<GroceryItem, "id" | "checked">): GroceryItem { return { id: "", name: "", quantity: 0, unit: "", category: "produce", checked: false }; }
export function toggleItem(_id: string): void {}
export function deleteItem(_id: string): void {}
export function __reset(): void {}
