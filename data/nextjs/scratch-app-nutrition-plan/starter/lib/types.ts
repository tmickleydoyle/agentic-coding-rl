export type MealTime = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  time: MealTime;
  foods: FoodItem[];
}

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type Route = "meals" | "foods" | "daily" | "summary";
