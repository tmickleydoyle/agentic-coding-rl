import type { WishItem, Category } from "./types";
export function getItems(): WishItem[] { return []; }
export function addItem(_data: Omit<WishItem, "id" | "addedAt" | "purchased">): WishItem { throw new Error("Not implemented"); }
export function updateItem(_id: string, _patch: Partial<Pick<WishItem, "purchased">>): WishItem | null { return null; }
export function removeItem(_id: string): boolean { return false; }
export function getCategories(): Category[] { return []; }
export function addCategory(_name: string): Category { throw new Error("Not implemented"); }
export function __reset(): void {}
