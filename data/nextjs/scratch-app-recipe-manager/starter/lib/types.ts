export interface Recipe {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  category: "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
  createdAt: string;
}
