export type GroceryCategory = "produce" | "dairy" | "meat" | "bakery" | "frozen" | "pantry" | "beverages";

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: GroceryCategory;
  checked: boolean;
}
