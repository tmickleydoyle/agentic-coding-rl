export type PantryCategory = "grain" | "canned" | "spice" | "oil" | "snack" | "condiment" | "other";

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: PantryCategory;
  threshold: number;
  expiresAt: string;
}
