export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface DietEntry {
  id: string;
  date: string;
  mealType: MealType;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
}
