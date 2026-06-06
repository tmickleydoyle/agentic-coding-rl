import { PantryItem } from "./types";

export function getItems(): PantryItem[] { return []; }
export function addItem(_data: Omit<PantryItem, "id">): PantryItem { return { id: "", name: "", quantity: 0, unit: "", category: "grain", threshold: 0, expiresAt: "" }; }
export function updateQuantity(_id: string, _delta: number): void {}
export function deleteItem(_id: string): void {}
export function getLowStock(): PantryItem[] { return []; }
export function __reset(): void {}
